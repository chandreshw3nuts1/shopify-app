import { json } from "@remix-run/node";
import { mongoConnection } from "./../utils/mongoConnection";
import { ObjectId } from 'mongodb';
import { getShopDetailsByShop } from './../utils/common';
import productReviewWidgetCustomizes from "./models/productReviewWidgetCustomizes";
import sidebarReviewWidgetCustomizes from "./models/sidebarReviewWidgetCustomizes";
import reviewFormSettings from "./models/reviewFormSettings";
import { findOneRecord } from './../utils/common';

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
                        const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shopRecords.shop });

                        const metafieldApiUrl = `https://${shopRecords.shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/metafields.json`;
                        const sidebarWidgetModel = await sidebarReviewWidgetCustomizes.findOne({ shop_id: shopRecords._id });


                        const metafields = {
                            "isActive" : sidebarWidgetModel.isActive,
                            "isHomePage" : sidebarWidgetModel.isHomePage,
                            "isCartPage" : sidebarWidgetModel.isCartPage,
                            "isProductPage" : sidebarWidgetModel.isProductPage,
                            "isOtherPages" : sidebarWidgetModel.isOtherPages
                        };
                        const jsonMetafieldsString = JSON.stringify(metafields);

                        const metafieldData = {
                            "metafield": {
                                "namespace": "extension_status",
                                "key": "sidebar_widget_data",
                                "value": jsonMetafieldsString,
                                "type": "json"
                            }
                        }
                        
                        const metafieldResponse = await fetch(metafieldApiUrl, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'X-Shopify-Access-Token': shopSessionRecords.accessToken,
							},
							body: JSON.stringify(metafieldData),
						});
                        console.log(await metafieldResponse.json());

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

