import { mongoConnection } from './mongoConnection';
import { GraphQLClient } from "graphql-request";
import customQuestions from './../routes/models/customQuestions';
import emailReviewRequestSettings from './../routes/models/emailReviewRequestSettings';
import emailReviewReplySettings from './../routes/models/emailReviewReplySettings';
import emailDiscountPhotoVideoReviewSettings from './../routes/models/emailDiscountPhotoVideoReviewSettings';
import reviewDiscountSettings from './../routes/models/reviewDiscountSettings';
import generalSettings from './../routes/models/generalSettings';
import marketingEmailSubscriptions from './../routes/models/marketingEmailSubscriptions';
import emailReviewRequestReminderSettings from './../routes/models/emailReviewRequestReminderSettings';
import emailDiscountPhotoVideoReviewReminderSettings from './../routes/models/emailDiscountPhotoVideoReviewReminderSettings';
import emailPhotovideoReminderSettings from './../routes/models/emailPhotovideoReminderSettings';
import emailResendReviewRequestSettings from './../routes/models/emailResendReviewRequestSettings';

import settingJson from './../utils/settings.json';
import { getCurrentDate, getCustomFormattedEndDateTime } from './dateFormat';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import path from 'path';
import fs from "fs";
import { v4 as uuidv4 } from 'uuid'; // Import UUID package
import crypto from 'crypto';

export async function findOneRecord(collection = "", params = {}) {
	try {


		if (collection && params) {
			const db = await mongoConnection();

			const response = await db.collection(collection).findOne(params);
			return response;
		}

	} catch (error) {
		console.error('Error fetching findOneRecord record:', error);
	}
}

export async function getShopDetailsByShop(shop) {
	try {
		return await findOneRecord("shop_details", { "shop": shop });
	} catch (error) {
		console.error('Error fetching shop record by shop:', error);
	}
}


export async function getCustomQuestions(params = {}) {
	try {
		return await customQuestions.find(params);
	} catch (error) {
		console.error('Error fetching custom question record :', error);
	}
}



export async function getShopifyProducts(shop, productIds = [], imageSize = 60) {
	try {
		const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shop });
		const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
			headers: {
				'X-Shopify-Access-Token': shopSessionRecords.accessToken,
			},
		});

		const query = `{
			nodes(ids: [${productIds}]) {
				... on Product {
					id
					title
					handle
					description
					images(first: 1) {
						edges {
							node {
								id
								transformedSrc(maxWidth: ${imageSize}, maxHeight: ${imageSize})
							}
						}
					}
				}
			}
		} `;

		var shopifyProducts = await client.request(query);

		var mapProductDetails = [];
		if (shopifyProducts.nodes.length > 0) {
			shopifyProducts = shopifyProducts.nodes;
			shopifyProducts.forEach(node => {
				if (node) {
					mapProductDetails.push(node);
				}
			});
		}

		return mapProductDetails;


	} catch (error) {
		console.error('Error fetching product record :', error);
	}
}


