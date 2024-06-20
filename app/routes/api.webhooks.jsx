import { json } from "@remix-run/node";
import crypto from 'crypto';
import shopifySessions from './../routes/models/shopifySessions';
import appInstallLogs from './models/appInstallLogs';

export async function action({ request }) {
	const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
	const rawBody = await request.text();
	const generatedHmac = crypto
		.createHmac('sha256', process.env.SHOPIFY_API_SECRET)
		.update(rawBody, 'utf8')
		.digest('base64');
	if (generatedHmac !== hmacHeader) {
		return new Response('Unauthorized', { status: 401 });
	}
	const body = JSON.parse(rawBody);
	const shop = body.myshopify_domain;

	/* delete shopify sessions  */
	await shopifySessions.deleteMany({ shop: shop });

	/* notify to admin  */
	/* Canceling subscriptions  */

	/* add uninstall app log */
	const appInstallLogsModel = new appInstallLogs({
		shop_id: body.id,
		shop: shop,
		event_type: 'uninstall',
		email: body.email,
		shop_owner: body.shop_owner,
		name: body.name
	});
	await appInstallLogsModel.save();

	console.log(`---App uninstalled from shop: ${shop}`);

  return json({ message: 'Webhook received' });
}
