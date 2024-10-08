import { authenticate } from "../shopify.server";
import { findOneRecord } from "./common";

export async function getShopDetails(request) {
    try {
        const { session } = await authenticate.admin(request);

        if (!session) {
            throw new Error('Session not found');
        }

        const { shop } = session;
        if (!shop) {
            throw new Error('Shop not found in session');
        }

        const shopDetails = await findOneRecord("shop_details", {
            $or: [
                { shop: shop },
                { myshopify_domain: shop }
            ]
        });

        if (!shopDetails) {
            throw new Error('Shop details not found in the database');
        }

        return shopDetails;
    } catch (error) {
        console.error('Error fetching shop record:', error);
        // Handle error by returning a specific response or throwing an error to be caught by the caller
        return null; // or handle the error as needed
    }
}
