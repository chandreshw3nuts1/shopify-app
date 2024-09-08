import { json } from '@remix-run/node';
import { findOneRecord, fetchAllProductsByHandles, generateRandomCode } from "./../utils/common";
import { isValidDateFormat } from "./../utils/dateFormat";



import productReviews from "./models/productReviews";

import reviewDocuments from "./models/reviewDocuments";
import generalSettings from "./models/generalSettings";
import Papa from 'papaparse';


import { ObjectId } from 'mongodb';

import settingsJson from "./../utils/settings.json";
import fs from "fs";
import path from "path";
import axios from "axios";

export const loader = async () => {

};

export async function action({ request }) {


	let requestJson;
	let formData;
	let actionType;
	let subActionType;
	let shop;
	if (request.headers.get('Content-Type') === 'application/json') {
		requestJson = await request.json();
		actionType = requestJson.actionType;
		subActionType = requestJson.subActionType;
		shop = requestJson.shop;
	} else {
		formData = await request.formData();
		actionType = formData.get('actionType');
		subActionType = formData.get('subActionType');
		shop = formData.get('shop');
	}

	const method = request.method;

	switch (method) {
		case "POST":
			try {
				const shopRecords = await findOneRecord("shop_details", { "shop": shop });
				const generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id });
				var customer_locale = generalSettingsModel.defaul_language;
				const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shop });

				if (actionType == 'exportReviews') {
					const query = {
						"shop_id": shopRecords._id
					};

					const domainPrefix = `${settingsJson.host_url}/uploads/`;

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
							$unwind: {
								path: "$reviewDocuments",
								preserveNullAndEmptyArrays: true
							}
						},
						{
							$group: {
								_id: "$_id",
								rating: { $first: "$rating" },
								status: { $first: "$status" },
								date: { $first: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$createdAt" } } },
								first_name: { $first: "$first_name" },
								last_name: { $first: "$last_name" },
								display_name: { $first: "$display_name" },
								email: { $first: "$email" },
								product_id: { $first: "$product_id" },
								product_title: { $first: "$product_title" },
								product_handle: { $first: "$product_url" },
								variant_title: { $first: "$variant_title" },
								review_description: { $first: "$description" },
								reply_text: { $first: "$replyText" },
								replied_at: { $first: { $dateToString: { format: "%Y-%m-%dT%H:%M:%S.%LZ", date: "$replied_at" } } },
								verified_purchase: { $first: "$verify_badge" },
								reviewDocuments: {
									$push: { $concat: [domainPrefix, "$reviewDocuments.url"] }
								}
							}
						},
						{
							$sort: { date: -1 } // Sort after matching
						},
						{
							$project: {
								_id: 1,
								rating: 1,
								status: 1,
								date: 1,
								first_name: 1,
								last_name: 1,
								display_name: 1,
								email: 1,
								product_id: 1,
								product_title: 1,
								product_handle: 1,
								variant_title: 1,
								review_description: 1,
								reply_text: 1,
								replied_at: 1,
								verified_purchase: 1,
								review_documents: {
									$reduce: {
										input: "$reviewDocuments",
										initialValue: "",
										in: {
											$cond: {
												if: { $eq: ["$$value", ""] },
												then: "$$this",
												else: { $concat: ["$$value", ",", "$$this"] }
											}
										}
									}
								}
							}
						}
					]);
					const csvData = convertToCSV(reviewItems);
					return new Response(csvData, {
						headers: {
							'Content-Type': 'text/csv',
						},
					});
				} else if (actionType == 'importReviewsFromSpreadsheet') {
					const file = formData.get('file');
					const buffer = await file.arrayBuffer();
					const text = new TextDecoder().decode(buffer);

					const results = Papa.parse(text, {
						header: true,
						skipEmptyLines: true,
					});
					const metaFields = results.meta.fields;
					const requiredFields = ["status", "rating", "email", "photo_url", "display_name", "review_description", "date", "reply_text", "reply_date", "product_handle", "verified_purchase"];

					const hasAllRequiredFields = requiredFields.every(field => metaFields.includes(field));
					if (!hasAllRequiredFields) {
						console.log("Some required fields are missing.");
						return json({ "status": 400, "message": "Invalid CSV file format." });
					}



					const csvData = results.data;

					if (csvData.length > 0) {

						const productDetails = await fetchAllProductsByHandles(csvData, 'product_handle', shopRecords.shop, shopSessionRecords.accessToken)
						const processCsvData = async () => {
							const uploadsDir = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/`);

							await Promise.all(csvData.map(async (item, index) => {
								if (productDetails && productDetails[item.product_handle] && item.rating && item.review_description && item.date && item.display_name && item.email) {
									const productItem = productDetails[item.product_handle];
									const userNames = item.display_name.split(' ');
									if (isValidDateFormat(item.date) == null) {
										return true;
									}

									const productReviewModel = new productReviews({
										shop_id: shopRecords._id,
										first_name: userNames[0] || " ",
										last_name: userNames[1] || " ",
										display_name: item.display_name,
										email: item.email || "",
										description: item.review_description,
										customer_locale: customer_locale,
										rating: item.rating,
										product_id: productItem.id,
										product_title: productItem.title,
										product_url: productItem.handle,
										status: item.status,
										is_imported: true,
										verify_badge: item.verified_purchase == "TRUE" ? true : false,
										replyText : item.reply_text,
										replied_at : isValidDateFormat(item.reply_date),
										createdAt: isValidDateFormat(item.date)
									});
									const result = await productReviewModel.save();

									const insertedId = result._id;

									if (item.photo_url) {
										await insertProductReviewDocuments(item.photo_url, uploadsDir, insertedId);
									}
								}

							}));
						};

						processCsvData().then(() => {
							console.log('CSV file uploaded successfully.');
						}).catch(err => {
							console.log('Error processing reviews:', err);
						});


					}
					return json({ "status": 200, "message": "CSV file uploaded successfully." });
				} else if (actionType == 'importReviewsFromApps') {
					const file = formData.get('file');
					const buffer = await file.arrayBuffer();
					const text = new TextDecoder().decode(buffer);

					const results = Papa.parse(text, {
						header: true,
						skipEmptyLines: true,
					});
					const metaFields = results.meta.fields;
					const csvData = results.data;
					
					let handleName = "";
					let requiredFields = [];
					if (subActionType == 'loox') {
						handleName = "handle";
						requiredFields = ["status", "rating", "email", "img", "nickname", "review", "date", "handle", "variant", "verified_purchase", "reply", "replied_at"];

					} else if (subActionType == 'judgeme') {
						handleName = "product_handle";
						requiredFields = ["body", "rating", "review_date", "reviewer_name", "reviewer_email", "product_handle", "reply", "reply_date", "picture_urls", "curated"];
					} else if (subActionType == 'okendo') {
						handleName = "handle";
						requiredFields = ["status", "body", "rating", "dateCreated", "name", "email", "handle", "reply", "replyDateCreated", "isVerifiedBuyer", "imageUrls", "videoUrls"];
					} else if (subActionType == 'junip') {
						handleName = "product_handle";
						requiredFields = ["state", "body", "rating", "created_at", "first_name", "last_name", "email", "product_handle", "verified_buyer", "photo_urls", "video_urls"];
					} else if (subActionType == 'yotpo') {
						handleName = "Product Handle";
						requiredFields = ["Review Status", "Review Content", "Review Score", "Review Creation Date", "Reviewer Display Name", "Reviewer Email", "Product Handle", "Comment Date", "Comment Content", "Published Image URLs", "Published Video URLs"];
					}

					const hasAllRequiredFields = requiredFields.every(field => metaFields.includes(field));

					if (!hasAllRequiredFields) {
						console.log("Some required fields are missing.");
						return json({ "status": 400, "message": "Invalid CSV file format." });
					}
					if (csvData.length > 0) {
						const productDetails = await fetchAllProductsByHandles(csvData, handleName, shopRecords.shop, shopSessionRecords.accessToken)
						const processCsvData = async () => {
							const uploadsDir = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/`);
							if (subActionType == 'loox') {
								await Promise.all(csvData.map(async (item, index) => {

									if (productDetails && productDetails[item.handle] && item.rating && item.review && item.date && item.nickname && item.email) {
										const productItem = productDetails[item.handle];
										const userNames = item.nickname.split(/[\s*]{3}|\s+/);

										const status = item.status == "Active" ? "publish" : "unpublish";
										const productReviewModel = new productReviews({
											shop_id: shopRecords._id,
											first_name: userNames[0] || " ",
											last_name: userNames[1] || " ",
											display_name: item.nickname,
											email: item.email || " ",
											description: item.review,
											customer_locale: customer_locale,
											rating: item.rating,
											product_id: productItem.id,
											product_title: productItem.title,
											product_url: productItem.handle,
											status: status,
											is_imported: true,
											imported_app: subActionType,
											verify_badge: item.verified_purchase == "TRUE" ? true : false,
											createdAt: item.date,
											replyText: item.reply,
											replied_at: item.replied_at
										});
										const result = await productReviewModel.save();

										const insertedId = result._id;

										if (item.img) {
											await insertProductReviewDocuments(item.img, uploadsDir, insertedId);
										}
									} else {
									}

								}));
							} else if (subActionType == 'judgeme') {
								await Promise.all(csvData.map(async (item, index) => {

									if (productDetails && productDetails[item.product_handle] && item.rating && item.body && item.review_date && item.reviewer_name && item.reviewer_email) {
										const productItem = productDetails[item.product_handle];
										const userNames = item.reviewer_name.split(/[\s*]{3}|\s+/);

										const status = item.curated == "ok" ? "publish" : "unpublish";
										const productReviewModel = new productReviews({
											shop_id: shopRecords._id,
											first_name: userNames[0] || " ",
											last_name: userNames[1] || " ",
											display_name: item.reviewer_name,
											email: item.reviewer_email || " ",
											description: item.body,
											customer_locale: customer_locale,
											rating: item.rating,
											product_id: productItem.id,
											product_title: productItem.title,
											product_url: productItem.handle,
											status: status,
											is_imported: true,
											imported_app: subActionType,
											verify_badge: true,
											createdAt: item.review_date,
											replyText: item.reply,
											replied_at: item.reply_date
										});
										const result = await productReviewModel.save();

										const insertedId = result._id;

										if (item.picture_urls) {
											await insertProductReviewDocuments(item.picture_urls, uploadsDir, insertedId);
										}
									} else {
									}

								}));
							} else if (subActionType == 'okendo') {
								await Promise.all(csvData.map(async (item, index) => {

									if (productDetails && productDetails[item.handle] && item.rating && item.body && item.dateCreated && item.name && item.email) {
										const productItem = productDetails[item.handle];
										const userNames = item.name.split(/[\s*]{3}|\s+/);

										const status = item.status == "approved" ? "publish" : "unpublish";
										const productReviewModel = new productReviews({
											shop_id: shopRecords._id,
											first_name: userNames[0] || " ",
											last_name: userNames[1] || " ",
											display_name: item.name,
											email: item.email || " ",
											description: item.body,
											customer_locale: customer_locale,
											rating: item.rating,
											product_id: productItem.id,
											product_title: productItem.title,
											product_url: productItem.handle,
											status: status,
											is_imported: true,
											imported_app: subActionType,
											verify_badge: item.isVerifiedBuyer == "TRUE" ? true : false,
											createdAt: item.dateCreated,
											replyText: item.reply,
											replied_at: item.replyDateCreated
										});
										const result = await productReviewModel.save();

										const insertedId = result._id;

										if (item.imageUrls) {
											await insertProductReviewDocuments(item.imageUrls, uploadsDir, insertedId);
										}

										if (item.videoUrls) {
											await insertProductReviewDocuments(item.videoUrls, uploadsDir, insertedId);
										}
									} else {
									}

								}));
							} else if (subActionType == 'junip') {
								await Promise.all(csvData.map(async (item, index) => {

									if (productDetails && productDetails[item.product_handle] && item.rating && item.body && item.created_at && item.first_name && item.email) {
										const productItem = productDetails[item.product_handle];

										const status = item.state == "approved" ? "publish" : "unpublish";
										const productReviewModel = new productReviews({
											shop_id: shopRecords._id,
											first_name: item.first_name,
											last_name: item.last_name || " ",
											display_name: `${item.first_name || ""} ${item.last_name || ""}`.trim(),
											email: item.email || " ",
											description: item.body,
											customer_locale: customer_locale,
											rating: item.rating,
											product_id: productItem.id,
											product_title: productItem.title,
											product_url: productItem.handle,
											status: status,
											is_imported: true,
											imported_app: subActionType,
											verify_badge: item.verified_buyer == "TRUE" ? true : false,
											createdAt: item.created_at
										});
										const result = await productReviewModel.save();

										const insertedId = result._id;

										if (item.photo_urls) {
											await insertProductReviewDocuments(item.photo_urls, uploadsDir, insertedId, subActionType, 'img');
										}

										if (item.video_urls) {
											await insertProductReviewDocuments(item.video_urls, uploadsDir, insertedId, subActionType, 'video');
										}
									} else {
									}

								}));
							} else if (subActionType == 'yotpo') {
								await Promise.all(csvData.map(async (item, index) => {
									if (isValidDateFormat(item['Review Creation Date']) == null) {
										return true;
									}
									if (productDetails && productDetails[item['Product Handle']] && item['Review Score'] && item['Review Content'] && item['Review Creation Date'] && item['Reviewer Display Name'] && item['Reviewer Email']) {
										const productItem = productDetails[item['Product Handle']];

										const status = item['Review Status'] == "Published" ? "publish" : "unpublish";

										const userNames = item['Reviewer Display Name'].split(/[\s*]{3}|\s+/);

										const productReviewModel = new productReviews({
											shop_id: shopRecords._id,
											first_name: userNames[0],
											last_name: userNames[1] || " ",
											display_name: item['Reviewer Display Name'],
											email: item['Reviewer Email'] || " ",
											description: item['Review Content'],
											customer_locale: customer_locale,
											rating: item['Review Score'],
											product_id: productItem.id,
											product_title: productItem.title,
											product_url: productItem.handle,
											status: status,
											is_imported: true,
											imported_app: subActionType,
											verify_badge: true,
											createdAt: isValidDateFormat(item['Review Creation Date']),
											replyText: item['Comment Content'],
											replied_at: item['Comment Date'] ? isValidDateFormat(item['Comment Date']) : null
										});
										const result = await productReviewModel.save();

										const insertedId = result._id;

										if (item['Published Image URLs']) {
											await insertProductReviewDocuments(item['Published Image URLs'], uploadsDir, insertedId, subActionType);
										}

										if (item['Published Video URLs']) {
											await insertProductReviewDocuments(item['Published Video URLs'], uploadsDir, insertedId, subActionType);
										}
									} else {
									}

								}));
							}
						};

						processCsvData().then(() => {
							console.log('CSV file uploaded successfully.');
						}).catch(err => {
							console.log('Error processing reviews:', err);
						});


					}
					return json({ "status": 200, "message": "CSV file uploaded successfully." });
				}

			} catch (error) {
				console.log(error);
				return json({ "status": 400, "message": "Operation failed" });
			}
		default:

			return json({ "message": "", "method": "POST" });

	}
}
function convertToCSV(data) {
	// Determine which keys to include in the CSV
	const headers = Object.keys(data[0]).filter(key => key !== '_id');

	const escapeCSVValue = (value) => {
		if (value == null) return ''; // Handle null or undefined
		const strValue = String(value);
		if (strValue.includes(',') || strValue.includes('\n') || strValue.includes('"')) {
			return `"${strValue.replace(/"/g, '""')}"`; // Escape double quotes
		}
		return strValue;
	};

	const rows = data.map(row =>
		headers.map(fieldName => escapeCSVValue(row[fieldName])).join(',')
	);

	return [headers.join(','), ...rows].join('\n');
}


