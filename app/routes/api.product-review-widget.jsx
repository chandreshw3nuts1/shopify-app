import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import { findOneRecord, getShopifyProducts, getLanguageWiseContents, createShopifyDiscountCode, generateRandomCode, generateVideoThumbnail, resizeImages, generateUnsubscriptionLink } from "./../utils/common";
import EmailTemplate from './components/email/EmailTemplate';
import ReactDOMServer from 'react-dom/server';
import { ObjectId } from 'mongodb';
import productReviews from "./models/productReviews";
import reviewDocuments from "./models/reviewDocuments";
import productReviewQuestions from "./models/productReviewQuestions";
import manualRequestProducts from './models/manualRequestProducts';
import generalAppearances from './models/generalAppearances';
import manualReviewRequests from './models/manualReviewRequests';
import generalSettings from './models/generalSettings';

import discountCodes from './models/discountCodes';
import { formatDate } from "./../utils/dateFormat";


import { getUploadDocument } from "./../utils/documentPath";
import DiscountPhotoVideoReviewEmail from './components/email/DiscountPhotoVideoReviewEmail';
import ThankYouPage from './components/widget-components/thankyou-page';
import settingsJson from './../utils/settings.json';
import reviewFormSettings from "./models/reviewFormSettings";

import fs from "fs";
import path from "path";

export async function loader() {
	return json({
		name: 'response'
	});
}


