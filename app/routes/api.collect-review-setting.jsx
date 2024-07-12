import { json } from "@remix-run/node";
import settings from './models/settings';
import manualRequestProducts from './models/manualRequestProducts';
import manualReviewRequests from './models/manualReviewRequests';
import generalAppearances from './models/generalAppearances';

import { ObjectId } from 'mongodb';
import { getShopDetailsByShop, getShopifyProducts, getLanguageWiseContents } from './../utils/common';
import { sendEmail } from "./../utils/email.server";
import ReactDOMServer from 'react-dom/server';
import ReviewRequestEmailTemplate from './components/email/ReviewRequestEmailTemplate';
import { getUploadDocument } from './../utils/documentPath';
import emailReviewRequestSettings from "./models/emailReviewRequestSettings";
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
            var { shop, actionType } = requestBody;
            try {
                const shopRecords = await getShopDetailsByShop(shop);
                if (actionType == 'manualReviewRequest') {

                    const emails = requestBody.emails;
                    const selectedProducts = requestBody.selectedProducts;

                    const generalAppearancesData = await generalAppearances.findOne({ shop_id: shopRecords._id });
                    const logo = getUploadDocument(generalAppearancesData.logo, 'logo');

                    const productIds = selectedProducts.map((item) => `"gid://shopify/Product/${item}"`);
                    var mapProductDetails = await getShopifyProducts(shop, productIds, 200);
                    const customer_locale = 'en';

                    const replaceVars = {
                    }
                    const emailContents = await getLanguageWiseContents("review_request", replaceVars, shopRecords._id, customer_locale);

                    emailContents.logo = logo;

                    const footer = "";

                    var emailHtmlContent = ReactDOMServer.renderToStaticMarkup(
                        <ReviewRequestEmailTemplate emailContents={emailContents} mapProductDetails={mapProductDetails} footer={footer} />
                    );

                    const updateEmailsAndSendRequests = async () => {
                        const emailPromises = emails.map(async (email, index) => {
                            const query = { email: email };
                            const update = {
                                $set: {
                                    email: email,
                                    shop_id: shopRecords._id,
                                }
                            };
                            const options = { upsert: true, returnOriginal: false };
                            const manualRequestModel = await manualReviewRequests.findOneAndUpdate(query, update, options);

                            await Promise.all(selectedProducts.map(async (product, index) => {
                                const requestProductsModel = await manualRequestProducts({
                                    manual_request_id: manualRequestModel._id,
                                    product_id: product,
                                    status: "sent"
                                });

                                const savedRequestProductsModel = await requestProductsModel.save();
                                const lastInsertedId = savedRequestProductsModel._id;

                                const reviewLink = `${settingJson.host_url}/review-request/${lastInsertedId}/review-form`;
                                emailHtmlContent = emailHtmlContent.replace(`{{review_link_${product}}}`, reviewLink);
                            }));

                            // Send request email
                            const subject = emailContents.subject;
                            const response = await sendEmail({
                                to: email,
                                subject,
                                html: emailHtmlContent,
                            });
                        });

                        // Await all email promises
                        await Promise.all(emailPromises);
                    };

                    updateEmailsAndSendRequests().then(() => {
                        console.log('All emails updated and requests sent successfully.');
                    }).catch(error => {
                        console.error('An error occurred:', error);
                    });


                    return json({ status: 200, message: "Manual review request sent." });

                } else {

                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestBody.field]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    const manualRequestModel = await settings.findOneAndUpdate(query, update, options);

                    return json({ "status": 200, "message": "Settings saved" });

                }

            } catch (error) {
                return json({ "status": 400, "message": "Failed to update record", error: error });
            }

        case "PATCH":

        default:

            return json({ "message": "hello", "method": "POST" });

    }
}
