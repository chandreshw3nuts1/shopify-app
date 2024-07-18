import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import { findOneRecord, getShopifyProducts } from "./../utils/common";
import EmailTemplate from './components/email/EmailTemplate';
import ReactDOMServer from 'react-dom/server';
import { ObjectId } from 'mongodb';
import productReviews from "./models/productReviews";
import reviewDocuments from "./models/reviewDocuments";
import productReviewQuestions from "./models/productReviewQuestions";
import manualRequestProducts from './models/manualRequestProducts';
import generalAppearances from './models/generalAppearances';
import { getUploadDocument } from "./../utils/documentPath";


import fs from "fs";
import path from "path";
export async function loader() {

	const email = 'chandresh.w3nuts@gmail.com';
	const recipientName = "Chands";
	const content = "okok okoko ko ko ";
	const footer = "footer footerfooterfooter ";

	const subject = 'my subject';
	const emailHtml = ReactDOMServer.renderToStaticMarkup(
		<EmailTemplate recipientName={recipientName} content={content} footer={footer} />
	);
	const response = await sendEmail({
		to: email,
		subject,
		html: emailHtml,
	});


	return json({
		name: 'response'
	});
}


export async function action({ request }) {

	const method = request.method;
	const formData = await request.formData();
	const validImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
	const validVideoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];

	const shop = formData.get('shop_domain');
	const actionType = formData.get('actionType');

	switch (method) {
		case "POST":
			try {

				if (actionType == "uploadDocuments") {
					const files = formData.getAll("image_and_videos[]");
					const uploadsDir = path.join(process.cwd(), "public/uploads");
					fs.mkdirSync(uploadsDir, { recursive: true });
					const imageAndVideoFiles = [];
					for (let i = 0; i < files.length; i++) {
						if (files[i].name != "" && files[i].name != null) {
							const fileName = Date.now() + "-" + files[i].name;
							const fileExtension = fileName.split('.').pop().toLowerCase();
							if (validImageExtensions.includes(fileExtension) || validVideoExtensions.includes(fileExtension)) {
								const filePath = path.join(uploadsDir, fileName);
								const buffer = Buffer.from(await files[i].arrayBuffer());
								fs.writeFileSync(filePath, buffer);
								imageAndVideoFiles.push(fileName);
							}
						}
					}
					return imageAndVideoFiles;
				} else if (actionType == "deleteDocuments") {
					const deleteFileName = formData.get("deleteFileName");
					const filePath = path.join(process.cwd(), "public/uploads") + "/" + deleteFileName;
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

				} else {


					if (shop == null || formData.get('product_id') == null) {
						return json({ success: false });
					}

					const shopRecords = await findOneRecord("shop_details", { "shop": shop });
					const settings = await findOneRecord('settings', {
						shop_id: shopRecords._id,
					});

					const productId = `"gid://shopify/Product/${formData.get('product_id')}"`;
					var productsDetails = await getShopifyProducts(shop, productId);
					const productNodes = productsDetails[0];
					if (!productsDetails[0]) {
						return json({ success: false });
					}

					const generalAppearancesData = await generalAppearances.findOne({ shop_id: shopRecords._id });
                    const logo = getUploadDocument(generalAppearancesData.logo, 'logo');

					const shopifyStoreUrl = `${process.env.SHOPIFY_ADMIN_STORE_URL}/${shopRecords.name}/apps/${process.env.SHOPIFY_APP_NAME}/app/manage-review`;

					var reviewStatus = 'publish';
					const reviewStarRating = parseInt(formData.get('rating'));
					if (settings.autoPublishReview == false) {
						var reviewStatus = 'pending';
					} else {

						if (settings.reviewPublishMode == 'auto' || settings.reviewPublishMode == '5star') {
							var reviewStatus = 'publish';
						} else if (settings.reviewPublishMode == 'above4' && reviewStarRating >= 4) {
							var reviewStatus = 'publish';
						} else if (settings.reviewPublishMode == 'above3' && reviewStarRating >= 3) {
							var reviewStatus = 'publish';
						} else {
							var reviewStatus = 'pending';
						}
					}
					var customer_locale = formData.get('customer_locale') || 'en';
					if (customer_locale == 'zh-TW') {
						customer_locale = 'cn2';
					} else if (customer_locale == 'zh-CN') {
						customer_locale = 'cn1';
					}
					const display_name = formData.get('first_name') + " " + formData.get('last_name').charAt(0);
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
						product_title: productNodes.title,
						product_url: productNodes.handle,
						status: reviewStatus,
						is_review_request: formData.get('requestId') ? true : false
					});
					const result = await productReviewModel.save();

					const insertedId = result._id;

					await manualRequestProducts.updateOne(
						{ _id: formData.get('requestId') },
						{
							$set: { status: "received" }
						}
					);
					// upload images/video

					const file_objects = formData.get("file_objects");
					if (file_objects != null && file_objects != "") {
						let files = file_objects.split(',');

						for (let i = 0; i < files.length; i++) {
							const fileName = files[i];

							var docType = 'image';

							const fileExtension = fileName.split('.').pop().toLowerCase();
							if (validImageExtensions.includes(fileExtension)) {
								var docType = "image";
							} else if (validVideoExtensions.includes(fileExtension)) {
								var docType = "video";
							}
							const isCover = i === 0; // index 0 will be true, others will be false
							const reviewDocumentModel = new reviewDocuments({
								review_id: new ObjectId(insertedId),
								type: docType,
								url: fileName,
								is_approve: true,
								is_cover: isCover
							});

							await reviewDocumentModel.save();
						}
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

					/* send email to admin when new reivew receive*/

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
						product_title: formData.get('product_title'),
						product_url: formData.get('product_url'),
						shopifyStoreUrl: shopifyStoreUrl,
						logo : logo,
						shop_domain : shopRecords.shop,

					};

					const footer = "";
					const subject = `New review (${formData.get('rating')}★) of ${formData.get('product_title')} ${display_name}`;
					const emailHtml = ReactDOMServer.renderToStaticMarkup(
						<EmailTemplate emailContents={emailContents} footer={footer} />
					);

					const response = await sendEmail({
						to: email,
						subject,
						html: emailHtml,
					});

					return json({ success: true });
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