export async function action({ request }) {

	const method = request.method;
	const formData = await request.formData();
	const validImageExtensions = settingsJson.validImageExtensions;
	const validVideoExtensions = settingsJson.validVideoExtensions;

	const shop = formData.get('shop_domain');
	const actionType = formData.get('actionType');

	switch (method) {
		case "POST":
			try {
				const shopRecords = await findOneRecord("shop_details", { "shop": shop });
				const generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id });

				if (actionType == "uploadDocuments") {
					const files = formData.getAll("image_and_videos[]");
					const uploadsDir = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/`);
					fs.mkdirSync(uploadsDir, { recursive: true });
					const imageAndVideoFiles = [];
					for (let i = 0; i < files.length; i++) {
						if (files[i].name != "" && files[i].name != null) {
							const randomName = await generateRandomCode(10);
							const fileSize = files[i].size;
							const originalFileName = files[i].name;
							const fileExtension = originalFileName.split('.').pop().toLowerCase();
							const fileName = randomName + "." + fileExtension;

							if ((generalSettingsModel.is_enabled_video_review && (validImageExtensions.includes(fileExtension) || validVideoExtensions.includes(fileExtension))) || (generalSettingsModel.is_enabled_video_review == false && validImageExtensions.includes(fileExtension))) {
								const filePath = path.join(uploadsDir, fileName);
								const buffer = Buffer.from(await files[i].arrayBuffer());
								fs.writeFileSync(filePath, buffer);


								/* resize images */
								let fileNameImgVd = fileName;

								if (validImageExtensions.includes(fileExtension)) {
									const fileSizeMB = fileSize / (1024 * 1024); // Convert bytes to MB

									if (fileSizeMB >= 1) {
										fileNameImgVd = `resize-${fileName}`;

										await resizeImages(filePath, uploadsDir, fileNameImgVd);
									}
								} else {
									fileNameImgVd = fileName;
								}


								imageAndVideoFiles.push(fileNameImgVd);
							}
						}
					}

					// fs.unlinkSync(filePath);
					return json({ files: imageAndVideoFiles, content: generalSettingsModel.is_enabled_video_review || false });

				} else if (actionType == "uploadVideoRecording") {
					const video_record = formData.get("video_record");

					const uploadsDir = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/`);
					fs.mkdirSync(uploadsDir, { recursive: true });
					const imageAndVideoFiles = [];

					const fileName = await generateRandomCode(10) + "-" + video_record.name;

					const filePath = path.join(uploadsDir, fileName);

					const buffer = Buffer.from(await video_record.arrayBuffer());
					fs.writeFileSync(filePath, buffer);
					imageAndVideoFiles.push(fileName);
					return imageAndVideoFiles;

				} else if (actionType == "deleteDocuments") {
					const deleteFileName = formData.get("deleteFileName");
					const filePath = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/`) + deleteFileName;
					if (fs.existsSync(filePath)) {
						try {
							fs.unlinkSync(filePath);
							console.log('File deleted successfully');
						} catch (error) {
							console.error('Error deleting file:', error);
						}
					} else {
						console.log('File does not exist:', filePath);
					}
					return json({ success: true });

				} else if (actionType == "addPhotoVideo") {

					if (shop == null || formData.get('product_id') == null) {
						return json({ success: false });
					}
					const productReviewsModel = await productReviews.findOne({ _id: formData.get('reviewId') });
					if (productReviewsModel) {
						const reviewId = formData.get('reviewId');

						const generalAppearancesData = await generalAppearances.findOne({ shop_id: shopRecords._id });
						const logo = getUploadDocument(generalAppearancesData.logo, shopRecords.shop_id, 'logo');

						var customer_locale = productReviewsModel.customer_locale;

						/* Fetch transation languge*/

						const language = settingsJson.languages.find(language => language.code === customer_locale);
						customer_locale = language ? language.code : generalSettingsModel.defaul_language;
						const apiUrl = `${settingsJson.host_url}/locales/${customer_locale}/translation.json`;
						const lang = await fetch(apiUrl, {
							method: 'GET'
						});
						const translations = await lang.json();
						const reviewFormSettingsModel = await reviewFormSettings.findOne({ shop_id: shopRecords._id });
						const languageWiseReviewFormSettings = (reviewFormSettingsModel && reviewFormSettingsModel[customer_locale]) ? reviewFormSettingsModel[customer_locale] : {};
						const otherProps = { translations };
						otherProps['reviewFormSettingsModel'] = reviewFormSettingsModel;
						otherProps['languageWiseReviewFormSettings'] = languageWiseReviewFormSettings;

						/* Fetch transation languge End*/

						// upload images/video

						const file_objects = formData.get("file_objects");
						let hasPhoto = false;
						let hasVideo = false;
						let discountText = "";
						let discountCode = "";
						if (file_objects != null && file_objects != "") {
							let files = file_objects.split(',');
							const uploadsDir = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/`);

							for (let i = 0; i < files.length; i++) {
								const fileName = files[i];
								var docType = 'image';

								let thumbNailName = "";

								const fileExtension = fileName.split('.').pop().toLowerCase();

								if (validImageExtensions.includes(fileExtension)) {
									var docType = "image";
									hasPhoto = true;
								} else if (validVideoExtensions.includes(fileExtension)) {
									var docType = "video";
									hasVideo = true;

									thumbNailName = await generateRandomCode(10) + ".png";
									const thumbnailUploadFilePath = path.join(uploadsDir, fileName);
									await generateVideoThumbnail(thumbnailUploadFilePath, uploadsDir, thumbNailName); // Generate thumbnail
								}
								const isCover = i === 0; // index 0 will be true, others will be false
								const reviewDocumentModel = new reviewDocuments({
									review_id: new ObjectId(reviewId),
									type: docType,
									url: fileName,
									is_approve: true,
									is_cover: isCover,
									thumbnail_name: thumbNailName
								});

								await reviewDocumentModel.save();
							}

							/* Create discount code and send email to reviewer when new photo/video reivew receive*/

							const discountCodeResponse = await createShopifyDiscountCode(shopRecords, hasPhoto, hasVideo, productReviewsModel.is_review_request);
							if (Object.keys(discountCodeResponse).length > 0) {
								discountText = discountCodeResponse.value_type == 'percentage' ? `${discountCodeResponse.discount_value}%` : `${shopRecords.currency_symbol}${discountCodeResponse.discount_value}`;
								const replaceVars = {
									"discount": discountText,
									"store": shopRecords.name,
									"name": productReviewsModel.first_name,
									"last_name": productReviewsModel.last_name,
								}
								discountCode = discountCodeResponse.code;
								const emailContentsDiscount = await getLanguageWiseContents("discount_photo_video_review", replaceVars, shopRecords._id, customer_locale);
								emailContentsDiscount.banner = getUploadDocument(emailContentsDiscount.banner, shopRecords.shop_id, 'banners');
								emailContentsDiscount.logo = logo;
								emailContentsDiscount.discountCode = discountCode;
								emailContentsDiscount.expire_on_date = discountCodeResponse.expire_on_date != "" ? formatDate(discountCodeResponse.expire_on_date, shopRecords.timezone, "MM-DD-YYYY") : "";
								var footerContent = "";
								if (generalSettingsModel.email_footer_enabled) {
									footerContent = generalSettingsModel[customer_locale] ? generalSettingsModel[customer_locale].footerText : "";
								}
								emailContentsDiscount.footerContent = footerContent;
								emailContentsDiscount.email_footer_enabled = generalSettingsModel.email_footer_enabled;


								const unsubscribeData = {
									"shop_id": shopRecords.shop_id,
									"email": productReviewsModel.email,
								}
								emailContentsDiscount.unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);

								var discountEmailHtmlContent = ReactDOMServer.renderToStaticMarkup(
									<DiscountPhotoVideoReviewEmail emailContents={emailContentsDiscount} generalAppearancesObj={generalAppearancesData} shopRecords={shopRecords} />
								);
								const emailResponse = await sendEmail({
									to: productReviewsModel.email,
									subject: emailContentsDiscount.subject,
									html: discountEmailHtmlContent,
								});

								if (discountCodeResponse?.id) {
									// update product review 
									await productReviews.updateOne(
										{ _id: reviewId },
										{
											$set: { discount_code_id: discountCodeResponse.id, discount_price_rule_id: discountCodeResponse.price_rule_id }
										}
									);

									await discountCodes.updateOne(
										{ shop_id: shopRecords._id, email: productReviewsModel.email, code: discountCodeResponse.code },
										{
											$setOnInsert: {
												shop_id: shopRecords._id,
												email: productReviewsModel.email,
												review_id: new ObjectId(reviewId),
												code: discountCodeResponse.code,
												value_type: discountCodeResponse.value_type,
												discount_value: discountCodeResponse.discount_value,
												expire_on_date: discountCodeResponse.expire_on_date,
											}
										},
										{ upsert: true }
									);

								}
							}

							/* send email to reviewer when new photo/video reivew receive End*/

						}

						const dynamicComponent = <ThankYouPage shopRecords={shopRecords} discountText={discountText} discountCode={discountCode} otherProps={otherProps} />;
						const htmlContent = ReactDOMServer.renderToString(dynamicComponent);

						return json({ success: true, content: htmlContent });
					}
				} else {
					if (shop == null || formData.get('product_id') == null) {
						return json({ success: false });
					}

					const settings = await findOneRecord('settings', {
						shop_id: shopRecords._id,
					});
					const productId = `"gid://shopify/Product/${formData.get('product_id')}"`;
					var productsDetails = await getShopifyProducts(shop, productId);
					if (!productsDetails[0]) {
						return json({ success: false });
					}
					const is_review_request = formData.get('requestId') ? true : false;
					const is_resubmit_review_request = formData.get('reviewId') ? true : false;

					const productNodes = productsDetails[0];

					const generalAppearancesData = await generalAppearances.findOne({ shop_id: shopRecords._id });
					const logo = getUploadDocument(generalAppearancesData.logo, shopRecords.shop_id, 'logo');

					const shopifyStoreUrl = `${process.env.SHOPIFY_ADMIN_STORE_URL}/${shopRecords.name}/apps/${process.env.SHOPIFY_APP_NAME}/app/manage-review`;

					var reviewStatus = 'publish';
					const reviewStarRating = parseInt(formData.get('rating'));
					if (settings.autoPublishReview == false) {
						var reviewStatus = 'pending';
					} else {

						if (settings.reviewPublishMode == 'auto') {
							var reviewStatus = 'publish';
						} else if (settings.reviewPublishMode == '5star' && reviewStarRating == 5) {
							var reviewStatus = 'publish';
						} else if (settings.reviewPublishMode == 'above4' && reviewStarRating >= 4) {
							var reviewStatus = 'publish';
						} else if (settings.reviewPublishMode == 'above3' && reviewStarRating >= 3) {
							var reviewStatus = 'publish';
						} else {
							var reviewStatus = 'pending';
						}
					}

					var customer_locale = formData.get('customer_locale') || generalSettingsModel.defaul_language;
					if (customer_locale == 'zh-TW') {
						customer_locale = 'cn2';
					} else if (customer_locale == 'zh-CN') {
						customer_locale = 'cn1';
					}

					/* Fetch transation languge*/

					const language = settingsJson.languages.find(language => language.code === customer_locale);
					customer_locale = language ? language.code : generalSettingsModel.defaul_language;

					const apiUrl = `${settingsJson.host_url}/locales/${customer_locale}/translation.json`;
					const lang = await fetch(apiUrl, {
						method: 'GET'
					});
					const translations = await lang.json();
					const reviewFormSettingsModel = await reviewFormSettings.findOne({ shop_id: shopRecords._id });
					const languageWiseReviewFormSettings = (reviewFormSettingsModel && reviewFormSettingsModel[customer_locale]) ? reviewFormSettingsModel[customer_locale] : {};
					const otherProps = { translations };
					otherProps['reviewFormSettingsModel'] = reviewFormSettingsModel;
					otherProps['languageWiseReviewFormSettings'] = languageWiseReviewFormSettings;
					/* Fetch transation languge End*/
					var orderExists = false;
					if (is_review_request) {
						/*Check if you have purchase product , if so then mark review as verified*/
						const pipeline = [
							{
								$match: { email: formData.get('email') }
							},
							{
								$project: { product_ids: 1 }
							},
							{
								$unwind: "$product_ids"
							},
							{
								$match: { product_ids: parseInt(formData.get('product_id')) }
							},
							{
								$group: {
									_id: null,
									exists: { $sum: 1 }
								}
							}
						];

						const manualReviewRequestsResult = await manualReviewRequests.aggregate(pipeline);

						orderExists = manualReviewRequestsResult.length > 0 && manualReviewRequestsResult[0].exists > 0;

						/*Check if you have purchase product , if so then mark review as verified End*/

					}
					const display_name = formData.get('first_name') + " " + formData.get('last_name').charAt(0);
					var result;
					if (is_resubmit_review_request) {

						result = await productReviews.findOneAndUpdate(
							{ _id: formData.get('reviewId') }, // Query to find the document
							{
								$set: {
									first_name: formData.get('first_name'),
									last_name: formData.get('last_name'),
									display_name: display_name,
									email: formData.get('email'),
									description: formData.get('description'),
									customer_locale: customer_locale,
									rating: reviewStarRating,
									is_resend_review_submitted : true,
								},
							},
							{ upsert: true } // upsert option and return updated document
						);

					} else {
						const productReviewModel = new productReviews({
							shop_id: shopRecords._id,
							first_name: formData.get('first_name'),
							last_name: formData.get('last_name'),
							display_name: display_name,
							email: formData.get('email'),
							description: formData.get('description'),
							customer_locale: customer_locale,
							rating: reviewStarRating,
							product_id: formData.get('product_id'),
							variant_title: formData.get('variant_title'),
							product_title: productNodes.title,
							product_url: productNodes.handle,
							status: reviewStatus,
							is_review_request: is_review_request,
							verify_badge: orderExists
						});
						result = await productReviewModel.save();
					}

					const insertedId = result._id;
					if (is_review_request) {
						await manualRequestProducts.updateOne(
							{ _id: formData.get('requestId') },
							{
								$set: { status: "received" }
							}
						);
					}

					// upload images/video

					const file_objects = formData.get("file_objects");
					let hasPhoto = false;
					let hasVideo = false;
					let discountText = "";
					let discountCode = "";
					if (file_objects != null && file_objects != "") {

						if (is_resubmit_review_request) {
							await reviewDocuments.deleteMany({ review_id: formData.get('reviewId') });
						}
						let files = file_objects.split(',');
						const uploadsDir = path.join(process.cwd(), `public/uploads/${shopRecords.shop_id}/`);

						for (let i = 0; i < files.length; i++) {
							const fileName = files[i];
							var docType = 'image';

							let thumbNailName = "";

							const fileExtension = fileName.split('.').pop().toLowerCase();

							if (validImageExtensions.includes(fileExtension)) {
								var docType = "image";
								hasPhoto = true;
							} else if (validVideoExtensions.includes(fileExtension)) {
								var docType = "video";
								hasVideo = true;

								thumbNailName = await generateRandomCode(10) + ".png";
								const thumbnailUploadFilePath = path.join(uploadsDir, fileName);
								await generateVideoThumbnail(thumbnailUploadFilePath, uploadsDir, thumbNailName); // Generate thumbnail
							}
							const isCover = i === 0; // index 0 will be true, others will be false
							const reviewDocumentModel = new reviewDocuments({
								review_id: new ObjectId(insertedId),
								type: docType,
								url: fileName,
								is_approve: true,
								is_cover: isCover,
								thumbnail_name: thumbNailName
							});

							await reviewDocumentModel.save();
						}
						/* Create discount code and send email to reviewer when new photo/video reivew receive*/

						const discountCodeResponse = await createShopifyDiscountCode(shopRecords, hasPhoto, hasVideo, is_review_request);

						if (Object.keys(discountCodeResponse).length > 0) {
							discountText = discountCodeResponse.value_type == 'percentage' ? `${discountCodeResponse.discount_value}%` : `${shopRecords.currency_symbol}${discountCodeResponse.discount_value}`;
							const replaceVars = {
								"discount": discountText,
								"store": shopRecords.name,
								"name": formData.get('first_name'),
								"last_name": formData.get('last_name'),
							}
							discountCode = discountCodeResponse.code;
							const emailContentsDiscount = await getLanguageWiseContents("discount_photo_video_review", replaceVars, shopRecords._id, customer_locale);
							emailContentsDiscount.banner = getUploadDocument(emailContentsDiscount.banner, shopRecords.shop_id, 'banners');
							emailContentsDiscount.logo = logo;
							emailContentsDiscount.discountCode = discountCode;
							emailContentsDiscount.expire_on_date = discountCodeResponse.expire_on_date != "" ? formatDate(discountCodeResponse.expire_on_date, shopRecords.timezone, "MM-DD-YYYY") : "";
							var footerContent = "";
							if (generalSettingsModel.email_footer_enabled) {
								footerContent = generalSettingsModel[customer_locale] ? generalSettingsModel[customer_locale].footerText : "";
							}
							emailContentsDiscount.footerContent = footerContent;
							emailContentsDiscount.email_footer_enabled = generalSettingsModel.email_footer_enabled;


							const unsubscribeData = {
								"shop_id": shopRecords.shop_id,
								"email": formData.get('email'),
							}
							emailContentsDiscount.unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);

							var discountEmailHtmlContent = ReactDOMServer.renderToStaticMarkup(
								<DiscountPhotoVideoReviewEmail emailContents={emailContentsDiscount} generalAppearancesObj={generalAppearancesData} shopRecords={shopRecords} />
							);
							const emailResponse = await sendEmail({
								to: formData.get('email'),
								subject: emailContentsDiscount.subject,
								html: discountEmailHtmlContent,
							});

							if (discountCodeResponse?.id) {
								// update product review 
								await productReviews.updateOne(
									{ _id: insertedId },
									{
										$set: { discount_code_id: discountCodeResponse.id, discount_price_rule_id: discountCodeResponse.price_rule_id }
									}
								);

								await discountCodes.updateOne(
									{ shop_id: shopRecords._id, email: formData.get('email'), code: discountCodeResponse.code },
									{
										$setOnInsert: {
											shop_id: shopRecords._id,
											email: formData.get('email'),
											review_id: new ObjectId(insertedId),
											code: discountCodeResponse.code,
											value_type: discountCodeResponse.value_type,
											discount_value: discountCodeResponse.discount_value,
											expire_on_date: discountCodeResponse.expire_on_date,
										}
									},
									{ upsert: true }
								);

							}
						}

						/* send email to reviewer when new photo/video reivew receive End*/
					}

					//insert questions and answers 
					var questions = [];
					for (let i = 0; ; i++) {
						const answer = formData.get(`questions[${i}][answer]`);
						const question_id = formData.get(`questions[${i}][question_id]`);
						const question_name = formData.get(`questions[${i}][question_name]`);
						if (!question_id) break; // Exit loop if question_id is not found
						questions.push({ question_id, answer, question_name });
					}
					if (questions.length > 0) {
						if (is_resubmit_review_request) {
							await productReviewQuestions.deleteMany({ review_id: formData.get('reviewId') });
						}
						questions.map(async (question, index) => {
							if (question.answer != null) {
								const productReviewQuestionModel = new productReviewQuestions({
									review_id: new ObjectId(insertedId),
									question_id: new ObjectId(question.question_id),
									answer: question.answer,
									question_name: question.question_name
								});
								await productReviewQuestionModel.save();
							}

						});
					}

					/*Create new customer in shopify Start */
					if (settings.addOnsiteReview == true) {
						const customerData = {
							customer: {
								first_name: formData.get('first_name'),
								last_name: formData.get('last_name'),
								email: formData.get('email')
							}
						};
						const url = `https://${shopRecords.shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/customers.json`;
						const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shopRecords.shop });

						const custResponse = await fetch(url, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'X-Shopify-Access-Token': shopSessionRecords.accessToken,
							},
							body: JSON.stringify(customerData),
						});
					}

					/*Create new customer in shopify End */

					/* send email to store owner when new reivew receive*/
					if (settings.reviewNotification) {
						const email = settings.reviewNotificationEmail || shopRecords.email;
						const emailContents = {
							questions: questions,
							first_name: formData.get('first_name'),
							last_name: formData.get('last_name'),
							display_name: display_name,
							email: formData.get('email'),
							description: formData.get('description'),
							rating: reviewStarRating,
							product_id: formData.get('product_id'),
							product_title: productNodes.title,
							product_url: productNodes.handle,
							shopifyStoreUrl: shopifyStoreUrl,
							logo: logo,
							shop_domain: shopRecords.shop,
							status: reviewStatus
						};
						const unsubscribeData = {
							"shop_id": shopRecords.shop_id,
							"email": email,
						}
						emailContents.unsubscriptionLink = generateUnsubscriptionLink(unsubscribeData);

						const subject = `New review (${formData.get('rating')}★) of ${productNodes.title} ${display_name}`;
						const emailHtml = ReactDOMServer.renderToStaticMarkup(
							<EmailTemplate emailContents={emailContents} />
						);

						const response = await sendEmail({
							to: email,
							subject,
							html: emailHtml,
						});
					}


					const dynamicComponent = <ThankYouPage shopRecords={shopRecords} discountText={discountText} discountCode={discountCode} otherProps={otherProps} />;
					const htmlContent = ReactDOMServer.renderToString(dynamicComponent);

					return json({ success: true, content: htmlContent });
				}
			} catch (error) {
				console.error('Error updating record:', error);
				return json({ error: 'Failed to update record' }, { status: 500 });
			}
		case "PATCH":


		default:

			return json({ "message": "", "method": "POST" });

	}
}
