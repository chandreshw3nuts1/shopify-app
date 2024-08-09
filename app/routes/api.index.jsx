import { json } from "@remix-run/node";
import { mongoConnection } from "./../utils/mongoConnection";
import { ObjectId } from 'mongodb';
import reviewRequestTracks from "./models/reviewRequestTracks";
import productReviews from "./models/productReviews";
import manualReviewRequests from "./models/manualReviewRequests";
import { getShopDetailsByShop } from './../utils/common';

export async function loader() {
    return json({});
}

export async function action({ request }) {
    const requestBody = await request.json();

    const method = request.method;
    switch (method) {
        case "POST":
            const { shop, selectedDays, actionType } = requestBody;
            try {
                const db = await mongoConnection();
                const shopRecords = await getShopDetailsByShop(shop);
                const shopObjectId = shopRecords._id;

                if (actionType == 'getStatistic') {

                    const days = parseInt(selectedDays);
                    const endDate = new Date();
                    const startDate = new Date();

                    if (days > 0 && !isNaN(days)) {
                        startDate.setDate(endDate.getDate() - days);
                    } else {
                        startDate.setTime(0); // Set startDate to epoch time
                    }

                    endDate.setHours(23, 59, 59, 999);

                    const query = {
                        shop_id: new ObjectId(shopObjectId)
                    };

                    if (days > 0) {
                        query.createdAt = {
                            $gte: startDate,
                            $lte: endDate
                        };
                    }
                    const countPipeline = [
                        { $match: query },
                        { $count: "total" } // Count the number of documents and name the field 'total'
                    ];

                    const countResult = await reviewRequestTracks.aggregate(countPipeline);
                    const requestSentcount = countResult.length > 0 ? countResult[0].total : 0;

                    // Get all received reviews

                    const totalReviewItemsPipeline = [
                        { $match: query },
                        { $count: "total" }
                    ];
                    const totalReviewItemsResult = await productReviews.aggregate(totalReviewItemsPipeline);
                    const totalReceivedReview = totalReviewItemsResult.length > 0 ? totalReviewItemsResult[0].total : 0;


					let matchFilterOption = {
                        "reviewDocuments.type": { $in: ["image", "video"] }
                    };

					const totalReviewItemsPipelineImage = [
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
					const totalReviewItemsImageResult = await productReviews.aggregate(totalReviewItemsPipelineImage);
					const totalReviewItemsImage = totalReviewItemsImageResult.length > 0 ? totalReviewItemsImageResult[0].total : 0;

                    // review revenue 

                    
                    const sumRevenuePipeline = [
                        { $match: query }, // Match the documents based on the query
                        { $group: {
                            _id: null, // Group all documents into a single group
                            total: { $sum: "$total_order_amount" } // Sum the `total_order_amount` field
                        }}
                    ];
                    
                    const countRevenueResult = await manualReviewRequests.aggregate(sumRevenuePipeline);
                    const reviewRevenue = countRevenueResult.length > 0 ? countRevenueResult[0].total : 0;



                    return json({ status: 200, data: { requestSentcount, totalReceivedReview, totalReviewItemsImage, reviewRevenue } });
                }

            } catch (error) {
                console.error('Error fetching record:', error);
                return json({ error: 'Failed to fetch record', status: 500 });
            }
        default:

            return json({ "message": "", "method": "POST" });

    }

}

