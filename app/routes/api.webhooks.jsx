import { json } from "@remix-run/node";
import crypto from 'crypto';
import shopifySessions from './../routes/models/shopifySessions';
import appInstallLogs from './models/appInstallLogs';
import { getShopDetailsByShop } from './../utils/common';
import manualReviewRequests from './../routes/models/manualReviewRequests';
import manualRequestProducts from './../routes/models/manualRequestProducts';
import shopDetails from './../routes/models/shopDetails';
import discountCodes from './../routes/models/discountCodes';
import reviewDiscountSettings from './../routes/models/reviewDiscountSettings';
import marketingEmailSubscriptions from './../routes/models/marketingEmailSubscriptions';

export async function action({ request }) {
	const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
	const shopDomain = request.headers.get('x-shopify-shop-domain');
	const topic = request.headers.get('x-shopify-topic');
	for (let [key, value] of request.headers.entries()) {
		console.log(`${key}: ${value}`);
	}
	const rawBody = await request.text();
	console.log(rawBody);

	const generatedHmac = crypto
		.createHmac('sha256', process.env.SHOPIFY_API_SECRET)
		.update(rawBody, 'utf8')
		.digest('base64');
	if (generatedHmac !== hmacHeader) {
		console.log('Hmac not matched');
		return json({ message: 'Hmac not matched' });
	}
	const bodyObj = JSON.parse(rawBody);
	console.log(bodyObj);
	const shopRecords = await getShopDetailsByShop(shopDomain);

	if (topic == 'orders/create') {
		var language = "";
		if (bodyObj.customer_locale == 'zh-CN') {
			language = 'cn1';
		} else if (bodyObj.customer_locale == 'zh-TW') {
			language = 'cn2';
		} else {
			language = bodyObj.customer_locale.split('-')[0];
		}

		let discountCode = "";
		let totalOrderAmount = 0;
		if (bodyObj.discount_codes && bodyObj.discount_codes.length > 0) {
			discountCode = bodyObj.discount_codes[0].code;
			const discountCodesModel = await discountCodes.findOne({ shop_id: shopRecords._id, code: discountCode });
			if (discountCodesModel) {
				totalOrderAmount = bodyObj.total_price;

				/* update discount code used status as true for auto generated code*/
				await discountCodes.updateOne(
					{
						shop_id: shopRecords._id,
						code: discountCode,
					},
					{
						$set: { code_used: true }
					}
				);

			} else {
				const reviewDiscountSettingsModel = await reviewDiscountSettings.findOne({ shop_id: shopRecords._id, discountCode: discountCode });
				if (reviewDiscountSettingsModel) {
					totalOrderAmount = bodyObj.total_price;

					/* update discount code used status as true for auto generated code*/
					await discountCodes.updateOne(
						{
							shop_id: shopRecords._id,
							code: discountCode,
							email: bodyObj.customer.email,
						},
						{
							$set: { code_used: true }
						}
					);
				}
			}



		}
		
		var country_code = "";
		// Check if shipping_address exists and if country_code is available, otherwise use the customer's default address country_code
		if (bodyObj?.shipping_address?.country_code) {
			country_code = bodyObj.shipping_address.country_code;
		} else if (bodyObj?.customer?.default_address?.country_code) {
			country_code = bodyObj.customer.default_address.country_code;
		} else {
			country_code = "";  // Fallback to empty string if neither exist
		}

		const manualReviewRequestsModel = await manualReviewRequests({
			shop_id: shopRecords._id,
			email: bodyObj.customer.email,
			first_name: bodyObj.customer.first_name,
			last_name: bodyObj.customer.last_name,
			customer_locale: language,
			country_code: country_code,
			order_id: bodyObj.id,
			order_number: bodyObj.order_number,
			request_status: "pending",
			total_order_amount: totalOrderAmount
		});
		const savedManualReviewRequestsModel = await manualReviewRequestsModel.save();
		const lastInsertedId = savedManualReviewRequestsModel._id;
		if (lastInsertedId) {
			await Promise.all(bodyObj.line_items.map(async (lineItem, index) => {

				const requestProductsModel = await manualRequestProducts({
					manual_request_id: lastInsertedId,
					product_id: lineItem.product_id,
					line_item_id: lineItem.id,
					variant_title: lineItem.variant_title,
					status: "pending"
				});
				await requestProductsModel.save();

			}));

			const productIds = bodyObj.line_items.map(item => item.product_id);
			await manualReviewRequests.updateOne(
				{ _id: lastInsertedId },
				{ $set: { product_ids: productIds } }
			);

		}


		/*update email marketing consert*/
		await marketingEmailSubscriptions.updateOne(
			{
				shop_id: shopRecords._id,
				email: bodyObj.customer.email,
			},
			{
				$set: { isEmailConcent: bodyObj.buyer_accepts_marketing }
			},
			{ upsert: true }
		);


	} else if (topic == 'orders/partially_fulfilled' || topic == 'orders/fulfilled') {
		await Promise.all(bodyObj.fulfillments.map(async (fulfillment) => {
			await Promise.all(fulfillment.line_items.map(async (lineItem) => {

				await manualRequestProducts.updateOne(
					{ line_item_id: lineItem.id, tracking_number: { $ne: fulfillment.tracking_number } },
					{
						$set: {
							status: "fulfilled",
							tracking_number: fulfillment.tracking_number,
							fulfillment_date: new Date()
						}
					}
				);
			}));
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
	} else if (topic == 'shop/update') {
		try {
			if (shopRecords) {
				const currency_symbol = bodyObj.money_format.replace(/{{.*?}}/g, '').trim();

				const updateResult = await shopDetails.updateOne(
					{ _id: shopRecords._id },
					{ $set: { primary_location_id: bodyObj.primary_location_id, currency: bodyObj.currency, currency_symbol: currency_symbol, timezone: bodyObj.iana_timezone } }
				);

			} else {
				console.log('No shop records found for the given shop domain.');
			}
		} catch (error) {
			console.error('Error updating currency symbol:', error);
		}

	} else if (topic == 'locations/update') {
		try {
			if (shopRecords) {
				await shopDetails.updateOne(
					{ _id: shopRecords._id },
					{ $set: { country_code: bodyObj.country_code } }
				);

			} else {
				console.log('No shop records found for the given shop domain.');
			}
		} catch (error) {
			console.error('Error updating currency symbol:', error);
		}

	}


	console.log(`---Webhook completed---`);


	return json({ message: 'Webhook received' });
}
