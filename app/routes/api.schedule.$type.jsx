import { mongoConnection } from "./../utils/mongoConnection"
import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import ReactDOMServer from 'react-dom/server';
import shopDetails from "./models/shopDetails";
import reviewRequestTimingSettings from "./models/reviewRequestTimingSettings";
import manualReviewRequests from "./models/manualReviewRequests";
import manualRequestProducts from "./models/manualRequestProducts";

import generalAppearances from "./models/generalAppearances";
import settingsJson from './../utils/settings.json';
import { addDaysToDate } from './../utils/dateFormat';
import { getUploadDocument } from './../utils/documentPath';
import { getShopifyProducts, getLanguageWiseContents } from "./../utils/common";
import ReviewRequestEmailTemplate from './components/email/ReviewRequestEmailTemplate';
import reviewRequestTracks from './models/reviewRequestTracks';

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
                            const ordersItems = await manualReviewRequests.aggregate([
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

                                        const footer = "";

                                        const replaceVars = {
                                            "order_number": singleOrder.order_number,
                                            "name": singleOrder.first_name,
                                            "last_name": singleOrder.last_name,
                                        }
                                        const emailContents = await getLanguageWiseContents("review_request", replaceVars, shop._id, customer_locale);
                                        emailContents.banner = getUploadDocument(emailContents.banner, shop.shop_id, 'banners');

                                        var generalAppearancesObj = await generalAppearances.findOne({ shop_id: shop._id });

                                        emailContents.logo = getUploadDocument(generalAppearancesObj.logo, shop.shop_id, 'logo');

                                        var emailHtmlContent = ReactDOMServer.renderToStaticMarkup(
                                            <ReviewRequestEmailTemplate emailContents={emailContents} mapProductDetails={mapProductDetails} generalAppearancesObj={generalAppearancesObj} footer={footer} />
                                        );

                                        await Promise.all(singleOrder.manualRequestProducts.map(async (product, index) => {

                                            const reviewLink = `${settingsJson.host_url}/review-request/${product._id}/review-form`;
                                            emailHtmlContent = emailHtmlContent.replace(`{{review_link_${product.product_id}}}`, reviewLink);
                                            const variantTitle = product.variant_title ? product.variant_title : "";
                                            emailHtmlContent = emailHtmlContent.replace(`{{variant_title_${product.product_id}}}`, variantTitle);

                                        }));

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