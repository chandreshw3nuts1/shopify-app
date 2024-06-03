import { mongoConnection } from './mongoConnection'; 
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

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

export async function getShopDetails(request) {
	try{
	  const { session } = await authenticate.admin(request);
	  const { shop } = session;
	  return await findOneRecord("shop", {"domain" : shop});
  	} catch (error) {
	  console.error('Error fetching shop record:', error);
  	}
}


export async function getShopDetailsByShop(shop) {
	try{
		return await findOneRecord("shop", {"domain" : shop});
	} catch (error) {
		console.error('Error fetching shop record by shop:', error);
  	}
}

