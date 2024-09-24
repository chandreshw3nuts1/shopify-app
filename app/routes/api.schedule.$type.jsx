import { mongoConnection } from "./../utils/mongoConnection"
import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import ReactDOMServer from 'react-dom/server';
import shopDetails from "./models/shopDetails";
import reviewRequestTimingSettings from "./models/reviewRequestTimingSettings";
import manualReviewRequests from "./models/manualReviewRequests";
import manualRequestProducts from "./models/manualRequestProducts";
import reviewRequestTracks from './models/reviewRequestTracks';
import discountCodes from "./models/discountCodes";
import emailReviewRequestReminderSettings from "./models/emailReviewRequestReminderSettings";
import emailDiscountPhotoVideoReviewReminderSettings from "./models/emailDiscountPhotoVideoReviewReminderSettings";
import emailPhotovideoReminderSettings from "./models/emailPhotovideoReminderSettings";

import generalAppearances from "./models/generalAppearances";
import generalSettings from './models/generalSettings';

import settingsJson from './../utils/settings.json';
import { addDaysToDate, formatDate } from './../utils/dateFormat';
import { getUploadDocument } from './../utils/documentPath';
import { getShopifyProducts, getLanguageWiseContents, generateUnsubscriptionLink } from "./../utils/common";
import ReviewRequestEmailTemplate from './components/email/ReviewRequestEmailTemplate';
import DiscountPhotoVideoReviewEmail from './components/email/DiscountPhotoVideoReviewEmail';
import productReviews from "./models/productReviews";

export async function loader() {
    return json({});
}


