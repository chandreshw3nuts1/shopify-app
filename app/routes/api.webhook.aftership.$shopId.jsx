import { json } from "@remix-run/node";
import manualReviewRequests from './../routes/models/manualReviewRequests';
import manualRequestProducts from './../routes/models/manualRequestProducts';



export async function action({ request, params }) {
    try {

        const rawBody = await request.text();

        try {
            const bodyObj = JSON.parse(rawBody);
            
            if (bodyObj.msg.tag == 'Delivered') {

                const manualReviewRequestsModel = await manualReviewRequests.findOne({
                    order_id: bodyObj.msg.order_id, shop_id: params.shopId
                });
                console.log(manualReviewRequestsModel);
                if (manualReviewRequestsModel != null) {
                    const reqData = await manualRequestProducts.updateOne(
                        { manual_request_id: manualReviewRequestsModel.id, tracking_number: bodyObj.msg.tracking_number },
                        { $set: { status: 'delivered', delivered_date: new Date() } }
                    );
                    console.log(reqData);
                }

            }

        } catch (error) {
            console.error("Error parsing JSON:", error);
            return json({ message: 'Webhook received' });
        }

        console.log(`---Webhook aftership completed---`);

        return json({ message: 'Webhook received' });

    } catch (error) {
        console.error("Unexpected Server Error:", error);
        return json({ message: 'Webhook received' });
    }
}
