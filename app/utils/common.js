import { mongoConnection } from './mongoConnection'; 
import { json } from "@remix-run/node";
import { GraphQLClient } from "graphql-request";
import customQuestions from './../routes/models/customQuestions';

export async function findOneRecord(collection = "", params = {}) {
	try{
		if (collection && params) {
			const db = await mongoConnection();
			const response = await db.collection(collection).findOne(params);
			return response;
		}

  	} catch (error) {
	  console.error('Error fetching findOneRecord record:', error);
  	}
}

export async function getShopDetailsByShop(shop) {
	try{
		
		return await findOneRecord("shop_details", {"shop" : shop});
	} catch (error) {
		console.error('Error fetching shop record by shop:', error);
  	}
}


export async function getCustomQuestions(params = {} ) {
	try{
		return await customQuestions.find(params);
	} catch (error) {
		console.error('Error fetching custom question record :', error);
  	}
}



export async function getShopifyProducts(shop, productIds = []) {
	try{
		const shopSessionRecords = await findOneRecord("shopify_sessions", {"shop" : shop});

		const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
			headers: {
					'X-Shopify-Access-Token': shopSessionRecords.accessToken,
				},
			});
	
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

		return await client.request(query);

	} catch (error) {
		console.error('Error fetching custom question record :', error);
  	}
}
