import { json } from "@remix-run/node";
import { mongoConnection } from './../utils/mongoConnection';
import generalSettings from './models/generalSettings';
import productGroups from './models/productGroups';
import { getShopDetailsByShop, createMetafields, updateTotalAndAverageSeoRating, getShopifyProducts } from './../utils/common';
import { ObjectId } from 'mongodb';

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
                if (actionType == 'generalSettings') {

                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestBody.field]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await generalSettings.findOneAndUpdate(query, update, options);

                    if (requestBody.field == 'is_enable_seo_rich_snippet') {
                        const metafields = {
                            "isActive": requestBody.value,
                        };
                        await createMetafields(shopRecords, metafields, 'seoRichSnippet');

                        /* update metafield for SEO rich snippet*/
                        await updateTotalAndAverageSeoRating(shopRecords);
                        /* End update metafield for SEO rich snippet*/
                    }

                    return json({ "status": 200, "message": "Settings saved" });

                } else if (actionType == 'generalSettingsFooterText') {
                    var { language } = requestBody;

                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [`${language}.${requestBody.field}`]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await generalSettings.findOneAndUpdate(query, update, options);

                    return json({ "status": 200, "message": "Settings saved" });

                } else if (actionType == 'addProductGroups') {
                    if (requestBody.groupName != "" && requestBody.selectedProducts.length > 0) {
                        const productGroupsModel = new productGroups({
                            shop_id: shopRecords._id,
                            product_ids: requestBody.selectedProducts.map(id => parseFloat(id)),
                            group_name: requestBody.groupName,
                        });

                        await productGroupsModel.save();

                        return json({ "status": 200, "message": "Product group added" });

                    } else {
                        return json({ "status": 400, "message": "Product required" });
                    }

                } else if (actionType == 'updateProductGroups') {
                    if (requestBody.groupName != "" && requestBody.selectedProducts.length > 0) {
                        await productGroups.updateOne(
                            { _id: new ObjectId(requestBody.editingGroupId) }, // Convert to ObjectId if needed
                            {
                                $set: {
                                    product_ids: requestBody.selectedProducts.map(id => parseFloat(id)), // Ensure this exists and is an array or valid data
                                    group_name: requestBody.groupName // Ensure this exists
                                }
                            }
                        );
                        

                        return json({ "status": 200, "message": "Product group saved" });

                    } else {
                        return json({ "status": 400, "message": "Product required" });
                    }

                } else if (actionType == 'getProductGroups') {
                    const productGroupsModel = await productGroups.find({ shop_id: shopRecords._id });
                    return json(productGroupsModel);
                } else if (actionType == 'editProductGroups') {
                    const groupId = requestBody.groupId;

                    const productGroupsModel = await productGroups.findOne({ _id: groupId });
                    const uniqueProductIds = productGroupsModel.product_ids;
                    const productIds = uniqueProductIds.map((item) => `"gid://shopify/Product/${item}"`);
                    var mapProductDetails = await getShopifyProducts(shopRecords.myshopify_domain, productIds);
                    let products = [];
                    //return mapProductDetails;
                    mapProductDetails.forEach(productEdge => {
                        products.push({
                            id: productEdge.id.split('/').pop(),
                            title: productEdge.title,
                            images: productEdge.images.edges.map(imageEdge => ({
                                transformedSrc: imageEdge.node.transformedSrc,
                            })),
                        });
                    });

                    // return products;

                    return json({groupName : productGroupsModel.group_name ,products});
                }


            } catch (error) {
                return json({ "status": 400, "message": "Failed to update record", error: error });
            }

        case "PATCH":
        case "DELETE":
            try {
                var { id, actionType } = requestBody;

                if (actionType == "productGroup") {
                    const objectId = new ObjectId(id);
                    await productGroups.findOneAndDelete({ _id: objectId });
                    return json({ "status": 200, "message": "Product group deleted successfully!" });
                }

            } catch (error) {
                console.error('Error deleting record:', error);
                return json({ "status": 400, "message": "Error deleting record!" });
            }
        default:

            return json({ "message": "", "method": "" });

    }
}
