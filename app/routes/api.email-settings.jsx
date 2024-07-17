import { json } from "@remix-run/node";
import settings from './models/settings';
import emailReviewRequestSettings from './models/emailReviewRequestSettings';
import emailReviewReplySettings from './models/emailReviewReplySettings';
import generalAppearances from "./models/generalAppearances";

import { getShopDetailsByShop, getShopifyProducts, getLanguageWiseContents } from './../utils/common';
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
                    const options = { upsert: true, returnOriginal: false };
                    await emailReviewRequestSettings.findOneAndUpdate(query, update, options);

                    return json({ status: 200, message: "Setting saved" });

                } else if (actionType == 'sendReviewRequestEmail') {
                    const {language} = requestBody;
                    const generalAppearancesData = await generalAppearances.findOne({ shop_id: shopRecords._id });
                    const logo = getUploadDocument(generalAppearancesData.logo, 'logo');
                    const customer_locale = language ? language : 'en';
                    const replaceVars = {
                       
                    }
                    const emailContents = await getLanguageWiseContents("review_request", replaceVars, shopRecords._id, customer_locale);
                    console.log(emailContents);

                    return json({ status: 200, message: "Sample review request email sent" });

                } else if (actionType == 'reviewReply') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [`${language}.${requestBody.field}`]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await emailReviewReplySettings.findOneAndUpdate(query, update, options);

                    return json({ status: 200, message: "Setting saved" });

                }

            } catch (error) {

                return json({ "status": 400, "message": "Failed to update record", error: error });
            }

        default:

            return json({ "message": "hello", "method": "POST" });

    }
}