export async function action({ request, params }) {
    await mongoConnection();

    const method = request.method;
    switch (method) {
        case "POST":
            const actionType = params.type;

            try {
                if (actionType == 'send-review-request-email') {

                    const shopDetailsModel = await shopDetails.find({});
                    const reviewRequestTimingSettingsModel = await reviewRequestTimingSettings.find({
                        default_day_timing: { $nin: ['never'] }
                    });

                    var currentDate = new Date();

                    for (const shop of shopDetailsModel) {


                        const timingSettings = reviewRequestTimingSettingsModel.find(setting => setting.shop_id.toString() === shop._id.toString());
                        if (timingSettings) {
                            const manualReviewRequestQuery = {
                                shop_id: shop._id
                            };

                            const ordersItems = await manualReviewRequests.aggregate([
                                {
                                    $match: manualReviewRequestQuery
                                },
                                {
                                    $lookup: {
                                        from: 'manual_request_products',
                                        localField: '_id',
                                        foreignField: 'manual_request_id',
                                        as: 'manualRequestProducts'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: "$manualRequestProducts",
                                        preserveNullAndEmptyArrays: true
                                    }
                                },
                                {
                                    $match: {
                                        'manualRequestProducts.status': { $in: ['pending', 'fulfilled', 'delivered'] }
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$_id",
                                        email: { $first: "$email" },
                                        first_name: { $first: "$first_name" },
                                        last_name: { $first: "$last_name" },
                                        createdAt: { $first: "$createdAt" },
                                        updatedAt: { $first: "$updatedAt" },
                                        customer_locale: { $first: "$customer_locale" },
                                        order_id: { $first: "$order_id" },
                                        request_status: { $first: "$request_status" },
                                        country_code: { $first: "$country_code" },
                                        order_number: { $first: "$order_number" },
                                        manualRequestProducts: {
                                            $push: {
                                                _id: "$manualRequestProducts._id",
                                                manual_request_id: "$manualRequestProducts.manual_request_id",
                                                product_id: "$manualRequestProducts.product_id",
                                                line_item_id: "$manualRequestProducts.line_item_id",
                                                status: "$manualRequestProducts.status",
                                                fulfillment_date: "$manualRequestProducts.fulfillment_date",
                                                delivered_date: "$manualRequestProducts.delivered_date",
                                                variant_title: "$manualRequestProducts.variant_title",
                                                createdAt: "$manualRequestProducts.createdAt",
                                                updatedAt: "$manualRequestProducts.updatedAt"
                                            }
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        first_name: 1,
                                        email: 1,
                                        last_name: 1,
                                        createdAt: 1,
                                        updatedAt: 1,
                                        order_id: 1,
                                        customer_locale: 1,
                                        request_status: 1,
                                        country_code: 1,
                                        order_number: 1,
                                        manualRequestProducts: 1
                                    }
                                }
                            ]);

                            if (ordersItems.length > 0) {
                                for (const singleOrder of ordersItems) {

                                    let productIdList = [];
                                    for (const product of singleOrder.manualRequestProducts) {
                                        var scheduleDate = getScheduleDate(product, singleOrder, timingSettings, shop);
                                        if (scheduleDate != null) {
                                            scheduleDate = new Date(scheduleDate);
                                            if (scheduleDate <= currentDate) {
                                                productIdList.push(product.product_id);
                                            }
                                        }
                                    }

                                    if (productIdList.length > 0) {

                                        const productIds = productIdList.map((item) => `"gid://shopify/Product/${item}"`);
                                        var mapProductDetails = await getShopifyProducts(shop.shop, productIds, 200);
                                        const customer_locale = singleOrder.customer_locale;

                                        const replaceVars = {
                                            "order_number": singleOrder.order_number,
                                            "name": singleOrder.first_name,
                                            "last_name": singleOrder.last_name,
                                        }
                                        const emailContents = await getLanguageWiseContents("review_request", replaceVars, shop._id, customer_locale);
                                        emailContents.banner = getUploadDocument(emailContents.banner, shop.shop_id, 'banners');

                                        var generalAppearancesObj = await generalAppearances.findOne({ shop_id: shop._id });

                                        emailContents.logo = getUploadDocument(generalAppearancesObj.logo, shop.shop_id, 'logo');

                                        var generalSettingsModel = await generalSettings.findOne({ shop_id: shop._id });

                                        var footerContent = "";
                                        if (generalSettingsModel.email_footer_enabled) {
                                            footerContent = generalSettingsModel[customer_locale] ? generalSettingsModel[customer_locale].footerText : "";
                                        }
                                        emailContents.footerContent = footerContent;
                                        emailContents.email_footer_enabled = generalSettingsModel.email_footer_enabled;

                                        var emailHtmlContent = ReactDOMServer.renderToStaticMarkup(
                                            <ReviewRequestEmailTemplate emailContents={emailContents} mapProductDetails={mapProductDetails} generalAppearancesObj={generalAppearancesObj} />
                                        );

                                        await Promise.all(singleOrder.manualRequestProducts.map(async (product, index) => {

                                            const reviewLink = `${settingsJson.host_url}/review-request/${product._id}/review-form`;
                                            emailHtmlContent = emailHtmlContent.replace(`{{review_link_${product.product_id}}}`, reviewLink);
                                            const variantTitle = product.variant_title ? product.variant_title : "";
                                            emailHtmlContent = emailHtmlContent.replace(`{{variant_title_${product.product_id}}}`, variantTitle);

                                        }));

                                        const unsubscribeData = {
                                            "shop_id": shop.shop_id,
                                            "email": singleOrder.email,
                                        }
                                        const unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);
                                        emailHtmlContent = emailHtmlContent.replace(`{{unsubscriptionLink}}`, unsubscriptionLink);


                                        // Send request email
                                        const subject = emailContents.subject;
                                        const response = await sendEmail({
                                            to: singleOrder.email,
                                            subject,
                                            html: emailHtmlContent,
                                        });

                                        if (singleOrder.manualRequestProducts.length == productIdList.length) {
                                            await manualReviewRequests.updateOne(
                                                { _id: singleOrder._id },
                                                {
                                                    $set: { request_status: "sent" }
                                                }
                                            );
                                        }


                                        await manualRequestProducts.updateMany(
                                            { product_id: { $in: productIdList } },
                                            {
                                                $set: { status: "sent" }
                                            }
                                        );


                                        /* Add review request sent track  */
                                        const reviewRequestTracksModel = new reviewRequestTracks({
                                            shop_id: shop._id,
                                        });
                                        await reviewRequestTracksModel.save();
                                        /* Add review request sent track end*/

                                    }
                                }
                            }
                        }
                    }
                    return json({ "status": 200, "message": "success" });

                } else if (actionType == 'send-review-request-reminder-email') {
                    const shopDetailsModel = await shopDetails.find({});
                    var currentDate = new Date();

                    for (const shop of shopDetailsModel) {

                        var emailReviewRequestReminderSettingsModel = await emailReviewRequestReminderSettings.findOne({ shop_id: shop._id }).select('isEnabled');
                        if (emailReviewRequestReminderSettingsModel && emailReviewRequestReminderSettingsModel.isEnabled == true) {
                            const requestQuery = {
                                shop_id: shop._id,
                                request_status: 'sent'
                            };

                            const ordersItems = await manualReviewRequests.aggregate([
                                {
                                    $match: requestQuery
                                },
                                {
                                    $lookup: {
                                        from: 'manual_request_products',
                                        localField: '_id',
                                        foreignField: 'manual_request_id',
                                        as: 'manualRequestProducts'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: "$manualRequestProducts",
                                        preserveNullAndEmptyArrays: true
                                    }
                                },
                                {
                                    $match: {
                                        // Ensure 'manualRequestProducts.status' is 'sent' and 'is_reminder_sent' is either false or missing
                                        'manualRequestProducts.status': { $in: ['sent'] },
                                        $or: [
                                            { 'manualRequestProducts.is_reminder_sent': { $eq: false } },
                                            { 'manualRequestProducts.is_reminder_sent': { $exists: false } }
                                        ],
                                        // Ensure 'manualRequestProducts.updatedAt' is older than 7 days
                                        $expr: {
                                            $lt: [
                                                '$manualRequestProducts.updatedAt',
                                                {
                                                    $dateSubtract: {
                                                        startDate: currentDate,
                                                        unit: 'day',
                                                        amount: settingsJson.reminderEmailDays
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$_id",
                                        email: { $first: "$email" },
                                        first_name: { $first: "$first_name" },
                                        last_name: { $first: "$last_name" },
                                        createdAt: { $first: "$createdAt" },
                                        updatedAt: { $first: "$updatedAt" },
                                        customer_locale: { $first: "$customer_locale" },
                                        order_id: { $first: "$order_id" },
                                        request_status: { $first: "$request_status" },
                                        country_code: { $first: "$country_code" },
                                        order_number: { $first: "$order_number" },
                                        manualRequestProducts: {
                                            $push: {
                                                _id: "$manualRequestProducts._id",
                                                manual_request_id: "$manualRequestProducts.manual_request_id",
                                                product_id: "$manualRequestProducts.product_id",
                                                line_item_id: "$manualRequestProducts.line_item_id",
                                                status: "$manualRequestProducts.status",
                                                fulfillment_date: "$manualRequestProducts.fulfillment_date",
                                                delivered_date: "$manualRequestProducts.delivered_date",
                                                variant_title: "$manualRequestProducts.variant_title",
                                                createdAt: "$manualRequestProducts.createdAt",
                                                updatedAt: "$manualRequestProducts.updatedAt"
                                            }
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        first_name: 1,
                                        email: 1,
                                        last_name: 1,
                                        createdAt: 1,
                                        updatedAt: 1,
                                        order_id: 1,
                                        customer_locale: 1,
                                        request_status: 1,
                                        country_code: 1,
                                        order_number: 1,
                                        manualRequestProducts: 1
                                    }
                                }
                            ]);
                            if (ordersItems.length > 0) {
                                for (const singleOrder of ordersItems) {

                                    let productIdList = singleOrder.manualRequestProducts.map(product => product.product_id);

                                    if (productIdList.length > 0) {

                                        const productIds = productIdList.map((item) => `"gid://shopify/Product/${item}"`);
                                        var mapProductDetails = await getShopifyProducts(shop.shop, productIds, 200);
                                        const customer_locale = singleOrder.customer_locale;

                                        const replaceVars = {
                                            "order_number": singleOrder.order_number,
                                            "name": singleOrder.first_name,
                                            "last_name": singleOrder.last_name,
                                        }

                                        const emailContents = await getLanguageWiseContents("review_request_reminder", replaceVars, shop._id, customer_locale);
                                        emailContents.banner = getUploadDocument(emailContents.banner, shop.shop_id, 'banners');
                                        var generalAppearancesObj = await generalAppearances.findOne({ shop_id: shop._id });

                                        emailContents.logo = getUploadDocument(generalAppearancesObj.logo, shop.shop_id, 'logo');

                                        var generalSettingsModel = await generalSettings.findOne({ shop_id: shop._id });

                                        var footerContent = "";
                                        if (generalSettingsModel.email_footer_enabled) {
                                            footerContent = generalSettingsModel[customer_locale] ? generalSettingsModel[customer_locale].footerText : "";
                                        }
                                        emailContents.footerContent = footerContent;
                                        emailContents.email_footer_enabled = generalSettingsModel.email_footer_enabled;

                                        var emailHtmlContent = ReactDOMServer.renderToStaticMarkup(
                                            <ReviewRequestEmailTemplate emailContents={emailContents} mapProductDetails={mapProductDetails} generalAppearancesObj={generalAppearancesObj} />
                                        );

                                        await Promise.all(singleOrder.manualRequestProducts.map(async (product, index) => {

                                            const reviewLink = `${settingsJson.host_url}/review-request/${product._id}/review-form`;
                                            emailHtmlContent = emailHtmlContent.replace(`{{review_link_${product.product_id}}}`, reviewLink);
                                            const variantTitle = product.variant_title ? product.variant_title : "";
                                            emailHtmlContent = emailHtmlContent.replace(`{{variant_title_${product.product_id}}}`, variantTitle);

                                        }));

                                        const unsubscribeData = {
                                            "shop_id": shop.shop_id,
                                            "email": singleOrder.email,
                                        }
                                        const unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);
                                        emailHtmlContent = emailHtmlContent.replace(`{{unsubscriptionLink}}`, unsubscriptionLink);


                                        // Send request email
                                        const subject = emailContents.subject;
                                        const response = await sendEmail({
                                            to: singleOrder.email,
                                            subject,
                                            html: emailHtmlContent,
                                        });


                                        await manualRequestProducts.updateMany(
                                            { product_id: { $in: productIdList } },
                                            {
                                                $set: { is_reminder_sent: true }
                                            }
                                        );

                                    }
                                }
                            }
                        }

                    }
                    return json({ "status": 200, "message": "success" });

                } else if (actionType == 'send-discount-photo-video-reminder-email') {
                    const shopDetailsModel = await shopDetails.find({});
                    var currentDate = new Date();
                    for (const shop of shopDetailsModel) {

                        var emailDiscountPhotoVideoReviewReminderSettingsModel = await emailDiscountPhotoVideoReviewReminderSettings.findOne({ shop_id: shop._id }).select('isEnabled');
                        if (emailDiscountPhotoVideoReviewReminderSettingsModel && emailDiscountPhotoVideoReviewReminderSettingsModel.isEnabled == true) {
                            const requestQuery = {
                                shop_id: shop._id,
                                code_used: false,
                                is_reminder_sent: false
                            };
                            const discountCodeItems = await discountCodes.aggregate([
                                {
                                    $match: requestQuery
                                },
                                {
                                    $lookup: {
                                        from: 'product_reviews',
                                        localField: 'review_id',
                                        foreignField: '_id',
                                        as: 'productReviews'
                                    }
                                },
                                {
                                    $unwind: {
                                        path: "$productReviews",
                                        preserveNullAndEmptyArrays: true
                                    }
                                },
                                {
                                    // Match documents where `updatedAt` is less than 7 days old
                                    $match: {
                                        $expr: {
                                            $lt: [
                                                "$updatedAt",  // Use "$" to reference a field
                                                {
                                                    $dateSubtract: {
                                                        startDate: currentDate,
                                                        unit: 'day',
                                                        amount: settingsJson.reminderEmailDays
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$_id",
                                        email: { $first: "$email" },
                                        code: { $first: "$code" },
                                        value_type: { $first: "$value_type" },
                                        discount_value: { $first: "$discount_value" },
                                        expire_on_date: { $first: "$expire_on_date" },
                                        updatedAt: { $first: "$updatedAt" },
                                        productReviews: {
                                            $first: {
                                                _id: "$productReviews._id",
                                                email: "$productReviews.email",
                                                first_name: "$productReviews.first_name",
                                                last_name: "$productReviews.last_name",
                                                customer_locale: "$productReviews.customer_locale",
                                            }
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        email: 1,
                                        code: 1,
                                        value_type: 1,
                                        discount_value: 1,
                                        expire_on_date: 1,
                                        updatedAt: 1,
                                        productReviews: 1
                                    }
                                }
                            ]);

                            //return discountCodeItems;

                            if (discountCodeItems.length > 0) {
                                var generalAppearancesObj = await generalAppearances.findOne({ shop_id: shop._id });
                                const logo = getUploadDocument(generalAppearancesObj.logo, shop.shop_id, 'logo');

                                var generalSettingsModel = await generalSettings.findOne({ shop_id: shop._id });

                                for (const singleDiscountItem of discountCodeItems) {


                                    const customer_locale = singleDiscountItem.productReviews.customer_locale ? singleDiscountItem.productReviews.customer_locale : "en";
                                    const discountText = singleDiscountItem.value_type == 'percentage' ? `${singleDiscountItem.discount_value}%` : `${shop.currency_symbol}${singleDiscountItem.discount_value}`;
                                    const replaceVars = {
                                        "discount": discountText,
                                        "store": shop.name,
                                        "name": singleDiscountItem.productReviews.first_name,
                                        "last_name": singleDiscountItem.productReviews.last_name,
                                    }

                                    const emailContentsDiscount = await getLanguageWiseContents("discount_photo_video_review_reminder", replaceVars, shop._id, customer_locale);
                                    emailContentsDiscount.banner = getUploadDocument(emailContentsDiscount.banner, shop.shop_id, 'banners');
                                    emailContentsDiscount.logo = logo;
                                    emailContentsDiscount.discountCode = singleDiscountItem.code;
                                    emailContentsDiscount.expire_on_date = (singleDiscountItem.expire_on_date != null && singleDiscountItem.expire_on_date != "") ? formatDate(singleDiscountItem.expire_on_date, shop.timezone, "MM-DD-YYYY") : "";
                                    var footerContent = "";
                                    if (generalSettingsModel.email_footer_enabled) {
                                        footerContent = generalSettingsModel[customer_locale] ? generalSettingsModel[customer_locale].footerText : "";
                                    }

                                    emailContentsDiscount.footerContent = footerContent;
                                    emailContentsDiscount.email_footer_enabled = generalSettingsModel.email_footer_enabled;


                                    const unsubscribeData = {
                                        "shop_id": shop.shop_id,
                                        "email": singleDiscountItem.email,
                                    }
                                    emailContentsDiscount.unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);
                                    var discountEmailHtmlContent = ReactDOMServer.renderToStaticMarkup(
                                        <DiscountPhotoVideoReviewEmail emailContents={emailContentsDiscount} generalAppearancesObj={generalAppearancesObj} shopRecords={shop} />
                                    );
                                    const emailResponse = await sendEmail({
                                        to: singleDiscountItem.email,
                                        subject: emailContentsDiscount.subject,
                                        html: discountEmailHtmlContent,
                                    });

                                    /* Update reminder sent status*/
                                    await discountCodes.updateOne(
                                        { _id: singleDiscountItem._id },
                                        {
                                            $set: {
                                                is_reminder_sent: true,
                                            }
                                        },
                                        { upsert: true }
                                    );


                                }
                            }

                        }

                    }
                    return json({ "status": 200, "message": "success" });

                } else if (actionType == 'send-photo-video-reminder-email') {
                    const shopDetailsModel = await shopDetails.find({});

                    var currentDate = new Date();
                    for (const shop of shopDetailsModel) {

                        var emailPhotovideoReminderSettingsModel = await emailPhotovideoReminderSettings.findOne({ shop_id: shop._id }).select('sendReminderTo');
                        if (emailPhotovideoReminderSettingsModel && emailPhotovideoReminderSettingsModel.sendReminderTo != 'never') {
                            const requestQuery = {
                                shop_id: shop._id,
                                is_reminder_sent : false
                            };
                            const sendReminderTo = emailPhotovideoReminderSettingsModel.sendReminderTo;
                            let ratingStars = 0;
                            if (sendReminderTo === 'star_2') {
                                ratingStars = 2;
                            } else if (sendReminderTo === 'star_3') {
                                ratingStars = 3;
                            } else if (sendReminderTo === 'star_4') {
                                ratingStars = 4;
                            } else if (sendReminderTo === 'star_5') {
                                ratingStars = 5;
                            }

                            const aggregationPipeline = [
                                {
                                    $match: requestQuery
                                },
                                {
                                    $lookup: {
                                        from: 'review_documents',
                                        localField: '_id',
                                        foreignField: 'review_id',
                                        as: 'reviewDocuments'
                                    }
                                },
                                {
                                    $group: {
                                        _id: "$_id",
                                        rating: { $first: "$rating" },
                                        first_name: { $first: "$first_name" },
                                        last_name: { $first: "$last_name" },
                                        email: { $first: "$email" },
                                        createdAt: { $first: "$createdAt" },
                                        product_id: { $first: "$product_id" },
                                        customer_locale: { $first: "$customer_locale" },
                                        variant_title: { $first: "$variant_title" },
                                        reviewDocuments: { $first: "$reviewDocuments" } // Use $first to avoid duplicates
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        rating: 1,
                                        first_name: 1,
                                        last_name: 1,
                                        email: 1,
                                        createdAt: 1,
                                        product_id: 1,
                                        customer_locale: 1,
                                        variant_title  :1,
                                        reviewDocuments: 1
                                    }
                                },
                                {
                                    // Ensure that we only get reviews that do not have any documents
                                    $match: {
                                        rating: { $gte: ratingStars },  // Ensure rating is greater than or equal to ratingStars
                                        $or: [
                                            { reviewDocuments: { $eq: [] } },  // Empty array
                                            { reviewDocuments: { $exists: false } }  // No documents
                                        ],
                                        $expr: {
                                            $lt: [
                                                '$createdAt',
                                                {
                                                    $dateSubtract: {
                                                        startDate: currentDate,
                                                        unit: 'day',
                                                        amount: settingsJson.reminderEmailDays
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ];

                            const reviewItems = await productReviews.aggregate(aggregationPipeline);

                            if (reviewItems.length > 0) {
                                var generalAppearancesObj = await generalAppearances.findOne({ shop_id: shop._id });
                                const logo = getUploadDocument(generalAppearancesObj.logo, shop.shop_id, 'logo');
                                var generalSettingsModel = await generalSettings.findOne({ shop_id: shop._id });

                                for (const singleReview of reviewItems) {
                                    const customer_locale = singleReview.customer_locale;
                                    const productIdList = [singleReview.product_id];
                                    const productIds = productIdList.map((item) => `"gid://shopify/Product/${item}"`);
                                    var mapProductDetails = await getShopifyProducts(shop.shop, productIds, 200);
                                    if (mapProductDetails.length > 0) {
                                        const replaceVars = {
                                            "product":  mapProductDetails[0]['title'],
                                            "name": singleReview.first_name,
                                            "last_name": singleReview.last_name,
                                        }

                                        const emailContents = await getLanguageWiseContents("photo_video_review_reminder", replaceVars, shop._id, customer_locale);
                                        emailContents.banner = getUploadDocument(emailContents.banner, shop.shop_id, 'banners');
                                        emailContents.logo = logo;

                                        var footerContent = "";
                                        if (generalSettingsModel.email_footer_enabled) {
                                            footerContent = generalSettingsModel[customer_locale] ? generalSettingsModel[customer_locale].footerText : "";
                                        }
                                        emailContents.footerContent = footerContent;
                                        emailContents.email_footer_enabled = generalSettingsModel.email_footer_enabled;

                                        var emailHtmlContent = ReactDOMServer.renderToStaticMarkup(
                                            <ReviewRequestEmailTemplate emailContents={emailContents} mapProductDetails={mapProductDetails} generalAppearancesObj={generalAppearancesObj} />
                                        );
                                        const reviewLink = `${settingsJson.host_url}/photo-video-review-request/${singleReview._id}`;
                                        emailHtmlContent = emailHtmlContent.replace(`{{review_link_${singleReview.product_id}}}`, reviewLink);
                                        const variantTitle = singleReview.variant_title ? singleReview.variant_title : "";
                                        emailHtmlContent = emailHtmlContent.replace(`{{variant_title_${singleReview.product_id}}}`, variantTitle);

                                        const unsubscribeData = {
                                            "shop_id": shop.shop_id,
                                            "email": singleReview.email,
                                        }
                                        const unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);
                                        emailHtmlContent = emailHtmlContent.replace(`{{unsubscriptionLink}}`, unsubscriptionLink);

                                        // Send request email
                                        const subject = emailContents.subject;

                                        const response = await sendEmail({
                                            to: singleReview.email,
                                            subject,
                                            html: emailHtmlContent,
                                        });

                                        /*Update reminder sent status */

                                        await productReviews.updateOne(
                                            { _id: singleReview._id },
                                            {
                                                $set: {
                                                    is_reminder_sent: true,
                                                }
                                            },
                                            { upsert: true }
                                        );
                                    }
                                }
                            }
                        }
                    }
                    return json({ "status": 200, "message": "success" });
                }

            } catch (error) {
                console.log(error);
                return json({ "status": 400, "message": "Operation failed" });
            }
        default:
            return json({ "message": "", "method": "POST" });
    }

}

function getScheduleDate(products, ordersItems, reviewRequestTimingSettings, shopRecords) {
    var scheduleDate = null;
    switch (products.status) {
        case "pending":
            if (!reviewRequestTimingSettings.is_different_timing) {
                if (reviewRequestTimingSettings.default_order_timing == 'purchase') {
                    scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone);
                }
            } else {
                if (shopRecords.country_code == ordersItems.country_code) {
                    if (reviewRequestTimingSettings.domestic_order_timing == 'purchase') {
                        scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone);

                    }
                } else {

                    if (reviewRequestTimingSettings.intenational_order_timing == 'purchase') {
                        scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.intenational_day_timing, shopRecords.timezone);
                    }
                }
            }
            break;
        case "fulfilled":
            if (!reviewRequestTimingSettings.is_different_timing) {
                if (reviewRequestTimingSettings.default_order_timing == 'purchase') {
                    scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone);
                } else if (reviewRequestTimingSettings.default_order_timing == 'fulfillment') {
                    scheduleDate = addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone);
                } else if (reviewRequestTimingSettings.default_order_timing == 'delivery' && reviewRequestTimingSettings.fallback_timing != "") {
                    scheduleDate = addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.fallback_timing, shopRecords.timezone);
                }
            } else {
                if (shopRecords.country_code == ordersItems.country_code) {
                    if (reviewRequestTimingSettings.domestic_order_timing == 'purchase') {
                        scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone);
                    } else if (reviewRequestTimingSettings.domestic_order_timing == 'fulfillment' && products.fulfillment_date) {
                        scheduleDate = addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone);
                    }
                } else {
                    if (reviewRequestTimingSettings.intenational_order_timing == 'purchase') {
                        scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.intenational_day_timing, shopRecords.timezone);
                    } else if (reviewRequestTimingSettings.intenational_order_timing == 'fulfillment' && products.fulfillment_date) {
                        scheduleDate = addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.intenational_day_timing, shopRecords.timezone);
                    }
                }
            }
            break;
        case "delivered":
            if (!reviewRequestTimingSettings.is_different_timing) {
                if (reviewRequestTimingSettings.default_order_timing == 'purchase') {
                    scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone);
                } else if (reviewRequestTimingSettings.default_order_timing == 'fulfillment') {
                    scheduleDate = addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone);
                } else if (reviewRequestTimingSettings.default_order_timing == 'delivery') {
                    scheduleDate = addDaysToDate(products.delivered_date, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone);
                }
            } else {
                if (shopRecords.country_code == ordersItems.country_code) {
                    if (reviewRequestTimingSettings.domestic_order_timing == 'purchase') {
                        scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone);
                    } else if (reviewRequestTimingSettings.domestic_order_timing == 'fulfillment' && products.fulfillment_date) {
                        scheduleDate = addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone);
                    }
                } else {
                    if (reviewRequestTimingSettings.intenational_order_timing == 'purchase') {
                        scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.intenational_day_timing, shopRecords.timezone);
                    } else if (reviewRequestTimingSettings.intenational_order_timing == 'fulfillment' && products.fulfillment_date) {
                        scheduleDate = addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.intenational_day_timing, shopRecords.timezone);
                    }
                }
            }
            break;
    }
    return scheduleDate;

}