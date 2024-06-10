import { mongoConnection } from './mongoConnection'; 
import { authenticate } from "../shopify.server";
import { findOneRecord } from "./common";
import { json } from "@remix-run/node";

export async function getShopDetails(request) {
	try{
	  const { session } = await authenticate.admin(request);
	  const { shop } = session;
	  return await findOneRecord("shop", {"domain" : shop});
  	} catch (error) {
	  console.error('Error fetching shop record:', error);
  	}
}


