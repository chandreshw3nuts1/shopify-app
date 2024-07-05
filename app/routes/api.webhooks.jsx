import { json } from "@remix-run/node";
import crypto from 'crypto';
import shopifySessions from './../routes/models/shopifySessions';
import appInstallLogs from './models/appInstallLogs';
import { getShopDetailsByShop } from './../utils/common';
import manualReviewRequests from './../routes/models/manualReviewRequests';
import manualRequestProducts from './../routes/models/manualRequestProducts';

export async function action({ request }) {
	const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
	const shopDomain = request.headers.get('x-shopify-shop-domain');
	const topic = request.headers.get('x-shopify-topic');
	for (let [key, value] of request.headers.entries()) {
		console.log(`${key}: ${value}`);
	}
	const rawBody = await request.text();
	const generatedHmac = crypto
		.createHmac('sha256', process.env.SHOPIFY_API_SECRET)
		.update(rawBody, 'utf8')
		.digest('base64');
	if (generatedHmac !== hmacHeader) {
		console.log('Hmac not matched');
		return json({ message: 'Hmac not matched' });
	}
	const bodyObj = JSON.parse(rawBody);

	if (topic == 'orders/create') {
		const shopRecords = await getShopDetailsByShop(shopDomain);
		const manualReviewRequestsModel = await manualReviewRequests({
			shop_id: shopRecords._id,
			email: bodyObj.customer.email,
			first_name: bodyObj.customer.first_name,
			last_name: bodyObj.customer.last_name,
			customer_locale: bodyObj.customer_locale.split('-')[0],
			order_id: bodyObj.id
		});
		const savedManualReviewRequestsModel = await manualReviewRequestsModel.save();
		const lastInsertedId = savedManualReviewRequestsModel._id;
		if (lastInsertedId) {
			await Promise.all(bodyObj.line_items.map(async (lineItem, index) => {

				const requestProductsModel = await manualRequestProducts({
					manual_request_id: lastInsertedId,
					product_id: lineItem.product_id,
					line_item_id: lineItem.id,
					status: "pending"
				});
				await requestProductsModel.save();

			}));
		}

	} else if (topic == 'orders/partially_fulfilled' || topic == 'orders/fulfilled') {
		await Promise.all(bodyObj.line_items.map(async (lineItem, index) => {

			await manualRequestProducts.updateOne(
				{ line_item_id: lineItem.id },
				{
					$set: { status: "fulfilled" }
				}
			);
		}));

	} else if (topic == 'app/uninstalled') {
		const shop = bodyObj.myshopify_domain;

		/* delete shopify sessions  */
		await shopifySessions.deleteMany({ shop: shop });

		/* notify to admin  */
		/* Canceling subscriptions  */

		/* add uninstall app log */
		const appInstallLogsModel = new appInstallLogs({
			shop_id: bodyObj.id,
			shop: shop,
			event_type: 'uninstall',
			email: bodyObj.email,
			shop_owner: bodyObj.shop_owner,
			name: bodyObj.name
		});
		await appInstallLogsModel.save();

		console.log(`---App uninstalled from shop: ${shop}`);
	}

	console.log(`---Webhook completed---`);


	return json({ message: 'Webhook received' });
}
