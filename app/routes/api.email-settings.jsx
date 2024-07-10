import { json } from "@remix-run/node";
import settings from './models/settings';
import emailReviewRequestSettings from './models/emailReviewRequestSettings';

import { getShopDetailsByShop, getShopifyProducts } from './../utils/common';
import { sendEmail } from "./../utils/email.server";
import ReactDOMServer from 'react-dom/server';
import ReviewRequestEmailTemplate from './components/email/ReviewRequestEmailTemplate';
import { getUploadDocument } from './../utils/documentPath';
import settingJson from './../utils/settings.json';
export async function loader() {
    return json({
        name: "loading"
    });
}

export async function action({ params, request }) {
    const method = request.method;
    const requestBody = await request.json();
    switch (method) {
        case "POST":
            var { shop, actionType, language } = requestBody;
            try {
                const shopRecords = await getShopDetailsByShop(shop);
                if (actionType == 'reviewRequest') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [`${language}.${requestBody.field}`]: requestBody.value
                        }
                    };
                    console.log(update);
                    const options = { upsert: true, returnOriginal: false };
                    await emailReviewRequestSettings.findOneAndUpdate(query, update, options);

                    return json({ status: 200, message: "Setting saved" });

                }

            } catch (error) {

                return json({ "status": 400, "message": "Failed to update record", error: error });
            }

        default:

            return json({ "message": "hello", "method": "POST" });

    }
}
