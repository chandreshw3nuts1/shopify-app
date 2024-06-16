import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import { GraphQLClient } from "graphql-request";
import { mongoConnection } from "./../utils/mongoConnection"; 
import { findOneRecord } from "./../utils/common"; 
import EmailTemplate from './components/email/EmailTemplate';
import ReactDOMServer from 'react-dom/server';
// import ObjectId from 'bson-objectid';
import { ObjectId } from 'mongodb';

export async function loader() {

	
	const email = 'chandresh.w3nuts@gmail.com';
	const recipientName ="Chands";
	const content ="okok okoko ko ko ";
	const footer ="footer footerfooterfooter ";
	
	const subject = 'my subject';
	const emailHtml = ReactDOMServer.renderToStaticMarkup(
		<EmailTemplate recipientName={recipientName} content={content} footer={footer} />
	  );
	// const response = await sendEmail({
	// 	to: email,
	// 	subject,
	// 	html: emailHtml,
	// });

	const options = [
		{ label: 'Option 1', value: 'option1' },
		{ label: 'Option 2', value: 'option2' },
		{ label: 'Option 3', value: 'option3' },
		];
	return json(options);
}


export async function action({ request} ) {
	const requestBody = await request.json();
   
	const method = request.method;
	const db = await mongoConnection();
	const collectionName = 'product-reviews';

	switch(method){
		case "POST":
			var {shop, page, limit , filter_status,filter_stars, search_keyword, actionType } = requestBody;
			page = page == 0 ? 1 : page;
			try {
				if (actionType == 'changeReviewStatus') {
					const collection = db.collection(collectionName);
					const objectId = new ObjectId(requestBody.oid);

					const result = await collection.updateOne({_id : objectId}, {
							$set: {
							status : requestBody.value
						}
					});
					
					return json({"status" : 200, "message" : "Status updated!"});
					
				} else if (actionType == 'addReviewReply') {
					const collection = db.collection(collectionName);
					const objectId = new ObjectId(requestBody.review_id);

					const result = await collection.updateOne({_id : objectId}, {
							$set: { 
							replyText : requestBody.reply
						}
					});
					if(requestBody.subActionType == 'editReview'){
						var msg = "Your reply updated!";
					} else if(requestBody.subActionType == 'deleteReply'){
						var msg = "Your reply deleted!";
					} else{
						var msg = "Your reply added!";
					}
					return json({"status" : 200, "message" : msg});
					
				} else if (actionType == 'bulkRatingStatus') {
					const {shop, filter_status,filter_stars, search_keyword } = requestBody.searchFormData;
					
					const shopRecords = await findOneRecord("shopify_sessions", {"shop" : shop});
					const query = {
						"shop_id" : shopRecords._id, "status" : filter_status, "rating" : parseInt(filter_stars),
						$or: [
							{ first_name: { $regex: search_keyword, $options: 'i' } },
							{ last_name: { $regex: search_keyword, $options: 'i' } },
							{ product_title: { $regex: search_keyword, $options: 'i' } }
							]
					};
					if(filter_status == 'all'){
						delete query['status'];
					}if(filter_stars == 'all'){
						delete query['rating'];
					}
					if(requestBody.subActionType == 'delete') {
						await db.collection(collectionName).deleteMany(query);
						var msg = "Review deleted";
					} else {
						await db.collection(collectionName).updateMany(
							query,
							{ $set: { status: requestBody.subActionType } }
						);

						if(requestBody.subActionType == 'publish') {
							var msg = "Review published";
						} else {
							var msg = "Review unpublished";
						}

					}
					return json({"status" : 200, "message" : msg});
					
				} else if (actionType == 'imageSliderAction') {
					const {doc_id, review_id, subActionType } = requestBody;
					const collection = db.collection('review-documents');
					const reviewId = new ObjectId(review_id);
					const docId = new ObjectId(doc_id);
					
					if (subActionType == 'makeCoverPhoto') {
						await collection.updateMany({review_id : reviewId}, {
							$set: { 
								is_cover : false
							}
						});
						
						await collection.updateOne({_id : docId}, {
							$set: { 
								is_cover : true
							}
						});
						var msg = "Cover photo set";
					} else if (subActionType == 'hidePhoto') {
						await collection.updateOne({_id : docId}, {
							$set: { 
								is_approve : false
							}
						});
						var msg = "Photo hidden";
					} else if (subActionType == 'approvePhoto') {
						await collection.updateOne({_id : docId}, {
							$set: { 
								is_approve : true
							}
						});
						var msg = "Photo approve";
					}
					

					return json({"status" : 200, "message" : msg});
				} else {
					const shopRecords = await findOneRecord("shopify_sessions", {"shop" : shop});
					const query = {
						"shop_id" : shopRecords._id, "status" : filter_status, "rating" : parseInt(filter_stars),
						$or: [
							{ first_name: { $regex: search_keyword, $options: 'i' } },
							{ last_name: { $regex: search_keyword, $options: 'i' } },
							{ product_title: { $regex: search_keyword, $options: 'i' } }
							]
					};
					if(filter_status == 'all'){
						delete query['status'];
					}if(filter_stars == 'all'){
						delete query['rating'];
					}
					// const reviewItems =  await db.collection('product-reviews')
					// 	.find(query)
					// 	.skip((page - 1) * limit)
					// 	.limit(limit)
					// 	.toArray();

					const totalReviewItems =  await db.collection(collectionName)
					.countDocuments(query);


					const reviewItems = await db.collection('product-reviews').aggregate([
						{ 
							$match: query 
						},
						{
							$sort: { created_at: -1 } 
						},
						{ 
							$skip: (page - 1) * limit 
						},
						{ 
							$limit: limit 
						},
						{
							$lookup: {
								from: 'review-documents',
								localField: '_id',
								foreignField: 'review_id',
								as: 'reviewDocuments'
							}
						},
						{
							$unwind: {
								path: "$reviewDocuments",
								preserveNullAndEmptyArrays: true
							}
						},
						{
							$lookup: {
								from: 'product-review-questions',
								localField: '_id',
								foreignField: 'review_id',
								as: 'reviewQuestionsAnswer'
							}
						},
						{
							$unwind: {
								path: "$reviewQuestionsAnswer",
								preserveNullAndEmptyArrays: true
							}
						},
						{
							$lookup: {
								from: "custom-questions",
								localField: "reviewQuestionsAnswer.question_id",
								foreignField: "_id",
								as: "reviewQuestionsAnswer.reviewQuestions"
							}
						},
						{
							$unwind: {
								path: "$reviewQuestionsAnswer.reviewQuestions",
								preserveNullAndEmptyArrays: true
							}
						},
						{
							$group: {
								_id: "$_id",
								description: { $first: "$description" },
								rating: { $first: "$rating" },
								first_name: { $first: "$first_name" },
								email: { $first: "$email" },
								last_name: { $first: "$last_name" },
								created_at: { $first: "$created_at" },
								status: { $first: "$status" },
								images: { $first: "$images" },
								replyText: { $first: "$replyText" },
								product_id: { $first: "$product_id" },
								reviewDocuments: { $addToSet: "$reviewDocuments" }, // Use $addToSet to avoid duplicates
								reviewQuestionsAnswer: { 
									$addToSet: { // Use $addToSet to avoid duplicates
										_id: "$reviewQuestionsAnswer._id",
										review_id: "$reviewQuestionsAnswer.review_id",
										answer: "$reviewQuestionsAnswer.answer",
										question_id: "$reviewQuestionsAnswer.question_id",
										reviewQuestions: {
											_id: "$reviewQuestionsAnswer.reviewQuestions._id",
											question: "$reviewQuestionsAnswer.reviewQuestions.question"
										}
									}
								}
							}
						},
						{
							$project: {
								_id: "$_id",
								description: "$description",
								rating: "$rating",
								first_name: "$first_name",
								email: "$email",
								last_name: "$last_name",
								created_at: "$created_at",
								status: "$status",
								images: "$images",
								replyText: "$replyText",
								product_id : "$product_id",
								reviewDocuments : "$reviewDocuments",
								reviewQuestionsAnswer: {
									$filter: {
										input: "$reviewQuestionsAnswer",
										as: "item",
										cond: { $ne: ["$$item._id", null] }
									}
								}
							}
						}
					]).toArray();
					var hasMore = 0;
					var mapProductDetails = {};
					if (reviewItems.length > 0) {
						var hasMore = 1;
						const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
						headers: {
								'X-Shopify-Access-Token': shopRecords.accessToken,
							},
						});
						const uniqueProductIds = [...new Set(reviewItems.map(item => item.product_id))];

						const productIds = uniqueProductIds.map((item) =>  `"gid://shopify/Product/${item}"`);

						const query = `{
							nodes(ids: [${productIds}]) {
								... on Product {
									id
									title
									handle
									description
									images(first: 1) {
										edges {
											node {
												id
												transformedSrc(maxWidth: 100, maxHeight: 100)
											}
										}
									}
								}
							}
						} `;

						var productsDetails = await client.request(query);

						if(productsDetails.nodes.length > 0) {
							productsDetails = productsDetails.nodes;
							productsDetails.forEach(node => {
								if(node) {
									const id = node.id.split('/').pop();
									mapProductDetails[id] = node;
								}
								
							});
						}
					}

					const mapReviewItems = {};
					reviewItems.map(items => {
						items.productDetails = mapProductDetails[items.product_id];
						return items;
					});

					return json({reviewItems, totalReviewItems,  hasMore});
				}
				

			  } catch (error) {
				return json({"status" : 400, "message" : "Operation failed"});
			  }
		case "DELETE":
			try{
				var {review_id} = requestBody;
				const objectId = new ObjectId(review_id);
				const reviewItems =  await db.collection(collectionName).deleteOne({ _id: objectId });
				return json({"status" : 200, "message" : "Review deleted successfully!"});
			} catch (error) {
				return json({"status" : 400, "message" : "Error deleting record!"});

			}
			
		default:

		return json({"message" : "hello", "method" : "POST"});

	}
}

