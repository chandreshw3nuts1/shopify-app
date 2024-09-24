import { json } from "@remix-run/node";
import settings from './models/settings';
import emailReviewRequestSettings from './models/emailReviewRequestSettings';
import emailReviewRequestReminderSettings from './models/emailReviewRequestReminderSettings';
import emailReviewReplySettings from './models/emailReviewReplySettings';
import generalAppearances from "./models/generalAppearances";
import generalSettings from './models/generalSettings';

import { getShopDetailsByShop, getLanguageWiseContents, generateUnsubscriptionLink } from './../utils/common';
import { sendEmail } from "./../utils/email.server";
import ReactDOMServer from 'react-dom/server';
import ReviewRequestEmailTemplate from './components/email/ReviewRequestEmailTemplate';
import { getUploadDocument } from './../utils/documentPath';
import settingJson from './../utils/settings.json';
import emailDiscountPhotoVideoReviewSettings from "./models/emailDiscountPhotoVideoReviewSettings";
import emailPhotovideoReminderSettings from "./models/emailPhotovideoReminderSettings";
import emailDiscountPhotoVideoReviewReminderSettings from "./models/emailDiscountPhotoVideoReviewReminderSettings";

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
                    const { language } = requestBody;
                    const generalAppearancesObj = await generalAppearances.findOne({ shop_id: shopRecords._id });
                    const logo = getUploadDocument(generalAppearancesObj.logo, shopRecords.shop_id, 'logo');
                    const customer_locale = language ? language : 'en';
                    const replaceVars = {
                        "name": settingJson.defaultSampleEmailInfo.name,
                        "last_name": settingJson.defaultSampleEmailInfo.last_name,
                        "product": settingJson.defaultSampleEmailInfo.product,
                        "order_number": settingJson.defaultSampleEmailInfo.order_number
                    }
                    const emailContents = await getLanguageWiseContents("review_request", replaceVars, shopRecords._id, customer_locale);
                    emailContents.banner = getUploadDocument(emailContents.banner, shopRecords.shop_id, 'banners');
                    emailContents.logo = logo;

                    const defaultProductImg = settingJson.host_url + '/images/product-default.png';
                    emailContents.defaultProductImg = defaultProductImg;

                    var generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id });

                    var footerContent = "";
                    if (generalSettingsModel.email_footer_enabled) {
                        footerContent = generalSettingsModel[customer_locale] ? generalSettingsModel[customer_locale].footerText : "";
                    }
                    emailContents.footerContent = footerContent;
                    emailContents.email_footer_enabled = generalSettingsModel.email_footer_enabled;

                    var emailHtmlContent = ReactDOMServer.renderToStaticMarkup(
                        <ReviewRequestEmailTemplate emailContents={emailContents} mapProductDetails={[]} generalAppearancesObj={generalAppearancesObj} />
                    );

                    const settingsModel = await settings.findOne({
                        shop_id: shopRecords._id,
                    });
                    const email = settingsModel?.reviewNotificationEmail || shopRecords.email;

                    const unsubscribeData = {
                        "shop_id": shopRecords.shop_id,
                        "email": email,
                    }
                    const unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);
                    emailHtmlContent = emailHtmlContent.replace(`{{unsubscriptionLink}}`, unsubscriptionLink);

                    // Send request email
                    const subject = emailContents.subject;
                    const response = await sendEmail({
                        to: email,
                        subject,
                        html: emailHtmlContent,
                    });

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

                } else if (actionType == 'discountPhotoVideoReview') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [`${language}.${requestBody.field}`]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await emailDiscountPhotoVideoReviewSettings.findOneAndUpdate(query, update, options);

                    return json({ status: 200, message: "Setting saved" });

                } else if (actionType == 'reviewRequestReminder') {
                    const query = { shop_id: shopRecords._id };
                    if (requestBody.field == 'isEnabled') {
                        var update = {
                            $set: {
                                [requestBody.field]: requestBody.value
                            }
                        };
                    } else {
                        var update = {
                            $set: {
                                [`${language}.${requestBody.field}`]: requestBody.value
                            }
                        };
                    }
                    const options = { upsert: true, returnOriginal: false };
                    await emailReviewRequestReminderSettings.findOneAndUpdate(query, update, options);

                    return json({ status: 200, message: "Setting saved" });

                } else if (actionType == 'photoVideoReminder') {
                    const query = { shop_id: shopRecords._id };
                    if (requestBody.field == 'sendReminderTo') {
                        var update = {
                            $set: {
                                [requestBody.field]: requestBody.value
                            }
                        };
                    } else {
                        var update = {
                            $set: {
                                [`${language}.${requestBody.field}`]: requestBody.value
                            }
                        };
                    }
                    const options = { upsert: true, returnOriginal: false };
                    await emailPhotovideoReminderSettings.findOneAndUpdate(query, update, options);

                    return json({ status: 200, message: "Setting saved" });

                } else if (actionType == 'discountPhotoVideoReviewReminder') {
                    const query = { shop_id: shopRecords._id };
                    if (requestBody.field == 'isEnabled') {
                        var update = {
                            $set: {
                                [requestBody.field]: requestBody.value
                            }
                        };
                    } else {
                        var update = {
                            $set: {
                                [`${language}.${requestBody.field}`]: requestBody.value
                            }
                        };
                    }
                    const options = { upsert: true, returnOriginal: false };
                    await emailDiscountPhotoVideoReviewReminderSettings.findOneAndUpdate(query, update, options);

                    return json({ status: 200, message: "Setting saved" });

                }
                
            } catch (error) {

                return json({ "status": 400, "message": "Failed to update record", error: error });
            }

        default:

            return json({ "message": "", "method": "POST" });

    }
}