export async function getShopifyLatestProducts(shop) {
	try {
		const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shop });

		const apiUrl = `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/products.json?limit=1&order=created_at desc`;
		const response = await fetch(apiUrl, {
			method: 'GET',
			headers: {
				'X-Shopify-Access-Token': shopSessionRecords.accessToken,
			}
		});
		if (response.ok) {
			return await response.json();
		}
		return [];

	} catch (error) {
		console.error('Error fetching product record :', error);
	}
}
export async function createShopifyDiscountCode(shopRecords, hasPhoto = false, hasVideo = false, isReviewRequest = false) {
	try {

		let response = {};
		const reviewDiscountSettingsModel = await reviewDiscountSettings.findOne({
			shop_id: shopRecords._id
		});
		if (reviewDiscountSettingsModel.isDiscountEnabled && (reviewDiscountSettingsModel.reviewType == 'both' || isReviewRequest)) {

			let valueType = "";
			let discountValue = 0;
			let generatedDiscountCode = "";
			let discountPrefix = "";
			let discountTitle = "";
			let expireOnDate = "";
			const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shopRecords.shop });

			if (reviewDiscountSettingsModel.isSameDiscount) {

				valueType = reviewDiscountSettingsModel.sameDiscountType;
				discountValue = reviewDiscountSettingsModel.sameDiscountValue;
			} else {
				if (hasVideo) {
					valueType = reviewDiscountSettingsModel.differentDiscountVideoType;
					discountValue = reviewDiscountSettingsModel.differentDiscountVideoValue;
				} else if (hasPhoto) {
					valueType = reviewDiscountSettingsModel.differentDiscountPhotoType;
					discountValue = reviewDiscountSettingsModel.differentDiscountPhotoValue;
				}
			}
			if (reviewDiscountSettingsModel.isAutoGeneratedDiscount) {
				generatedDiscountCode = await generateRandomCode(settingJson.shopifyDiscount.reviewDiscountCodeDigit);
				discountPrefix = settingJson.shopifyDiscount.reviewDiscountPrefix;
				discountTitle = `${settingJson.shopifyDiscount.reviewDiscountTitle}${discountPrefix}${generatedDiscountCode}`;
				let priceRuleParams = {
					"price_rule": {
						"title": discountTitle,
						"value_type": valueType,
						"value": `-${discountValue}`,
						"customer_selection": "all",
						"allocation_method": "across",
						"starts_at": getCurrentDate(shopRecords.timezone),
						"once_per_customer": true,
						"target_type": "line_item",
						"target_selection": "all"
					}
				};

				if (reviewDiscountSettingsModel.expiredAfter != "never") {
					expireOnDate = getCustomFormattedEndDateTime(reviewDiscountSettingsModel.expiredAfter, shopRecords.timezone);
					priceRuleParams.price_rule.ends_at = expireOnDate;
				}
				const priceRuleApiUrl = `https://${shopRecords.shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/price_rules.json`;

				const priceRuleResponse = await fetch(priceRuleApiUrl, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-Shopify-Access-Token': shopSessionRecords.accessToken,
					},
					body: JSON.stringify(priceRuleParams),
				});

				if (priceRuleResponse.ok) {
					const priceRuleObj = await priceRuleResponse.json();
					const priceRuleId = priceRuleObj.price_rule.id;

					const discountApiUrl = `https://${shopRecords.shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/price_rules/${priceRuleId}/discount_codes.json`;
					const discountParams = {
						"discount_code": {
							"code": `${discountPrefix}${generatedDiscountCode}`
						}
					};

					const discountResponse = await fetch(discountApiUrl, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-Shopify-Access-Token': shopSessionRecords.accessToken,
						},
						body: JSON.stringify(discountParams),
					});

					if (discountResponse.ok) {
						const lookUpResponse = await discountResponse.json();
						response.id = lookUpResponse.discount_code.id;
						response.price_rule_id = lookUpResponse.discount_code.price_rule_id;
						response.code = lookUpResponse.discount_code.code;
					} else {
						const errorResponse = await discountResponse.json();
						console.error('Error creating discount code:', errorResponse);
						return {};
					}

				} else {
					const errorResponse = await priceRuleResponse.json();
					console.error('Error creating price rule:', errorResponse);
					return {};
				}
			} else if (reviewDiscountSettingsModel.discountCode != "") {

				const discountLookupApiUrl = `https://${shopRecords.shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/discount_codes/lookup.json?code=${reviewDiscountSettingsModel.discountCode}`;
				const discountLookupResponse = await fetch(discountLookupApiUrl, {
					method: 'GET',
					headers: {
						'X-Shopify-Access-Token': shopSessionRecords.accessToken,
					}
				});
				// return await discountLookupResponse.json();
				if (discountLookupResponse.ok) {
					const lookUpResponse = await discountLookupResponse.json();
					response.id = lookUpResponse.discount_code.id;
					response.price_rule_id = lookUpResponse.discount_code.price_rule_id;

				} else {
					const errorResponse = await discountLookupResponse.json();
				}
				response.is_custom_discount_code = true;
				response.code = reviewDiscountSettingsModel.discountCode;
			}
			if (response) {
				response.discount_value = discountValue;
				response.value_type = valueType;
				response.expire_on_date = expireOnDate;
			}

			return response;

		}
		return {};

	} catch (error) {
		console.error('Error creating discount code:', error);
		return { error: 'Error creating discount code' };
	}
}

