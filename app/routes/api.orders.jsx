import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import { findOneRecord, getShopifyProducts, getLanguageWiseContents, generateUnsubscriptionLink } from "./../utils/common";
import ReactDOMServer from 'react-dom/server';
import manualReviewRequests from "./models/manualReviewRequests";
import manualRequestProducts from "./models/manualRequestProducts";
import generalAppearances from "./models/generalAppearances";
import reviewRequestTimingSettings from './models/reviewRequestTimingSettings';
import reviewRequestTracks from './models/reviewRequestTracks';
import generalSettings from './models/generalSettings';

import { getUploadDocument } from './../utils/documentPath';
import ReviewRequestEmailTemplate from './components/email/ReviewRequestEmailTemplate';
import settingJson from './../utils/settings.json';

export async function loader() {
	return json({});
}


export async function action({ request }) {
	const requestBody = await request.json();
	const method = request.method;
	switch (method) {
		case "POST":
			var { shop, page, limit, filter_status, filter_time, start_date, end_date, search_keyword, actionType } = requestBody;
			page = page == 0 ? 1 : page;
			try {
				const shopRecords = await findOneRecord("shop_details", { "shop": shop });

				if (actionType == 'orderListing') {


					const query = {
						"shop_id": shopRecords._id, "manualRequestProducts.status": filter_status,
						$or: [
							{ email: { $regex: search_keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },

						]
					};
					if (filter_time == "custom" && start_date && end_date && start_date != 'Invalid date') {
						query.createdAt = {
							$gte: new Date(start_date),
							$lt: new Date(end_date + " 23:59:59")
						};
					}
					if (filter_status == 'all') {
						delete query['manualRequestProducts.status'];
					}

					const matchFilterStatusOption = (filter_status === 'all')
						? {} // No filtering if filter_status is 'all'
						: {
							$filter: {
								input: "$manualRequestProducts",
								as: "item",
								cond: { $eq: ["$$item.status", filter_status] }
							}
						};

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
							$addFields: {
								manualRequestProducts: {
									$cond: {
										if: { $eq: [filter_status, 'all'] },
										then: "$manualRequestProducts",
										else: matchFilterStatusOption
									}
								}
							}
						},
						{
							$unwind: {
								path: "$manualRequestProducts",
								preserveNullAndEmptyArrays: true
							}
						},
						{
							$match: query
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
										fulfillment_date: "$manualRequestProducts.fulfillment_date",
										delivered_date: "$manualRequestProducts.delivered_date",

										createdAt: "$manualRequestProducts.createdAt",
										updatedAt: "$manualRequestProducts.updatedAt"
									}
								}
							}
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


					// return ordersItems;
					var hasMore = 0;
					var mapProductDetails = {};
					if (ordersItems.length > 0) {

						var hasMore = 1;
						const uniqueProductIds = ordersItems.flatMap(order =>
							order.manualRequestProducts.map(product => product.product_id)
						);
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

					const reviewRequestTimingSettingsModel = await reviewRequestTimingSettings.findOne({
						shop_id: shopRecords._id
					});
					return json({ ordersItems, mapProductDetails, hasMore, reviewRequestTimingSettings: reviewRequestTimingSettingsModel });
				} else if (actionType == 'sendRequest') {
					const { requestId } = requestBody;
					const manualRequestModel = await manualReviewRequests.findOne({ _id: requestId });
					if (manualRequestModel) {
						const manualRequestProductsModel = await manualRequestProducts.find({ manual_request_id: manualRequestModel._id });

						const generalAppearancesObj = await generalAppearances.findOne({ shop_id: shopRecords._id });
						const logo = getUploadDocument(generalAppearancesObj.logo, shopRecords.shop_id, 'logo');

						const uniqueProductIds = manualRequestProductsModel.map(item => item.product_id);


						const productIds = uniqueProductIds.map((item) => `"gid://shopify/Product/${item}"`);
						var mapProductDetails = await getShopifyProducts(shop, productIds, 200);

						const customer_locale = manualRequestModel.customer_locale;

						const replaceVars = {
							"order_number": manualRequestModel.order_number,
							"name": manualRequestModel.first_name,
							"last_name": manualRequestModel.last_name,
						}
						const emailContents = await getLanguageWiseContents("review_request", replaceVars, shopRecords._id, customer_locale);
						emailContents.banner = getUploadDocument(emailContents.banner, shopRecords.shop_id, 'banners');

						emailContents.logo = logo;


						var generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id });

						var footerContent = "";
						if (generalSettingsModel.email_footer_enabled) {
							footerContent = generalSettingsModel[customer_locale] ? generalSettingsModel[customer_locale].footerText : "";
						}
						emailContents.footerContent = footerContent;
						emailContents.email_footer_enabled = generalSettingsModel.email_footer_enabled;


						var emailHtmlContent = ReactDOMServer.renderToStaticMarkup(
							<ReviewRequestEmailTemplate emailContents={emailContents} mapProductDetails={mapProductDetails} generalAppearancesObj={generalAppearancesObj} />
						);

						await Promise.all(manualRequestProductsModel.map(async (product, index) => {

							const reviewLink = `${settingJson.host_url}/review-request/${product._id}/review-form`;
							emailHtmlContent = emailHtmlContent.replace(`{{review_link_${product.product_id}}}`, reviewLink);
							const variantTitle = product.variant_title ? product.variant_title : "";
							emailHtmlContent = emailHtmlContent.replace(`{{variant_title_${product.product_id}}}`, variantTitle);
						}));

						
						const unsubscribeData = { 
							"shop_id": shopRecords.shop_id,
							"email": manualRequestModel.email,
						}
						const unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);
						emailHtmlContent = emailHtmlContent.replace(`{{unsubscriptionLink}}`, unsubscriptionLink);
						

						// Send request email
						const subject = emailContents.subject;
						const response = await sendEmail({
							to: manualRequestModel.email,
							subject,
							html: emailHtmlContent,
						});

						await manualReviewRequests.updateOne(
							{ _id: requestId },
							{
								$set: { request_status: "sent" }
							}
						);

						await manualRequestProducts.updateMany(
							{ manual_request_id: requestId },
							{
								$set: { status: "sent" }
							}
						);

						/* Add review request sent track  */
						const reviewRequestTracksModel = new reviewRequestTracks({
							shop_id: shopRecords._id,
						});
						await reviewRequestTracksModel.save();
						/* Add review request sent track end*/

					}

					return json({ "status": 200, "message": "Request sent" });

				} else if (actionType == 'cancelRequest') {
					const { requestId } = requestBody;
					const manualRequestModel = await manualReviewRequests.findOne({ _id: requestId });
					if (manualRequestModel) {

						await manualReviewRequests.updateOne(
							{ _id: requestId },
							{
								$set: { request_status: "cancel" }
							}
						);

						await manualRequestProducts.updateMany(
							{ manual_request_id: requestId },
							{
								$set: { status: "cancelled" }
							}
						);
					}

					return json({ "status": 200, "message": "Request order cancelled" });

				}

			} catch (error) {
				console.log(error);
				return json({ "status": 400, "message": "Operation failed" });
			}
		default:
			return json({ "message": "", "method": "POST" });
	}

}
