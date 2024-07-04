import { json } from "@remix-run/node";
import crypto from 'crypto';
import { getShopDetailsByShop } from './../utils/common';

import manualReviewRequests from './../routes/models/manualReviewRequests';
import manualRequestProducts from './../routes/models/manualRequestProducts';

export async function action({ request }) {
    try {
        console.log('start ---');
        const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
        const shopDomain = request.headers.get('x-shopify-shop-domain');
        const topic = request.headers.get('x-shopify-topic');
        //const shopDomain = 'chandstest.myshopify.com';
        //const topic = 'orders/partially_fulfilled';
        for (let [key, value] of request.headers.entries()) {
            console.log(`${key}: ${value}`);
        }

        console.log(topic);
        const rawBody = await request.text();
        console.log(rawBody);

        // const bodyObj = {
        //     "id": 5860308222190,
        //     "customer_locale": "en-IN",
        //     "fulfillment_status": null,
        //     "customer": {
        //         "email": 'chandresh.w3nuts+0001@gmail.com',
        //         "first_name": 'guest',
        //         "last_name": 'one',
        //     },
        //     "line_items": [
        //         {
        //             "id": 14480289726702,
        //             "fulfillment_status": null,
        //             "name": "Long -long",
        //             "price": "200.00",
        //             "product_id": 8582018859246,
        //         },
        //         {
        //             "id": 14480289726701,
        //             "fulfillment_status": null,
        //             "name": "Long -long",
        //             "price": "200.00",
        //             "product_id": 8582018859246,
        //         }
        //     ]
        // };
        const generatedHmac = crypto
            .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
            .update(rawBody, 'utf8')
            .digest('base64');
        if (generatedHmac !== hmacHeader) {
            console.log('Hmac not matched');
            //return json({ message: 'Hmac not matched' });
        }

        const bodyObj = JSON.parse(rawBody);
        console.log(bodyObj);

        /* orders/create */

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
                      $set: { status : "fulfilled"}
                    }
                );
            }));

        } else if (topic == 'orders/fulfilled') {
            console.log('-- okay ---');
            console.log('orders/fulfilled');
        }

        console.log(`---Webhook completed---`);

    } catch (error) {
        console.log(`---Webhook error---`);
        console.log(error);
    }

    return json({ message: 'Webhook received' });
}
