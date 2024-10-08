import { json } from "@remix-run/node";
import { mongoConnection } from "./../utils/mongoConnection";
import { ObjectId } from 'mongodb';
import { getShopDetailsByShop } from './../utils/common';
import productReviewWidgetCustomizes from "./models/productReviewWidgetCustomizes";
import sidebarReviewWidgetCustomizes from "./models/sidebarReviewWidgetCustomizes";
import popupModalWidgetCustomizes from "./models/popupModalWidgetCustomizes";
import floatingWidgetCustomizes from "./models/floatingWidgetCustomizes";
import reviewFormSettings from "./models/reviewFormSettings";
import { createMetafields } from './../utils/common';

export async function loader() {
    return json({});
}


export async function action({ request }) {
    const requestBody = await request.json();

    const method = request.method;
    switch (method) {
        case "POST":
            const { shop, actionType, language } = requestBody;
            try {
                const db = await mongoConnection();
                const shopRecords = await getShopDetailsByShop(shop);

                if (actionType == 'productReviewCustomize') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestBody.field]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await productReviewWidgetCustomizes.findOneAndUpdate(query, update, options);
                    return json({ "status": 200, "message": "Settings saved" });
                } else if (actionType == 'productReviewCustomizeLanguageContent') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [`${language}.${requestBody.field}`]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await productReviewWidgetCustomizes.findOneAndUpdate(query, update, options);

                    return json({ status: 200, message: "Setting saved" });
                } else if (actionType == 'reviewFormSettings') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestBody.field]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await reviewFormSettings.findOneAndUpdate(query, update, options);
                    return json({ "status": 200, "message": "Settings saved" });
                } else if (actionType == 'reviewFormSettingsLanguageContent') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [`${language}.${requestBody.field}`]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await reviewFormSettings.findOneAndUpdate(query, update, options);

                    return json({ status: 200, message: "Setting saved" });
                } else if (actionType == 'sidebarReviewCustomize') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestBody.field]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    

                    await sidebarReviewWidgetCustomizes.findOneAndUpdate(query, update, options);
                    
                    if (["isActive", "isHomePage","isCartPage","isProductPage","isOtherPages",].includes(requestBody.field)) {
                        const sidebarWidgetModel = await sidebarReviewWidgetCustomizes.findOne({ shop_id: shopRecords._id });
                        const metafields = {
                            "isActive" : sidebarWidgetModel.isActive,
                            "isHomePage" : sidebarWidgetModel.isHomePage,
                            "isCartPage" : sidebarWidgetModel.isCartPage,
                            "isProductPage" : sidebarWidgetModel.isProductPage,
                            "isOtherPages" : sidebarWidgetModel.isOtherPages
                        };
                        await createMetafields(shopRecords, metafields, actionType);
                    }
                    return json({ "status": 200, "message": "Settings saved" });
                } else if (actionType == 'floatingWidgetCustomize') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestBody.field]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    

                    const floatingWidgetModel = await floatingWidgetCustomizes.findOneAndUpdate(query, update, options);
                    
                    if (["title"].includes(requestBody.field)) {
                        const metafields = {
                            "title" : floatingWidgetModel.title,
                            "backgroundColor" : floatingWidgetModel.backgroundColor,
                            "textColor" : floatingWidgetModel.textColor
                        };
                        await createMetafields(shopRecords, metafields, actionType);
                    }
                    return json({ "status": 200, "message": "Settings saved" });
                } else if (actionType == 'popupModalReviewCustomize') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestBody.field]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    

                    await popupModalWidgetCustomizes.findOneAndUpdate(query, update, options);
                    
                    if (["maximumPerPage","initialDelay","delayBetweenPopups","popupDisplayTime", "isActive", "isHomePage","isCartPage","isProductPage","isOtherPages",].includes(requestBody.field)) {
                        const popupWidgetModel = await popupModalWidgetCustomizes.findOne({ shop_id: shopRecords._id });
                        const metafields = {
                            "initialDelay" : popupWidgetModel.initialDelay,
                            "delayBetweenPopups" : popupWidgetModel.delayBetweenPopups,
                            "popupDisplayTime" : popupWidgetModel.popupDisplayTime,
                            "isActive" : popupWidgetModel.isActive,
                            "isHomePage" : popupWidgetModel.isHomePage,
                            "isCartPage" : popupWidgetModel.isCartPage,
                            "isProductPage" : popupWidgetModel.isProductPage,
                            "isOtherPages" : popupWidgetModel.isOtherPages,
                            "maximumPerPage" : popupWidgetModel.maximumPerPage,
                            
                        };
                        await createMetafields(shopRecords, metafields, actionType);
                    }
                    return json({ "status": 200, "message": "Settings saved" });
                }





            } catch (error) {
                console.error('Error updating record:', error);
                return json({ error: 'Failed to update record', status: 500 });
            }

        case "DELETE":

        default:

            return json({ "message": "", "method": "POST" });

    }

    return json(requestBody);
}