export async function generateRandomCode(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};


export async function fetchAllProductsOld(storeName, accessToken) {
	const apiUrl = `https://${storeName}.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`;
	const products = [];
	let hasNextPage = true;
	let cursor = null;

	while (hasNextPage) {
		const query = `
		query ($cursor: String) {
		  products(first: 250, after: $cursor) {
			edges {
			  node {
				id
				title
				images(first: 10) {
				  edges {
					node {
					  id
					  originalSrc
					  transformedSrc(maxWidth: 60, maxHeight: 60)
					}
				  }
				}
			  }
			  cursor
			}
			pageInfo {
			  hasNextPage
			}
		  }
		}
	  `;

		const variables = { cursor };
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Access-Token': accessToken,
			},
			body: JSON.stringify({ query, variables }),
		});

		const data = await response.json();
		if (data.errors) {
			console.error('GraphQL errors:', data.errors);
			break;
		}

		const productEdges = data.data.products.edges;
		productEdges.forEach(productEdge => {

			products.push({
				id: productEdge.node.id.split('/').pop(),
				title: productEdge.node.title,
				images: productEdge.node.images.edges.map(imageEdge => ({
					id: imageEdge.node.id,
					originalSrc: imageEdge.node.originalSrc,
					transformedSrc: imageEdge.node.transformedSrc,
				})),
			});
		});

		hasNextPage = data.data.products.pageInfo.hasNextPage;
		if (hasNextPage) {
			cursor = productEdges[productEdges.length - 1].cursor;
		}
	}

	return products;
}



function replacePlaceholders(text, replaceVars) {
	text = text.replace(/\[name\]/g, replaceVars.name || '');
	text = text.replace(/\[order_number\]/g, replaceVars.order_number || '');
	text = text.replace(/\[last_name\]/g, replaceVars.last_name || '');
	text = text.replace(/\[product\]/g, replaceVars.product || '');
	text = text.replace(/\[reply_content\]/g, replaceVars.reply_content || '');
	text = text.replace(/\[store\]/g, replaceVars.store || '');
	text = text.replace(/\[discount\]/g, replaceVars.discount || '');

	return text;
}

