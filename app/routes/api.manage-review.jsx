import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import { GraphQLClient } from "graphql-request";
import { mongoConnection } from "./../utils/mongoConnection"; 
import { findOneRecord } from "./../utils/common"; 
import EmailTemplate from './components/email/EmailTemplate';
import ReactDOMServer from 'react-dom/server';
// import ObjectId from 'bson-objectid';
import { ObjectId } from 'mongodb';
import productReviews from "./models/productReviews";
import productReviewQuestions from "./models/productReviewQuestions";
import reviewDocuments from "./models/reviewDocuments";

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
	const collectionName = 'product_reviews';

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
					
					const shopRecords = await findOneRecord("shop_details", {"shop" : shop});
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

						const reviewModels = await productReviews.find(query).select('_id');

						const reviewIds = reviewModels.map(review => review._id);

						await productReviewQuestions.deleteMany({ review_id : { $in: reviewIds } });
						await reviewDocuments.deleteMany({ review_id : { $in: reviewIds } });

						await productReviews.deleteMany(query);
						
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
					const collection = db.collection('review_documents');
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
				} else if (actionType == 'moreOptionChange') {
					const {review_id, subActionType } = requestBody;
					
					const reviewId = new ObjectId(review_id);

					if (subActionType == 'feature') {
						
						await productReviews.updateOne(
							{ _id: reviewId },
							{
							  $set: { tag_as_feature: true }
							},
							{ upsert: true }
						  );
						  
						
						var msg = "Feature tag added";
					} else if (subActionType == 'remove-feature') {
						
						await productReviews.updateOne(
							{ _id: reviewId },
							{
							  $set: { tag_as_feature: false }
							},
							{ upsert: true }
						  );
						  
						
						var msg = "Feature tag removed";
					} else if (subActionType == 'verify-badge') {
						
						await productReviews.updateOne(
							{ _id: reviewId },
							{
							  $set: { verify_badge: true }
							},
							{ upsert: true }
						  );
						  
						
						var msg = "Verified badge added";
					} else if (subActionType == 'remove-verify-badge') {
						
						await productReviews.updateOne(
							{ _id: reviewId },
							{
							  $set: { verify_badge: false }
							},
							{ upsert: true }
						  );
						  
						
						var msg = "Verified badge removed";
					} else if (subActionType == 'add-to-carousel') {
						
						await productReviews.updateOne(
							{ _id: reviewId },
							{
							  $set: { add_to_carousel: true }
							},
							{ upsert: true }
						  );
						
						var msg = "Review added";
					} else if (subActionType == 'remove-add-to-carousel') {
						
						await productReviews.updateOne(
							{ _id: reviewId },
							{
							  $set: { add_to_carousel: false }
							},
							{ upsert: true }
						  );
						
						var msg = "Review removed";
					}
					

					return json({"status" : 200, "message" : msg});
				} else {
					const shopRecords = await findOneRecord("shop_details", {"shop" : shop});
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
					// const reviewItems =  await db.collection('product_reviews')
					// 	.find(query)
					// 	.skip((page - 1) * limit)
					// 	.limit(limit)
					// 	.toArray();

					const totalReviewItems = await productReviews.countDocuments(query);

					const reviewItems = await productReviews.aggregate([
						{ 
							$match: query 
						},
						{
							$sort: { createdAt: -1 } 
						},
						{ 
							$skip: (page - 1) * limit 
						},
						{ 
							$limit: limit 
						},
						{
							$lookup: {
								from: 'review_documents',
								localField: '_id',
								foreignField: 'review_id',
								as: 'reviewDocuments'
							}
						},
						{
							$lookup: {
								from: 'product_review_questions',
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
								from: "custom_questions",
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
								display_name: { $first: "$display_name" },
								email: { $first: "$email" },
								last_name: { $first: "$last_name" },
								createdAt: { $first: "$createdAt" },
								status: { $first: "$status" },
								replyText: { $first: "$replyText" },
								product_id: { $first: "$product_id" },
								is_review_request: { $first: "$is_review_request" },
								tag_as_feature: { $first: "$tag_as_feature" },
								verify_badge: { $first: "$verify_badge" },
								add_to_carousel: { $first: "$add_to_carousel" },
								
								reviewDocuments: { $first: "$reviewDocuments" }, // Use $first to avoid duplicates
								reviewQuestionsAnswer: { 
									$push: {
										_id: "$reviewQuestionsAnswer._id",
										review_id: "$reviewQuestionsAnswer.review_id",
										answer: "$reviewQuestionsAnswer.answer",
										question_name: "$reviewQuestionsAnswer.question_name",
										question_id: "$reviewQuestionsAnswer.question_id",
										createdAt: "$reviewQuestionsAnswer.createdAt",
										reviewQuestions: {
											_id: "$reviewQuestionsAnswer.reviewQuestions._id",
											question: "$reviewQuestionsAnswer.reviewQuestions.question",
											createdAt: "$reviewQuestionsAnswer.reviewQuestions.createdAt"
										}
									}
								}
							}
						},
						{
							$sort: { createdAt: -1 }
						},
						{
							$project: {
								_id: 1,
								description: 1,
								rating: 1,
								first_name: 1,
								display_name: 1,
								email: 1,
								last_name: 1,
								createdAt: 1,
								status: 1,
								images: 1,
								replyText: 1,
								product_id: 1,
								is_review_request: 1,
								tag_as_feature : 1,
								verify_badge : 1,
								add_to_carousel : 1,
								reviewDocuments: 1,
								reviewQuestionsAnswer: {
									$filter: {
										input: "$reviewQuestionsAnswer",
										as: "item",
										cond: { $ne: ["$$item._id", null] }
									}
								}
							}
						}
					]);
					
					
					
					// return reviewItems;
					var hasMore = 0;
					var mapProductDetails = {};
					if (reviewItems.length > 0) {
						const shopSessionRecords = await findOneRecord("shopify_sessions", {"shop" : shop});

						var hasMore = 1;
						const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
						headers: {
								'X-Shopify-Access-Token': shopSessionRecords.accessToken,
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
				console.log(error);
				return json({"status" : 400, "message" : "Operation failed"});
			  }
		case "DELETE":
			try{
				var {review_id} = requestBody;
				const objectId = new ObjectId(review_id);
				deleteReview(review_id);
				return json({"status" : 200, "message" : "Review deleted successfully!"});
			} catch (error) {
				return json({"status" : 400, "message" : "Error deleting record!"});
			}
			
		default:

		return json({"message" : "hello", "method" : "POST"});

	}

}


async function deleteReview(review_id){
	await productReviews.findOneAndDelete({_id : review_id});
	 
	await productReviewQuestions.deleteMany({review_id : review_id});
	await reviewDocuments.deleteMany({review_id : review_id});
}

