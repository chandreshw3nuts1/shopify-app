import { json } from "@remix-run/node";
import { mongoConnection } from './../utils/mongoConnection';
import { GraphQLClient } from "graphql-request";

import settings from './models/settings';
import manualRequestProducts from './models/manualRequestProducts';
import manualReviewRequests from './models/manualReviewRequests';
import generalAppearances from './models/generalAppearances';
import generalSettings from './models/generalSettings';
import reviewRequestTimingSettings from './models/reviewRequestTimingSettings';
import reviewRequestTracks from './models/reviewRequestTracks';
import reviewDiscountSettings from './models/reviewDiscountSettings';

import { getShopDetailsByShop, getShopifyProducts, getLanguageWiseContents } from './../utils/common';
import { sendEmail } from "./../utils/email.server";
import ReactDOMServer from 'react-dom/server';
import ReviewRequestEmailTemplate from './components/email/ReviewRequestEmailTemplate';
import { getUploadDocument } from './../utils/documentPath';
import settingJson from './../utils/settings.json';
import { findOneRecord, generateUnsubscriptionLink } from './../utils/common';
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
                const db = await mongoConnection();
                const shopRecords = await getShopDetailsByShop(shop);
                if (actionType == 'manualReviewRequest') {

                    const emails = requestBody.emails;
                    const selectedProducts = requestBody.selectedProducts;

                    const generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id });

                    const generalAppearancesObj = await generalAppearances.findOne({ shop_id: shopRecords._id });
                    const logo = getUploadDocument(generalAppearancesObj.logo, shopRecords.shop_id, 'logo');

                    const productIds = selectedProducts.map((item) => `"gid://shopify/Product/${item}"`);
                    var mapProductDetails = await getShopifyProducts(shopRecords.myshopify_domain, productIds, 200);
                    const customer_locale = generalSettingsModel.defaul_language || 'en';

                    const replaceVars = {
                    }
                    const emailContents = await getLanguageWiseContents("review_request", replaceVars, shopRecords._id, customer_locale);
                    emailContents.banner = getUploadDocument(emailContents.banner, shopRecords.shop_id, 'banners');

                    emailContents.logo = logo;

                    var footerContent = "";
                    if (generalSettingsModel.email_footer_enabled) {
                        footerContent = generalSettingsModel[customer_locale] ? generalSettingsModel[customer_locale].footerText : "";
                    }
                    emailContents.footerContent = footerContent;
                    emailContents.email_footer_enabled = generalSettingsModel.email_footer_enabled;


                    const updateEmailsAndSendRequests = async () => {
                        const emailPromises = emails.map(async (email, index) => {
                            var emailHtmlContent = ReactDOMServer.renderToStaticMarkup(
                                <ReviewRequestEmailTemplate emailContents={emailContents} mapProductDetails={mapProductDetails} generalAppearancesObj={generalAppearancesObj} />
                            );
                            const query = {
                                shop_id: shopRecords._id,
                                email: email,
                                $or: [{ order_id: { $exists: false } }, { order_id: "" }]  // Check if order_id doesn't exist or is an empty string
                            };
                            const update = {
                                $set: {
                                    email: email,
                                    shop_id: shopRecords._id,
                                    request_status: "sent"
                                }
                            };
                            const options = { upsert: true, returnOriginal: false };
                            const manualRequestModel = await manualReviewRequests.findOneAndUpdate(query, update, options);
                            await Promise.all(selectedProducts.map(async (product, index) => {

                                const productReviewModel = new manualRequestProducts({
                                    manual_request_id: manualRequestModel._id,
                                    product_id: product,
                                    status: "sent"
                                });
                                const requestProductsModel = await productReviewModel.save();

                                const lastInsertedId = requestProductsModel._id;

                                const reviewLink = `${settingJson.host_url}/review-request/${lastInsertedId}/review-form`;
                                emailHtmlContent = emailHtmlContent.replace(`{{review_link_${product}}}`, reviewLink);
                                const variantTitle = product.variant_title ? product.variant_title : "";
                                emailHtmlContent = emailHtmlContent.replace(`{{variant_title_${product}}}`, variantTitle);

                            }));

                            /* create unscubscribe link*/
                            const unsubscribeData = {
                                "shop_id": shopRecords.shop_id,
                                "email": email,
                            }
                            const unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);
                            emailHtmlContent = emailHtmlContent.replace(`{{unsubscriptionLink}}`, unsubscriptionLink);

                            // Send request email
                            const subject = requestBody.requestEmailSubject != "" ? requestBody.requestEmailSubject : emailContents.subject;

                            const fromName = shopRecords.name;
                            const replyTo = generalSettingsModel.reply_email || shopRecords.email;
                            const response = await sendEmail({
                                to: email,
                                subject,
                                html: emailHtmlContent,
                                fromName,
                                replyTo
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

                    /* Add review request sent track  */
                    const reviewRequestTracksModel = new reviewRequestTracks({
                        shop_id: shopRecords._id,
                    });
                    await reviewRequestTracksModel.save();
                    /* Add review request sent track end*/
                    return json({ status: 200, message: "Manual review request sent." });

                } else if (actionType == 'reviewRequestTiming') {

                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestBody.field]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await reviewRequestTimingSettings.findOneAndUpdate(query, update, options);
                    return json({ "status": 200, "message": "Settings saved" });

                } else if (actionType == 'discountPhotoVideoReview') {

                    const query = { shop_id: shopRecords._id };

                    if (requestBody.field == 'isSameDiscount' && requestBody.value == 'false') {
                        var update = {
                            $set: {
                                [requestBody.field]: requestBody.value,
                                isAutoGeneratedDiscount: true
                            }
                        };

                    } else {
                        var update = {
                            $set: {
                                [requestBody.field]: requestBody.value
                            }
                        };
                    }

                    const options = { upsert: true, returnOriginal: false };
                    await reviewDiscountSettings.findOneAndUpdate(query, update, options);
                    return json({ "status": 200, "message": "Settings saved" });

                } else if (actionType == 'validateDiscountCode') {

                    const shopSessionRecords = await findOneRecord("shopify_sessions", { shop: shopRecords.myshopify_domain });

                    const query = `
                        query GetDiscountByCode($discountCode: String!) {
                            discountNodes(first: 1, query: $discountCode) {
                            edges {
                                    node {
                                        id
                                        discount {
                                        ... on DiscountCodeBasic {
                                            title
                                            appliesOncePerCustomer
                                            endsAt
                                            customerGets {
                                            appliesOnOneTimePurchase
                                            appliesOnSubscription
                                            value {
                                                ... on DiscountAmount {
                                                __typename
                                                appliesOnEachItem
                                                amount {
                                                    amount
                                                }
                                                }
                                                
                                                ... on DiscountPercentage {
                                                __typename
                                                percentage
                                                }
                                            }
                                            }
                                        }
                                        }
                        
                                    }
                                }
                            }
                        }
                    `;

                    try {

                        const client = new GraphQLClient(
                            `https://${shopRecords.myshopify_domain}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'X-Shopify-Access-Token': shopSessionRecords.accessToken,
                                }
                            }
                        );

                        const discountCode = requestBody.code;
                        const variables = { discountCode };
                        const discountResponse = await client.request(query, variables);
                        let discountType = "percentage";
                        let discountValue = 0;
                        let msg;
                        if (discountResponse && discountResponse?.discountNodes && discountResponse?.discountNodes?.edges && discountResponse?.discountNodes?.edges.length > 0) {
                            const discountNode = discountResponse?.discountNodes?.edges[0].node;
                            const discountId = discountNode?.id.split('/').pop();
                            const expireAt = discountNode?.discount?.endsAt;
                            console.log(discountNode?.discount?.customerGets?.value?.__typename);
                            if (discountNode?.discount?.customerGets?.value?.__typename == "DiscountAmount") {
                                discountType = "fixed_amount";
                                discountValue = discountNode?.discount?.customerGets?.value?.amount?.amount;
                            } else {
                                discountValue = discountNode?.discount?.customerGets?.value?.percentage * 100;
                            }

                            const query = { shop_id: shopRecords._id };

                            var update = {
                                $set: {
                                    discountId: discountId,
                                    defaultDiscountType: discountType,
                                    defaultDiscountValue: discountValue,
                                    defaultDiscountExpiredAt: expireAt,
                                    discountCode: discountCode,
                                }
                            };
                            const options = { upsert: true, returnOriginal: false };
                            await reviewDiscountSettings.findOneAndUpdate(query, update, options);
                            const amountText = discountType == "fixed_amount" ? `${shopRecords.currency_symbol}${Math.abs(discountValue)}` : `${Math.abs(discountValue)}%`;

                            msg = `Code defined as ${amountText}`;

                        } else {
                            msg = "Code not found";
                        }

                        return json({ "status": 200, "message": msg });

                    } catch (error) {
                        console.error("Error fetching discount details:", error);
                        return json({ "status": 400, "message": "Failed to fetch discount details" });
                    }

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

            return json({ "message": "", "method": "" });

    }
}