export async function getLanguageWiseContents(type, replaceVars, shop_id, locale = 'en') {
	var emailContents = {};
	const transalationFile = `${settingJson.host_url}/locales/${locale}/translation.json`;
	const responseFile = await fetch(transalationFile);
	const transalationContent = await responseFile.json();
	let settingJsonData = {};
	if (type == 'review_request') {
		const emailReviewRequestSettingsModel = await emailReviewRequestSettings.findOne({ shop_id: shop_id });
		if (emailReviewRequestSettingsModel && emailReviewRequestSettingsModel[locale]) {
			settingJsonData = emailReviewRequestSettingsModel[locale];
		}
		const transalationData = transalationContent.reviewRequestEmail;
		emailContents = await replaceEmailReviewRequest(replaceVars, settingJsonData, transalationData);

	} else if (type == 'review_reply') {
		const emailReviewReplySettingsModel = await emailReviewReplySettings.findOne({ shop_id: shop_id });
		if (emailReviewReplySettingsModel && emailReviewReplySettingsModel[locale]) {
			settingJsonData = emailReviewReplySettingsModel[locale];
		}
		const transalationData = transalationContent.reviewReplyEmail;
		emailContents = await replaceEmailReviewReply(replaceVars, settingJsonData, transalationData);

	} else if (type == 'discount_photo_video_review') {
		const emailDiscountPhotoVideoReviewSettingsModel = await emailDiscountPhotoVideoReviewSettings.findOne({ shop_id: shop_id });
		if (emailDiscountPhotoVideoReviewSettingsModel && emailDiscountPhotoVideoReviewSettingsModel[locale]) {
			settingJsonData = emailDiscountPhotoVideoReviewSettingsModel[locale];
		}
		const transalationData = transalationContent.dicountPhotoVideoReviewEmail;
		emailContents = await replaceEmailDiscountPhotoVideoReview(replaceVars, settingJsonData, transalationData);

	} else if (type == 'review_request_reminder') {
		const emailReviewRequestReminderSettingsModel = await emailReviewRequestReminderSettings.findOne({ shop_id: shop_id });
		if (emailReviewRequestReminderSettingsModel && emailReviewRequestReminderSettingsModel[locale]) {
			settingJsonData = emailReviewRequestReminderSettingsModel[locale];
		}
		const transalationData = transalationContent.reviewRequestReminderEmail;
		emailContents = await replaceEmailReviewRequest(replaceVars, settingJsonData, transalationData);

	} else if (type == 'discount_photo_video_review_reminder') {
		const emailDiscountPhotoVideoReviewReminderSettingsModel = await emailDiscountPhotoVideoReviewReminderSettings.findOne({ shop_id: shop_id });
		if (emailDiscountPhotoVideoReviewReminderSettingsModel && emailDiscountPhotoVideoReviewReminderSettingsModel[locale]) {
			settingJsonData = emailDiscountPhotoVideoReviewReminderSettingsModel[locale];
		}
		const transalationData = transalationContent.discountPhotoVideoReviewReminderEmail;
		emailContents = await replaceEmailDiscountPhotoVideoReview(replaceVars, settingJsonData, transalationData);

	} else if (type == 'photo_video_review_reminder') {
		const emailPhotovideoReminderSettingsModel = await emailPhotovideoReminderSettings.findOne({ shop_id: shop_id });
		if (emailPhotovideoReminderSettingsModel && emailPhotovideoReminderSettingsModel[locale]) {
			settingJsonData = emailPhotovideoReminderSettingsModel[locale];
		}
		const transalationData = transalationContent.photoVideoReminderEmail;
		emailContents = await replaceEmailDiscountPhotoVideoReviewReminder(replaceVars, settingJsonData, transalationData);

	} else if (type == 'resend_review_request') {
		const emailResendReviewRequestSettingsModel = await emailResendReviewRequestSettings.findOne({ shop_id: shop_id });
		if (emailResendReviewRequestSettingsModel && emailResendReviewRequestSettingsModel[locale]) {
			settingJsonData = emailResendReviewRequestSettingsModel[locale];
		}
		const transalationData = transalationContent.resendReviewRequestReminderEmail;
		emailContents = await replaceEmailReviewRequest(replaceVars, settingJsonData, transalationData);

	}

	
	emailContents.unsubscribeText = transalationContent.unsubscriptionText
	return emailContents;

}

export async function replaceEmailReviewRequest(replaceVars, settingJsonData, transalationData) {

	var subject = replacePlaceholders(settingJsonData.subject && settingJsonData.subject !== ""
		? settingJsonData.subject
		: transalationData.subject, replaceVars);

	var body = replacePlaceholders(settingJsonData.body && settingJsonData.body !== ""
		? settingJsonData.body
		: transalationData.body, replaceVars);

	var buttonText = settingJsonData.buttonText && settingJsonData.buttonText !== ""
		? settingJsonData.buttonText
		: transalationData.buttonText;
	var banner = settingJsonData.banner || "";

	return { subject, body, buttonText, banner };
}


export async function replaceEmailReviewReply(replaceVars, settingJsonData, transalationData) {

	var subject = replacePlaceholders(settingJsonData.subject && settingJsonData.subject !== ""
		? settingJsonData.subject
		: transalationData.subject, replaceVars);

	var body = replacePlaceholders(settingJsonData.body && settingJsonData.body !== ""
		? settingJsonData.body
		: transalationData.body, replaceVars);
	var banner = settingJsonData.banner || "";
	return { subject, body, banner };
}

