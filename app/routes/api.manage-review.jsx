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
	switch(method){
		case "POST":
			var {shop, page, limit , filter_status,filter_stars, search_keyword, actionType } = requestBody;
			page = page == 0 ? 1 : page;
			try {
				const db = await mongoConnection();
				const collectionName = 'product-reviews';
				if (actionType == 'changeReviewStatus') {
					const collection = db.collection(collectionName);
					const objectId = new ObjectId(requestBody.oid);

					const result = await collection.updateOne({_id : objectId}, {
									$set: { 
									status : requestBody.value
								}
							});
					

					return json({"sdsad" :"sdsadsadsa"});
					
				} else {
					const shopRecords = await findOneRecord("shop", {"domain" : shop});
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


						const reviewItems = await db.collection('product-reviews').aggregate([
							{ 
							  $match: query 
							},
							{ 
							  $skip: (page - 1) * limit 
							},
							{ 
							  $limit: limit 
							},
							{ 
							  $lookup: {
								from: 'product-review-questions',
								localField: '_id',
								foreignField: 'review_id',
								as: 'reviewQuestions'
							  }
							}
							
						  ]).toArray();
					//console.log(reviewItems);
					var hasMore = 0;
					if (reviewItems.length > 0) {
						var hasMore = 1;
						
						const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
						headers: {
								'X-Shopify-Access-Token': shopRecords.accessToken,
							},
						});
						const productIds = reviewItems.map((item) =>  `"gid://shopify/Product/${item.product_id}"`);
						
						const query = `{
							nodes(ids: [${productIds}]) {
								... on Product {
									id
									title
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
						}
						//console.log(productsDetails);
					}
				
					return json({reviewItems, hasMore: hasMore});
				}

				

			  } catch (error) {
				console.error('Error updating record:', error);
				return json({ error: 'Failed to update record' }, { status: 500 });
			  }
		case "DELETE":
			try{
				var {review_id} = requestBody;
				console.log(review_id);
				const objectId = new ObjectId(review_id);
				const db = await mongoConnection();
				const reviewItems =  await db.collection('product-reviews').deleteOne({ _id: objectId });
				return json({"status" : 200, "message" : "Review deleted successfully!"});
			} catch (error) {
				console.error('Error deleting record:', error);
				return json({"status" : 400, "message" : "Error deleting record!"});

			}
			
		default:

		return json({"message" : "hello", "method" : "POST"});

	}
}

