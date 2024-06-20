import { mongoConnection } from './mongoConnection'; 
import { json } from "@remix-run/node";
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