export async function replaceEmailDiscountPhotoVideoReview(replaceVars, settingJsonData, transalationData) {

	var subject = replacePlaceholders(settingJsonData.subject && settingJsonData.subject !== ""
		? settingJsonData.subject
		: transalationData.subject, replaceVars);

	var body = replacePlaceholders(settingJsonData.body && settingJsonData.body !== ""
		? settingJsonData.body
		: transalationData.body, replaceVars);

	var buttonText = settingJsonData.buttonText && settingJsonData.buttonText !== ""
		? settingJsonData.buttonText
		: transalationData.buttonText;
	var banner = settingJsonData.banner || "";

	return { subject, body, buttonText, banner };
}

export async function replaceEmailDiscountPhotoVideoReviewReminder(replaceVars, settingJsonData, transalationData) {

	var subject = replacePlaceholders(settingJsonData.subject && settingJsonData.subject !== ""
		? settingJsonData.subject
		: transalationData.subject, replaceVars);

	var body = replacePlaceholders(settingJsonData.body && settingJsonData.body !== ""
		? settingJsonData.body
		: transalationData.body, replaceVars);


	var discountText = replacePlaceholders(settingJsonData.discountText && settingJsonData.discountText !== ""
		? settingJsonData.discountText
		: transalationData.discountText, replaceVars);

	var buttonText = settingJsonData.buttonText && settingJsonData.buttonText !== ""
		? settingJsonData.buttonText
		: transalationData.buttonText;
	var banner = settingJsonData.banner || "";

	return { subject, body, discountText, buttonText, banner };
}


export async function getDiscounts(shopRecords, isReviewRequest = false) {
	try {
		const reviewDiscountSettingsModel = await reviewDiscountSettings.findOne({
			shop_id: shopRecords._id
		});
		let response = {};
		if (reviewDiscountSettingsModel.isDiscountEnabled && (reviewDiscountSettingsModel.reviewType == 'both' || isReviewRequest)) {
			if (reviewDiscountSettingsModel.isSameDiscount) {

				response.discount = reviewDiscountSettingsModel.sameDiscountType == 'percentage' ? `${reviewDiscountSettingsModel.sameDiscountValue}%` : `${shopRecords.currency_symbol}${reviewDiscountSettingsModel.sameDiscountValue}`;

			} else {
				response.photoDiscount = reviewDiscountSettingsModel.differentDiscountPhotoType == 'percentage' ? `${reviewDiscountSettingsModel.differentDiscountPhotoValue}%` : `${shopRecords.currency_symbol}${reviewDiscountSettingsModel.differentDiscountPhotoValue}`;
				response.videoDiscount = reviewDiscountSettingsModel.differentDiscountVideoType == 'percentage' ? `${reviewDiscountSettingsModel.differentDiscountVideoValue}%` : `${shopRecords.currency_symbol}${reviewDiscountSettingsModel.differentDiscountVideoValue}`;

			}
			response.isSameDiscount = reviewDiscountSettingsModel.isSameDiscount;
			return response;
		}
		return response;

	} catch (error) {
		console.log(error);

	}

}


export async function fetchAllProductsByHandles(csvData, handleName, shop, accessToken) {
	const productHandles = csvData.map(item => item[handleName]);

	const batchSize = 250;
	const handleBatches = [];

	for (let i = 0; i < productHandles.length; i += batchSize) {
		handleBatches.push(productHandles.slice(i, i + batchSize));
	}

	const productsDetails = [];
	for (const batch of handleBatches) {

		const data = await fetchProductsByBatch(batch, shop, accessToken);
		productsDetails.push(...data);
	}

	const productsByHandle = productsDetails.reduce((acc, item) => {
		const { handle, id, ...rest } = item.node;
		const cleanId = id.replace('gid://shopify/Product/', ''); // Remove the prefix from id
		acc[handle] = { id: cleanId, handle, ...rest };
		return acc;
	}, {});

	return productsByHandle;

}

