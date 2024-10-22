import { mongoConnection } from "./../utils/mongoConnection"
import shopDetails from "./models/shopDetails";
import shopifySessions from "./models/shopifySessions";
import { sessionStorage } from "../shopify.server";
import shopify from "./../shopify.server"; // Import shopify server setup



export async function action() {
	await mongoConnection();

	try {
		const shopSessions = await shopifySessions.find({});
		for (const session of shopSessions) {
			if (session) {
				console.log(`Session found for shop: ${session.id}`);

				const webhooks = await shopify.registerWebhooks({
					session
				});
				console.log(webhooks);
				console.log(`Webhook created for shop: ${session.id}`);
			} else {
				console.error(`Session not found for shop: ${session.id}`);
			}

		}
	} catch (error) {
		console.error(`error while register webhooks:`);
	}



	return new Response("Webhooks re-registered successfully.");
}
