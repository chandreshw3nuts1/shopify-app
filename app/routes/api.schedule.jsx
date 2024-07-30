import { mongoConnection } from "./../utils/mongoConnection"
import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import ReactDOMServer from 'react-dom/server';
import shopDetails from "./models/shopDetails";
import reviewRequestTimingSettings from "./models/reviewRequestTimingSettings";
import manualReviewRequests from "./models/manualReviewRequests";
import manualRequestProducts from "./models/manualRequestProducts";
import settingJson from './../utils/settings.json';
import { addDaysToDate } from './../utils/dateFormat';

export async function loader() {
    return json({});
}


export async function action({ request }) {
    await mongoConnection();
    const requestBody = await request.json();
    const method = request.method;
    switch (method) {
        case "POST":
            var { actionType } = requestBody;
            try {

                if (actionType == 'sendReviewRequestEmail') {
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
                                        'manualRequestProducts.status': { $in: ['pending', 'fulfilled'] }
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
                                        manualRequestProducts: {
                                            $push: {
                                                _id: "$manualRequestProducts._id",
                                                manual_request_id: "$manualRequestProducts.manual_request_id",
                                                product_id: "$manualRequestProducts.product_id",
                                                line_item_id: "$manualRequestProducts.line_item_id",
                                                status: "$manualRequestProducts.status",
                                                filfillment_date: "$manualRequestProducts.filfillment_date",
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
                                        manualRequestProducts: 1
                                    }
                                }
                            ]);

                            if (ordersItems.length > 0) {
                                for (const singleOrder of ordersItems) {
                                    for (const product of singleOrder.manualRequestProducts) {
                                        var scheduleDate = getScheduleDate(product, singleOrder, timingSettings, shop);

                                        scheduleDate = new Date(scheduleDate);
                                        return scheduleDate;
                                        if (givenDate > currentDate) {
                                        } else {
                                        }


                                        return scheduleDate;


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
    console.log(products);
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
        case "fulfilled":
            if (!reviewRequestTimingSettings.is_different_timing) {
                if (reviewRequestTimingSettings.default_order_timing == 'purchase') {
                    scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone);
                } else if (reviewRequestTimingSettings.default_order_timing == 'fulfillment') {
                    scheduleDate = addDaysToDate(products.filfillment_date, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone);
                } else if (reviewRequestTimingSettings.fallback_timing != "") {
                    scheduleDate = addDaysToDate(products.filfillment_date, reviewRequestTimingSettings.fallback_timing, shopRecords.timezone);
                }

            } else {

                if (shopRecords.country_code == ordersItems.country_code) {
                    if (reviewRequestTimingSettings.domestic_order_timing == 'purchase') {
                        scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone);

                    } else if (reviewRequestTimingSettings.domestic_order_timing == 'fulfillment' && products.filfillment_date) {
                        scheduleDate = addDaysToDate(products.filfillment_date, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone);

                    }
                } else {

                    if (reviewRequestTimingSettings.intenational_order_timing == 'purchase') {
                        scheduleDate = addDaysToDate(products.createdAt, reviewRequestTimingSettings.intenational_day_timing, shopRecords.timezone);

                    } else if (reviewRequestTimingSettings.intenational_order_timing == 'fulfillment' && products.filfillment_date) {
                        scheduleDate = addDaysToDate(products.filfillment_date, reviewRequestTimingSettings.intenational_day_timing, shopRecords.timezone);
                    }
                }
            }

    }
    return scheduleDate;

}