async function fetchProductsByBatch(batch, shop, accessToken) {

	try {

		const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
			headers: {
				'X-Shopify-Access-Token': accessToken,
			},
		});

		const query = `
		query {
			products(first: 250, query: "${batch.map(handle => `handle:${handle}`).join(' OR ')}") {
			edges {
				node {
				id
				title
				handle
				}
			}
			}
		}
		`;

		var shopifyProducts = await client.request(query);

		var mapProductDetails = [];
		if (shopifyProducts.products.edges.length > 0) {
			shopifyProducts = shopifyProducts.products.edges;
			shopifyProducts.forEach(node => {
				if (node) {
					mapProductDetails.push(node);
				}
			});
		}

		return mapProductDetails;

	} catch (error) {
		console.error('Error fetching product details:', error);
		return null;
	}
}

/* createMetafields it use to create meta fields in shopify store*/

export async function createMetafields(shop, metafields, widgetType = "") {

	try {

		const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shop });
		const metafieldApiUrl = `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/metafields.json`;

		const jsonMetafieldsString = JSON.stringify(metafields);
		let metafieldData = {};
		if (widgetType == "floatingWidgetCustomize") {
			metafieldData = {
				"metafield": {
					"namespace": "extension_floating_modal",
					"key": "modal_review_data",
					"value": jsonMetafieldsString,
					"type": "json"
				}
			}

		} else if (widgetType == "sidebarReviewCustomize") {
			metafieldData = {
				"metafield": {
					"namespace": "extension_status",
					"key": "sidebar_widget_data",
					"value": jsonMetafieldsString,
					"type": "json"
				}
			}

		} else if (widgetType == "popupModalReviewCustomize") {
			metafieldData = {
				"metafield": {
					"namespace": "extension_popup_modal",
					"key": "popup_modal_data",
					"value": jsonMetafieldsString,
					"type": "json"
				}
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

	} catch (error) {
		console.error('Error fetching product details:', error);
		return null;
	}
}

/* return sub string based on specified length */

export function displayNoOfCharacters(length = 50, description = "") {
	if (description.length <= length) {
		return description;
	}

	return `${description.substring(0, length)}...`;

}

export async function generateVideoThumbnail(videoPath, outputDir, thumbnailName) {
	try {

		return new Promise((resolve, reject) => {
			// First, get the video dimensions using ffprobe
			// ffmpeg.setFfprobePath(`C:\\ffmpeg\\bin\\ffprobe.exe`);
			// ffmpeg.setFfmpegPath(`C:\\ffmpeg\\bin\\ffmpeg.exe`);

			ffmpeg.ffprobe(videoPath, (err, metadata) => {
				if (err) {
					return reject(err);
				}

				// Extract width and height from the video metadata
				const { width, height } = metadata.streams.find(stream => stream.width && stream.height);

				if (!width || !height) {
					return reject(new Error('Could not get video dimensions.'));
				}

				// Generate a dynamic name for the temporary thumbnail (UUID)
				const tempThumbnailName = `temp-thumbnail-${uuidv4()}.png`;
				const tempThumbnailPath = path.join(outputDir, tempThumbnailName);
				const finalThumbnailPath = path.join(outputDir, thumbnailName);

				// Step 1: Generate the thumbnail with the same size as the original video
				ffmpeg(videoPath)
					.on('end', async () => {

						// Step 2: Compress the generated thumbnail using sharp
						try {
							await sharp(tempThumbnailPath)
								.jpeg({ quality: 100 }) // Adjust quality here (range from 0-100)
								.toFile(finalThumbnailPath); // Save the compressed image with the final name


							// Step 3: Delete the temporary resized thumbnail
							fs.unlink(tempThumbnailPath, (err) => {
								if (err) {
									console.error('Error deleting temporary thumbnail:', err);
								}
							});

							resolve(finalThumbnailPath);
						} catch (compressionErr) {
							console.error('Error compressing thumbnail:', compressionErr);
							reject(compressionErr);
						}
					})
					.on('error', (err) => {
						console.error('Error generating thumbnail:', err);
						reject(err);
					})
					.screenshots({
						timestamps: ['00:00:00'], // Take thumbnail at 2 seconds
						count: 1,
						folder: outputDir,
						filename: tempThumbnailName, // Use dynamic name for the initial thumbnail
						size: `${width}x${height}`, // Use the original video dimensions
					});
			});
		});
	} catch (error) {
		console.error('Error generating video thumbnail:', error);
	}
}



