import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import { GraphQLClient } from "graphql-request";
import { mongoConnection } from "./../utils/mongoConnection"; 
import { getShopDetails } from "./../utils/common"; 
import EmailTemplate from './components/email/EmailTemplate';
import ReactDOMServer from 'react-dom/server';

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
    const {shop, page, limit , param1, param2 } = requestBody;

	const method = request.method;
	switch(method){
		case "POST":
			try {
				const db = await mongoConnection();

				const shopCollection = db.collection('shop');
				const shopRecords = await shopCollection.findOne({"domain" : shop});
				
				const reviewItems =  await db.collection('product-reviews')
				
					.find({"shop_id" : shopRecords._id})
					.skip((page - 1) * limit)
					.limit(limit)
					.toArray();

				
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
			

				// const options = [
				// 	{ label: 'Option 1', value: 'option1' },
				// 	{ label: 'Option 2', value: 'option2' },
				// 	{ label: 'Option 3', value: 'option3' },
				// 	];
				
				return json({reviewItems, hasMore: hasMore});

				//return json([{ reviewItems: reviewItems, hasMore : hasMore }]);
				//return json({ reviewItems: reviewItems, productsDetails : productsDetails, hasMore : hasMore });
			  } catch (error) {
				console.error('Error updating record:', error);
				return json({ error: 'Failed to update record' }, { status: 500 });
			  }
		case "PATCH":

			
		default:

		return json({"message" : "hello", "method" : "POST"});

	}
}

