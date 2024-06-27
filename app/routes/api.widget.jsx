import { json } from "@remix-run/node";
import { GraphQLClient } from 'graphql-request';
import ReactDOMServer from 'react-dom/server';
import ProductReviewWidget from './components/widget-components/product-review-widget';
import CreateReviewModalWidget from './components/widget-components/create-review-modal-widget';
import { getShopDetailsByShop, findOneRecord, getCustomQuestions } from './../utils/common';
import { mongoConnection } from './../utils/mongoConnection';
import productReviews from "./models/productReviews";

    export async function loader() {

        return json({
           
        });
    }

    export async function action({ request }) {
        
        try{
            const formData = await request.formData();
            const actionType = formData.get('actionType');
            const shop = formData.get('shop_domain');
            const shopRecords =await getShopDetailsByShop(shop);

            if(actionType == "openModal"){
                const customQuestionsData = await getCustomQuestions({
                    shop_id: shopRecords._id,
                });

                const dynamicModalComponent = <CreateReviewModalWidget shopRecords={shopRecords} customQuestionsData={customQuestionsData} />;
                const htmlModalContent = ReactDOMServer.renderToString(dynamicModalComponent);
                return json({
                    htmlModalContent :htmlModalContent
                });
            } else {

                const limit = parseInt(formData.get('no_of_review'));
                const page = parseInt(formData.get('page'));
                const sortBy = formData.get('sort_by');
                const productId = formData.get('product_id');
                const showImageReviews = formData.get('show_image_reviews');
                const showAllReviews = formData.get('show_all_reviews');
                const hideProductThumbnails = formData.get('hide_product_thumbnails');
                
                const shopSessionRecords = await findOneRecord("shopify_sessions", {shop : shop});
                const db = await mongoConnection();
                
                let sortByfield = "tag_as_feature";
                let sortByValue = -1;
                if (sortBy == 'featured') {
                    sortByfield = "tag_as_feature";
                    sortByValue = 1;
                } else if (sortBy == 'newest'){
                    sortByfield = "createdAt";
                    sortByValue = -1;
                } else if (sortBy == 'highest_ratings'){
                    sortByfield = "rating";
                    sortByValue = -1;
                } else if (sortBy == 'lowest_ratings'){
                    sortByfield = "rating";
                    sortByValue = 1;
                }

                const sortOption = {};
                sortOption[sortByfield] = sortByValue;
                sortOption["_id"] = -1;
                const query = {
                    shop_id : shopRecords._id,
                };
                if (showAllReviews == 'false' && productId !="") {
                    query['product_id'] = productId;
                }
                let matchFilterOption = {};
                if (showImageReviews == 'true') {
                    matchFilterOption = {
                        "reviewDocuments": {
                            $all: [
                                { $elemMatch: { type: "image" } }
                            ],
                            $not: { $elemMatch: { type: { $ne: "image" } } }
                        }
                    };
                }

                const totalReviewItemsPipeline = [
                    { $match: query },
                    {
                        $lookup: {
                            from: 'review_documents',
                            localField: '_id',
                            foreignField: 'review_id',
                            as: 'reviewDocuments'
                        }
                    },
                    { $match: matchFilterOption },
                    { $count: "total" }
                ];
                const totalReviewItemsResult = await productReviews.aggregate(totalReviewItemsPipeline);
                const totalReviewItems = totalReviewItemsResult.length > 0 ? totalReviewItemsResult[0].total : 0;
                
                const reviewItems = await productReviews.aggregate([
                    { 
                        $match: query 
                    },
                    {
                        $sort: sortOption 
                    },
                    { 
                        $skip: (page - 1) * limit 
                    },
                    { 
                        $limit: limit 
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
                        $lookup: {
                            from: 'product_review_questions',
                            localField: '_id',
                            foreignField: 'review_id',
                            as: 'reviewQuestionsAnswer'
                        }
                    },
                    {
                        $unwind: {
                            path: "$reviewQuestionsAnswer",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $group: {
                            _id: "$_id",
                            description: { $first: "$description" },
                            rating: { $first: "$rating" },
                            first_name: { $first: "$first_name" },
                            display_name: { $first: "$display_name" },
                            email: { $first: "$email" },
                            last_name: { $first: "$last_name" },
                            createdAt: { $first: "$createdAt" },
                            status: { $first: "$status" },
                            replyText: { $first: "$replyText" },
                            product_id: { $first: "$product_id" },
                            tag_as_feature: { $first: "$tag_as_feature" },
                            reviewDocuments: { $first: "$reviewDocuments" }, // Use $first to avoid duplicates
                            reviewQuestionsAnswer: { 
                                $push: {
                                    _id: "$reviewQuestionsAnswer._id",
                                    review_id: "$reviewQuestionsAnswer.review_id",
                                    answer: "$reviewQuestionsAnswer.answer",
                                    question_name: "$reviewQuestionsAnswer.question_name",
                                    question_id: "$reviewQuestionsAnswer.question_id",
                                    createdAt: "$reviewQuestionsAnswer.createdAt",
                                    deletedAt: "$reviewQuestionsAnswer.deletedAt",
                                }
                            }
                        }
                    },
                    {
                        $match: matchFilterOption
                    },
                    {
                        $sort: sortOption
                    },
                    {
                        $project: {
                            _id: 1,
                            description: 1,
                            rating: 1,
                            first_name: 1,
                            display_name: 1,
                            email: 1,
                            last_name: 1,
                            createdAt: 1,
                            status: 1,
                            images: 1,
                            replyText: 1,
                            product_id: 1,
                            is_review_request: 1,
                            tag_as_feature : 1,
                            reviewDocuments: {
                                $filter: {
                                    input: "$reviewDocuments",
                                    as: "doc",
                                    cond: { $eq: ["$$doc.is_approve", true] }
                                }
                            },
                            reviewQuestionsAnswer: {
                                $filter: {
                                    input: "$reviewQuestionsAnswer",
                                    as: "item",
                                    cond: {
                                        $and: [
                                            { $ne: ["$$item._id", null] },
                                            { $eq: ["$$item.deletedAt", null] }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                ]);
                
                //return reviewItems;
                const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
                    headers: {
                        'X-Shopify-Access-Token': shopSessionRecords.accessToken,
                    },
                });
                let productsDetails = [];
                let hasMore = 0;
                if (reviewItems.length > 0) {
                    hasMore = 1;
                    const totalPages =  page*limit;
                    if(totalPages >= totalReviewItems){
                        hasMore = 0;
                    }
                    
                    const productIds = reviewItems.map((item) =>  `"gid://shopify/Product/${item.product_id}"`);
                
                    const query = `{
                        nodes(ids: [${productIds}]) {
                            ... on Product {
                                id
                                title
                                description
                                images(first: 1) {
                                    edges {
                                        node {
                                            id
                                            transformedSrc(maxWidth: 100, maxHeight: 100)
                                        }
                                    }
                                }
                            }
                        }
                    } `;
                    productsDetails = await client.request(query);
                    if(productsDetails.nodes.length > 0) {
                        productsDetails = productsDetails.nodes;
                    }
        
                }
                const formParams = {
                    productId : productId,
                    page : page,
                    hasMore : hasMore,
                    hideProductThumbnails : hideProductThumbnails,
                }
                const dynamicComponent = <ProductReviewWidget shopRecords={shopRecords} reviewItems={reviewItems} productsDetails={productsDetails} formParams={formParams} />;
                const htmlContent = ReactDOMServer.renderToString(dynamicComponent);
                
                return json({
                    body:htmlContent,
                    hasMore : hasMore
                });
            }
        } catch(error){
            return json({
                error
            });
        }

    }
  