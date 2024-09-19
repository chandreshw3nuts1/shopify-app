import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import { GraphQLClient } from "graphql-request";
import { findOneRecord, getShopifyProducts, getLanguageWiseContents, generateUnsubscriptionLink } from "./../utils/common";
import ReplyEmailTemplate from './components/email/ReplyEmailTemplate';
import ReactDOMServer from 'react-dom/server';
import { ObjectId } from 'mongodb';
import productReviews from "./models/productReviews";
import productReviewQuestions from "./models/productReviewQuestions";
import reviewDocuments from "./models/reviewDocuments";
import generalAppearances from "./models/generalAppearances";
import generalSettings from './models/generalSettings';

import { getUploadDocument } from "./../utils/documentPath";
export async function loader() {

	return json({});
}


export async function action({ request }) {
	const requestBody = await request.json();

	const method = request.method;

	switch (method) {
		case "POST":
			var { shop, page, limit, filter_status, filter_stars, search_keyword, filter_options, actionType } = requestBody;
			page = page == 0 ? 1 : page;
			try {
				if (actionType == 'changeReviewStatus') {

					const status = await productReviews.updateOne(
						{ _id: requestBody.oid },
						{
							$set: { status: requestBody.value }
						}
					);
					return json({ "status": 200, "message": "Status updated!" });

				} else if (actionType == 'addReviewReply') {
					await productReviews.updateOne(
						{ _id: requestBody.review_id },
						{
							$set: { replyText: requestBody.reply, replied_at: new Date() }
						}
					);

					if (requestBody.subActionType == 'editReview') {
						var msg = "Your reply updated!";
					} else if (requestBody.subActionType == 'deleteReply') {
						var msg = "Your reply deleted!";
					} else {

						/* send email to admin when new reivew receive*/

						const productReviewsItem = await productReviews.findOne({ _id: requestBody.review_id });
						const shopRecords = await findOneRecord("shop_details", { "_id": productReviewsItem.shop_id });
						const generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id });
						const replaceVars = {
							"name": productReviewsItem.display_name,
							"product": productReviewsItem.product_title,
							"reply_content": requestBody.reply,
						}
						const customer_locale = productReviewsItem.customer_locale ? productReviewsItem.customer_locale : "en";
						const emailContents = await getLanguageWiseContents("review_reply", replaceVars, productReviewsItem.shop_id, productReviewsItem.customer_locale);
						emailContents.banner = getUploadDocument(emailContents.banner, shopRecords.shop_id, 'banners');

						const generalAppearancesObj = await generalAppearances.findOne({ shop_id: productReviewsItem.shop_id });
						const logo = getUploadDocument(generalAppearancesObj.logo, shopRecords.shop_id, 'logo');
						emailContents.logo = logo;

						const subject = emailContents.subject;

						var footerContent = "";
						if (generalSettingsModel.email_footer_enabled) {
							footerContent = generalSettingsModel[customer_locale] ? generalSettingsModel[customer_locale].footerText : "";
						}
						emailContents.footerContent = footerContent;
						emailContents.email_footer_enabled = generalSettingsModel.email_footer_enabled;

						const unsubscribeData = { 
							"shop_id": shopRecords.shop_id,
							"email": productReviewsItem.email,
						}
						emailContents.unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);

						const emailHtml = ReactDOMServer.renderToStaticMarkup(
							<ReplyEmailTemplate emailContents={emailContents} generalAppearancesObj={generalAppearancesObj} />
						);
						const response = await sendEmail({
							to: productReviewsItem.email,
							subject,
							html: emailHtml,
						});

						var msg = "Your reply added!";
					}
					return json({ "status": 200, "message": msg });

				} else if (actionType == 'bulkRatingStatus') {
					const { shop, filter_status, filter_stars, search_keyword, filter_options } = requestBody.searchFormData;

					const shopRecords = await findOneRecord("shop_details", { "shop": shop });
					const query = {
						"shop_id": shopRecords._id, "status": filter_status, "rating": parseInt(filter_stars),
						$or: [
							{ first_name: { $regex: search_keyword, $options: 'i' } },
							{ last_name: { $regex: search_keyword, $options: 'i' } },
							{ product_title: { $regex: search_keyword, $options: 'i' } }
						]
					};
					if (filter_status == 'all') {
						delete query['status'];
					} if (filter_stars == 'all') {
						delete query['rating'];
					}


					let matchFilterOption = {};
					if (filter_options == 'image_video') {
						matchFilterOption = {
							"reviewDocuments.type": { $in: ["image", "video"] }
						};
					} else if (filter_options == 'image') {
						matchFilterOption = {
							"reviewDocuments": {
								$all: [
									{ $elemMatch: { type: "image" } }
								],
								$not: { $elemMatch: { type: { $ne: "image" } } }
							}
						};
					} else if (filter_options == 'video') {
						matchFilterOption = {
							"reviewDocuments": {
								$all: [
									{ $elemMatch: { type: "video" } }
								],
								$not: { $elemMatch: { type: { $ne: "video" } } }
							}
						};

					} else if (filter_options == 'tag_as_feature') {
						query['tag_as_feature'] = true;

					} else if (filter_options == 'verify_badge') {
						query['verify_badge'] = true;

					} else if (filter_options == 'carousel_review') {
						query['add_to_carousel'] = true;
					} else if (filter_options == 'imported_review') {
						query['is_imported'] = true;
					}

					const reviewBulkItemsPipeline = [
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
						{ $project: { _id: 1 } }
					];

					const reviewModels = await productReviews.aggregate([
						reviewBulkItemsPipeline
					]);

					const reviewIds = reviewModels.map(review => review._id);

					if (requestBody.subActionType == 'delete') {

						await productReviewQuestions.deleteMany({ review_id: { $in: reviewIds } });
						await reviewDocuments.deleteMany({ review_id: { $in: reviewIds } });
						await productReviews.deleteMany(query);

						var msg = "Review deleted";
					} else {
						await productReviews.updateMany(
							{ _id: { $in: reviewIds } },
							{ $set: { status: requestBody.subActionType } }
						);

						if (requestBody.subActionType == 'publish') {
							var msg = "Review published";
						} else {
							var msg = "Review unpublished";
						}

					}
					return json({ "status": 200, "message": msg });

				} else if (actionType == 'imageSliderAction') {
					const { doc_id, review_id, subActionType } = requestBody;
					const reviewDocumentModel = await reviewDocuments.findOne(
						{ _id: doc_id }
					);
					const docType = reviewDocumentModel.type == 'image' ? 'photo' : 'video';
					if (subActionType == 'makeCoverPhoto') {

						await reviewDocuments.updateMany(
							{ review_id: review_id },
							{
								$set: { is_cover: false }
							}
						);

						await reviewDocuments.updateOne(
							{ _id: doc_id },
							{
								$set: { is_cover: true }
							}
						);

						var msg = `Cover ${docType} set`;
					} else if (subActionType == 'hidePhoto') {

						await reviewDocuments.updateOne(
							{ _id: doc_id },
							{
								$set: { is_approve: false }
							}
						);

						var msg = `${docType.charAt(0).toUpperCase()}${docType.slice(1)} hidden`;
					} else if (subActionType == 'approvePhoto') {

						await reviewDocuments.updateOne(
							{ _id: doc_id },
							{
								$set: { is_approve: true }
							}
						);

						var msg = `${docType.charAt(0).toUpperCase()}${docType.slice(1)} approve`;
					}


					return json({ "status": 200, "message": msg });
				} else if (actionType == 'moreOptionChange') {
					const { review_id, subActionType } = requestBody;

					const reviewId = new ObjectId(review_id);

					if (subActionType == 'feature') {

						await productReviews.updateOne(
							{ _id: reviewId },
							{
								$set: { tag_as_feature: true }
							},
							{ upsert: true }
						);


						var msg = "Feature tag added";
					} else if (subActionType == 'remove-feature') {

						await productReviews.updateOne(
							{ _id: reviewId },
							{
								$set: { tag_as_feature: false }
							},
							{ upsert: true }
						);


						var msg = "Feature tag removed";
					} else if (subActionType == 'verify-badge') {

						await productReviews.updateOne(
							{ _id: reviewId },
							{
								$set: { verify_badge: true }
							},
							{ upsert: true }
						);


						var msg = "Verified badge added";
					} else if (subActionType == 'remove-verify-badge') {

						await productReviews.updateOne(
							{ _id: reviewId },
							{
								$set: { verify_badge: false }
							},
							{ upsert: true }
						);


						var msg = "Verified badge removed";
					} else if (subActionType == 'add-to-carousel') {

						await productReviews.updateOne(
							{ _id: reviewId },
							{
								$set: { add_to_carousel: true }
							},
							{ upsert: true }
						);

						var msg = "Review added";
					} else if (subActionType == 'remove-add-to-carousel') {

						await productReviews.updateOne(
							{ _id: reviewId },
							{
								$set: { add_to_carousel: false }
							},
							{ upsert: true }
						);

						var msg = "Review removed";
					} else if (subActionType == 'add-to-video-slider') {

						await productReviews.updateOne(
							{ _id: reviewId },
							{
								$set: { video_slider: true }
							},
							{ upsert: true }
						);

						var msg = "Review added";
					} else if (subActionType == 'remove-video-slider') {

						await productReviews.updateOne(
							{ _id: reviewId },
							{
								$set: { video_slider: false }
							},
							{ upsert: true }
						);

						var msg = "Review removed";
					}

					return json({ "status": 200, "message": msg });
				} else if (actionType == 'changeProductHandle') {
					const { review_id, changeProductHandle } = requestBody;
					var updatedProductData = "";
					if (changeProductHandle != "" && review_id != "") {
						const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shop });
						const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
							headers: {
								'X-Shopify-Access-Token': shopSessionRecords.accessToken,
							},
						});

						const productHandle = `"${changeProductHandle}"`;

						const query = `
							{
								productByHandle(handle: ${productHandle}) {
								id
								title
								descriptionHtml
								handle
								}
							}`;

						const data = await client.request(query);
						if (data.productByHandle != null) {
							const newProductData = data.productByHandle;
							const newProductId = newProductData.id.split('/').pop();
							const newProductUrl = `/products/${newProductData.handle}`;


							await productReviews.updateOne(
								{ _id: review_id },
								{
									$set: {
										product_id: newProductId,
										product_title: newProductData.title,
										product_url: newProductUrl,
									}
								}
							);
							var msg = "Product changed";
							var status = 200;
							updatedProductData = {
								product_title: newProductData.title,
								product_url: newProductData.handle,
							}
						} else {
							var msg = `No product was found for handle: ${changeProductHandle}`;
							var status = 400;
						}

					} else {
						var msg = "Product handle required";
						var status = 400;
					}

					return json({ "status": status, "message": msg, "updatedProductData": updatedProductData });

				} else {
					const shopRecords = await findOneRecord("shop_details", { "shop": shop });
					const query = {
						"shop_id": shopRecords._id, "status": filter_status, "rating": parseInt(filter_stars),
						$or: [
							{ first_name: { $regex: search_keyword, $options: 'i' } },
							{ last_name: { $regex: search_keyword, $options: 'i' } },
							{ product_title: { $regex: search_keyword, $options: 'i' } }
						]
					};
					if (filter_status == 'all') {
						delete query['status'];
					} if (filter_stars == 'all') {
						delete query['rating'];
					}

					let matchFilterOption = {};
					if (filter_options == 'image_video') {
						matchFilterOption = {
							"reviewDocuments.type": { $in: ["image", "video"] }
						};
					} else if (filter_options == 'image') {
						matchFilterOption = {
							"reviewDocuments": {
								$all: [
									{ $elemMatch: { type: "image" } }
								],
								$not: { $elemMatch: { type: { $ne: "image" } } }
							}
						};
					} else if (filter_options == 'video') {
						matchFilterOption = {
							"reviewDocuments": {
								$all: [
									{ $elemMatch: { type: "video" } }
								],
								$not: { $elemMatch: { type: { $ne: "video" } } }
							}
						};

					} else if (filter_options == 'tag_as_feature') {
						query['tag_as_feature'] = true;

					} else if (filter_options == 'verify_badge') {
						query['verify_badge'] = true;

					} else if (filter_options == 'carousel_review') {
						query['add_to_carousel'] = true;

					} else if (filter_options == 'video_slider') {
						query['video_slider'] = true;
					} else if (filter_options == 'imported_review') {
						query['is_imported'] = true;
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
							$match: query // Apply your initial match query
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
								is_review_request: { $first: "$is_review_request" },
								tag_as_feature: { $first: "$tag_as_feature" },
								verify_badge: { $first: "$verify_badge" },
								add_to_carousel: { $first: "$add_to_carousel" },
								video_slider: { $first: "$video_slider" },
								discount_price_rule_id: { $first: "$discount_price_rule_id" },
								reviewDocuments: { $first: "$reviewDocuments" }, // Use $first to avoid duplicates
								reviewQuestionsAnswer: {
									$push: {
										_id: "$reviewQuestionsAnswer._id",
										review_id: "$reviewQuestionsAnswer.review_id",
										answer: "$reviewQuestionsAnswer.answer",
										question_name: "$reviewQuestionsAnswer.question_name",
										question_id: "$reviewQuestionsAnswer.question_id",
										createdAt: "$reviewQuestionsAnswer.createdAt",
										reviewQuestions: {
											_id: "$reviewQuestionsAnswer.reviewQuestions._id",
											question: "$reviewQuestionsAnswer.reviewQuestions.question",
											createdAt: "$reviewQuestionsAnswer.reviewQuestions.createdAt"
										}
									}
								}
							}
						},
						{
							$match: matchFilterOption // Apply your second match filter
						},
						{
							$sort: { createdAt: -1 } // Sort after matching
						},
						{
							$skip: (page - 1) * limit // Apply pagination
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
								verify_badge: 1,
								add_to_carousel: 1,
								video_slider: 1,
								discount_price_rule_id: 1,
								reviewDocuments: 1,
								reviewQuestionsAnswer: {
									$filter: {
										input: "$reviewQuestionsAnswer",
										as: "item",
										cond: { $ne: ["$$item._id", null] }
									}
								}
							}
						}
					]);


					//return reviewItems;
					var hasMore = 0;
					var mapProductDetails = {};
					if (reviewItems.length > 0) {
						// const shopSessionRecords = await findOneRecord("shopify_sessions", {"shop" : shop});

						var hasMore = 1;
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

					return json({ reviewItems, totalReviewItems, hasMore });
				}


			} catch (error) {
				console.log(error);
				return json({ "status": 400, "message": "Operation failed" });
			}
		case "DELETE":
			try {
				var { review_id } = requestBody;
				const objectId = new ObjectId(review_id);
				deleteReview(review_id);
				return json({ "status": 200, "message": "Review deleted successfully!" });
			} catch (error) {
				return json({ "status": 400, "message": "Error deleting record!" });
			}

		default:

			return json({ "message": "", "method": "POST" });

	}

}


async function deleteReview(review_id) {
	await productReviews.findOneAndDelete({ _id: review_id });

	await productReviewQuestions.deleteMany({ review_id: review_id });
	await reviewDocuments.deleteMany({ review_id: review_id });
}

