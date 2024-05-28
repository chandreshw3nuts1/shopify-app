import { mongoConnection } from './mongoConnection'; 
import { authenticate } from "../shopify.server";
import { json } from "@remix-run/node";

export async function getShopDetails(request) {
	try{
	  const { session } = await authenticate.admin(request);
	  const { shop } = session;
	  
	  const db = await mongoConnection();
	  const shopCollection = db.collection('shop');
	  const shopRecords = await shopCollection.findOne({"domain" : shop});
	  return shopRecords;

  } catch (error) {
	  console.error('Error fetching shop record:', error);
  } 
}


export async function getShopDetailsByShop(shop) {
	try{
	  
	  const db = await mongoConnection();
	  const shopCollection = db.collection('shop');
	  const shopRecords = await shopCollection.findOne({"domain" : shop});
	  return shopRecords;

  } catch (error) {
	  console.error('Error fetching shop record by shop:', error);
  }
}

