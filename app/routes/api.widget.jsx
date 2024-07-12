import { json } from "@remix-run/node";
import { GraphQLClient } from 'graphql-request';
import ReactDOMServer from 'react-dom/server';
import ProductReviewWidget from './components/widget-components/product-review-widget';
import CreateReviewModalWidget from './components/widget-components/create-review-modal-widget';
import ReviewDetailModalWidget from './components/widget-components/review-detail-modal-widget';

import { ObjectId } from 'mongodb';

import { getShopDetailsByShop, findOneRecord, getCustomQuestions } from './../utils/common';
import { mongoConnection } from './../utils/mongoConnection';
import productReviews from "./models/productReviews";
import { getShopifyProducts } from "./../utils/common";

export async function loader() {

    return json({

    });
}

export async function action({ request }) {

    try {
        const formData = await request.formData();
        const actionType = formData.get('actionType');
        const shop = formData.get('shop_domain');
        const shopRecords = await getShopDetailsByShop(shop);
        const shopSessionRecords = await findOneRecord("shopify_sessions", { shop: shop });

        if (actionType == "openModal") {
            const customQuestionsData = await getCustomQuestions({
                shop_id: shopRecords._id,
            });
            const paramObj = {
                cust_first_name: formData.get('cust_first_name'),
                cust_last_name: formData.get('cust_last_name'),
                cust_email: formData.get('cust_email'),
            }
            const dynamicModalComponent = <CreateReviewModalWidget shopRecords={shopRecords} customQuestionsData={customQuestionsData} paramObj={paramObj} />;
            const htmlModalContent = ReactDOMServer.renderToString(dynamicModalComponent);
            return json({
                htmlModalContent: htmlModalContent
            });
        } else if (actionType == "openReviewDetailModal") {
            try {

                const reviewId = new ObjectId(formData.get('reviewId'));

                const reviewQuery = {
                    _id: reviewId,
                };
                const reviewItems = await productReviews.aggregate([
                    {
                        $match: reviewQuery
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
                        $lookup: {
                            from: "custom_questions",
                            localField: "reviewQuestionsAnswer.question_id",
                            foreignField: "_id",
                            as: "reviewQuestionsAnswer.reviewQuestions"
                        }
                    },
                    {
                        $unwind: {
                            path: "$reviewQuestionsAnswer.reviewQuestions",
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
                                    reviewQuestions: {
                                        _id: "$reviewQuestionsAnswer.reviewQuestions._id",
                                        question: "$reviewQuestionsAnswer.reviewQuestions.question",
                                        isHideAnswers: "$reviewQuestionsAnswer.reviewQuestions.isHideAnswers",
                                        createdAt: "$reviewQuestionsAnswer.reviewQuestions.createdAt"
                                    }
                                }
                            }
                        }
                    },
                    {
                        $addFields: {
                          reviewDocuments: {
                            $sortArray: {
                              input: "$reviewDocuments",
                              sortBy: { is_cover: -1 }
                            }
                          }
                        }
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
                            tag_as_feature: 1,
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

                const reviewDetails = reviewItems[0];
                const productId = `"gid://shopify/Product/${reviewDetails.product_id}"`;
                var productsDetails = await getShopifyProducts(shop, productId);

                const hideProductThumbnails = formData.get('hide_product_thumbnails');

                const formParams = {
                    hideProductThumbnails: hideProductThumbnails,
                }
                const dynamicComponent = <ReviewDetailModalWidget shopRecords={shopRecords} reviewDetails={reviewDetails} productsDetails={productsDetails} formParams={formParams} />;
                const htmlContent = ReactDOMServer.renderToString(dynamicComponent);
                return json({
                    body: htmlContent,
                });


            } catch (error) {
                console.log(error);
                return json({
                    error
                });
            }
        } else {

            const limit = parseInt(formData.get('no_of_review'));
            const page = parseInt(formData.get('page'));
            const sortBy = formData.get('sort_by') != null ? formData.get('sort_by') : "featured";
            const filterByRatting = parseInt(formData.get('filter_by_ratting'));
            const productId = formData.get('product_id');
            const showImageReviews = formData.get('show_image_reviews');
            const showAllReviews = formData.get('show_all_reviews');
            const hideProductThumbnails = formData.get('hide_product_thumbnails');


            let sortByfield = "tag_as_feature";
            let sortByValue = -1;
            if (sortBy == 'featured') {
                sortByfield = "tag_as_feature";
                sortByValue = 1;
            } else if (sortBy == 'newest') {
                sortByfield = "createdAt";
                sortByValue = -1;
            } else if (sortBy == 'highest_ratings') {
                sortByfield = "rating";
                sortByValue = -1;
            } else if (sortBy == 'lowest_ratings') {
                sortByfield = "rating";
                sortByValue = 1;
            }

            const sortOption = {};
            sortOption[sortByfield] = sortByValue;
            sortOption["_id"] = -1;
            const query = {
                shop_id: shopRecords._id,
            };
            if (showAllReviews == 'false' && productId != "") {
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
            const countRating = await productReviews.aggregate([
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
                { $group: { _id: "$rating", count: { $sum: 1 } } }
            ])
            var mapRatting = countRating.map(item => ({
                stars: item._id,
                count: item.count
            }));

            const totalReviews = mapRatting.reduce((acc, item) => acc + item.count, 0);
            var averageRating = Math.round((mapRatting.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviews).toFixed(1));
            if (isNaN(averageRating)) {
                averageRating = 0;
            }
            
            if (!isNaN(filterByRatting)) {
                query['rating'] = filterByRatting;
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
            // const averageRating = Math.round((mapRatting.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviewItems).toFixed(1));
            
            const reviewItems = await productReviews.aggregate([
                {
                    $match: query
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
                    $match: matchFilterOption // Apply your second match filter
                },
                {
                    $sort: sortOption // Sort based on your sort option
                },
                {
                    $skip: (page - 1) * limit // Skip documents for pagination
                },
                {
                    $limit: limit // Limit the number of results per page
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
                        tag_as_feature: 1,
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

            //  return reviewItems;

            var mapProductDetails = {};

            let hasMore = 0;
            if (reviewItems.length > 0) {
                hasMore = 1;
                const totalPages = page * limit;
                if (totalPages >= totalReviewItems) {
                    hasMore = 0;
                }
                const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
                    headers: {
                        'X-Shopify-Access-Token': shopSessionRecords.accessToken,
                    },
                });

                const uniqueProductIds = [...new Set(reviewItems.map(item => item.product_id))];

                const productIds = uniqueProductIds.map((item) => `"gid://shopify/Product/${item}"`);
                var productsDetails = await getShopifyProducts(shop, productIds);

                if (productsDetails.length > 0) {
                    productsDetails.forEach(node => {
                        if (node) {
                            const id = node.id.split('/').pop();
                            mapProductDetails[id] = node;
                        }

                    });
                }

            }

            reviewItems.map(items => {
                items.productDetails = mapProductDetails[items.product_id];
                return items;
            });

            const formParams = {
                productId: productId,
                page: page,
                sortBy: sortBy,
                filterByRatting: filterByRatting,
                hasMore: hasMore,
                hideProductThumbnails: hideProductThumbnails,
                totalReviewItems: totalReviews,
                mapRatting: mapRatting,
                averageRating: averageRating

            }

            const dynamicComponent = <ProductReviewWidget shopRecords={shopRecords} reviewItems={reviewItems} formParams={formParams} />;
            const htmlContent = ReactDOMServer.renderToString(dynamicComponent);


            return json({
                body: htmlContent,
                hasMore: hasMore,
            });
        }

    } catch (error) {
        return json({
            error
        });
    }

}