async function insertProductReviewDocuments(photo_url, uploads_dir, review_id, subActionType = "", type = "") {
	try {
		let urls = "";
		if(subActionType == 'yotpo') {
			urls = photo_url.split(';');
		} else {
			urls = photo_url.split(',');
		}

		const files = await Promise.all(urls.map(url => uploadDocuments(url, uploads_dir, subActionType, type)));

		const validFiles = files.filter(file => file !== null);
		if (validFiles.length > 0) {
			for (let i = 0; i < files.length; i++) {
				const fileName = files[i];

				var docType = 'image';

				const fileExtension = fileName.split('.').pop().toLowerCase();
				if (settingsJson.validImageExtensions.includes(fileExtension)) {
					var docType = "image";
				} else if (settingsJson.validVideoExtensions.includes(fileExtension)) {
					var docType = "video";
				}
				const isCover = i === 0;
				const reviewDocumentModel = new reviewDocuments({
					review_id: new ObjectId(review_id),
					type: docType,
					url: fileName,
					is_approve: true,
					is_cover: isCover
				});

				await reviewDocumentModel.save();
			}
		}
	} catch (error) {
		console.log(`Failed to process insertProductReviewDocuments :`);
	}
}


async function uploadDocuments(photo_url, uploads_dir, subActionType = "", type = "") {

	try {
		let fileName = await generateRandomCode(10) + "-" + path.basename(photo_url);

		if (subActionType == 'junip') {
			if (type == 'img') {
				if (!fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg') && !fileName.endsWith('.png')) {
					fileName += '.jpg'; // Add .jpg extension if not present
				}
			} else if (type == 'video') {
				if (!fileName.endsWith('.mp4')) {
					fileName += '.mp4';
				}
			}
		}
		fileName = fileName.split('?')[0];

		const savePath = path.resolve(uploads_dir, fileName);
		
		const url = photo_url;
		const response = await axios({
			url,
			method: 'GET',
			responseType: 'stream',
		});
		const writer = fs.createWriteStream(savePath);
		response.data.pipe(writer);
		return fileName;

	} catch (error) {
		console.log(`Failed to process image :`);
		return null;
	}

}