export async function resizeImages(imagePath, outputDir, thumbnailName) {
	try {
		// Ensure output directory exists
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		return new Promise((resolve, reject) => {
			const outputPath = path.join(outputDir, thumbnailName);

			sharp(imagePath)
				.toFormat('jpeg') // Convert to JPEG (optional)
				.jpeg({ quality: 10 }) // Compress image (adjust quality)
				.toFile(outputPath, (err, info) => {
					if (err) {
						console.error('Error generating image thumbnail:', err);
						return reject(err);
					}

					resolve(outputPath);

				});
		});
	} catch (error) {
		console.error('Error generating image thumbnail:', error);
	}
}

/* fetch all themes*/
export async function getAllThemes(shop, activeTheme = false) {

	try {
		const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shop });

		const response = await fetch(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/themes.json`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Access-Token': shopSessionRecords.accessToken
			}
		});

		if (!response.ok) {
			throw new Error(`Error fetching themes: ${response.statusText}`);
		}
		const data = await response.json();

		if (activeTheme) {
			return data.themes.find(theme => theme.role === 'main');
		}
		return data.themes;

	} catch (error) {
		console.error('Error fetching themes:', error.message);
	}
}


/* activate App embed app */
export async function checkAppEmbedAppStatus(shop, themeId) {
	try {
		const reviewExtensionId = process.env.SHOPIFY_ALL_REVIEW_EXTENSION_ID;

		const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shop });

		const url = `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/themes/${themeId}/assets.json`;
		const params = new URLSearchParams({
			'asset[key]': 'config/settings_data.json',
		});
		const response = await fetch(`${url}?${params.toString()}`, {
			method: 'GET',
			headers: {
				'X-Shopify-Access-Token': shopSessionRecords.accessToken,
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		let activeAppEmbeds = false;
		const contentFile = JSON.parse(data.asset.value);
		if (contentFile && contentFile?.current?.blocks) {
			const appEmbeds = contentFile?.current?.blocks;
			for (const key in appEmbeds) {
				if (Object.prototype.hasOwnProperty.call(appEmbeds, key)) {
					const app = appEmbeds[key];
					if (app.type.includes(reviewExtensionId) && app.disabled == false) {
						activeAppEmbeds = true;
						break;
					}
				}
			}
		}
		return activeAppEmbeds;
	} catch (error) {
		console.error('Error:', error);
	}
}

// generate unsubscription link
export function generateUnsubscriptionLink(paramData) {
	const secretKey = process.env.SECRET_KEY;

	// Encrypt user ID and shop ID or any other required data
	const encryptedData = encryptData(paramData, secretKey);
	const unsubscribeLink = `${settingJson.host_url}/unsubscribe?data=${encodeURIComponent(encryptedData)}`;

	return unsubscribeLink;
}

// Encryption function
export function encryptData(data, secretKey) {
	const iv = crypto.randomBytes(16); // Initialization vector
	const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
	let encrypted = cipher.update(JSON.stringify(data), 'utf-8', 'hex');
	encrypted += cipher.final('hex');
	return iv.toString('hex') + ':' + encrypted;
}

// Decryption function
export function decryptData(encryptedData, secretKey) {
	const [iv, encrypted] = encryptedData.split(':');
	const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv, 'hex'));
	let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return JSON.parse(decrypted.toString());
}


// check email to send user or not 
export async function checkEmailToSendUser(email = "", shopRecords) {
	const generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id });
	let sendEmailStatus = false;
	if (generalSettingsModel.send_email_type == "everyone") {
		sendEmailStatus = true;
	}
	const marketingEmailSubscriptionsModel = await marketingEmailSubscriptions.findOne({ shop_id: shopRecords._id, email: email });

}
