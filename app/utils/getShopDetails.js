import { authenticate } from "../shopify.server";
import { findOneRecord } from "./common";

export async function getShopDetails(request) {
	try{
	  const { session } = await authenticate.admin(request);
	  const { shop } = session;
	  return await findOneRecord("shop_details", {"shop" : shop});
  	} catch (error) {
	  console.error('Error fetching shop record:', error);
  	}
}


