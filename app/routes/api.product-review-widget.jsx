import { json } from "@remix-run/node";
// import { sendEmail } from "./../utils/email.server";
import { GraphQLClient } from "graphql-request";
import { mongoConnection } from "./../utils/mongoConnection";
import { findOneRecord } from "./../utils/common";
import EmailTemplate from './components/email/EmailTemplate';
import ReactDOMServer from 'react-dom/server';
import { ObjectId } from 'mongodb';
import productReviews  from "./models/productReviews";
import reviewDocuments from "./models/reviewDocuments";
import productReviewQuestions from "./models/productReviewQuestions";
import settingsJson from './../utils/settings.json'; 
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
	// const response = await sendEmail({
	// 	to: email,
	// 	subject,
	// 	html: emailHtml,
	// });


	return json({
		name: 'response'
	});
}


export async function action({ request }) {

	const method = request.method;
	const formData = await request.formData();
	
	const shop = formData.get('shop_domain');
	switch (method) {
		case "POST":
			try {
				
				const shopRecords = await findOneRecord("shop_details", { "shop": shop });
				const settings = await findOneRecord('settings', {
					shop_id: shopRecords._id,
				});

				var reviewStatus = 'publish';
				const reviewStarRating = parseInt(formData.get('rating'));
				if (settings.autoPublishReview == false) {
					var reviewStatus = 'pending';
				} else {

					if ( settings.reviewPublishMode == 'auto' || settings.reviewPublishMode == '5star') {
						var reviewStatus = 'publish';
					} else if (settings.reviewPublishMode == 'above4' && reviewStarRating >= 4) {
						var reviewStatus = 'publish';
					} else if (settings.reviewPublishMode == 'above3' && reviewStarRating >= 3) {
						var reviewStatus = 'publish';
					} else {
						var reviewStatus = 'pending';
					}
				}
				const db = await mongoConnection();
				const productReviewModel = new productReviews({
					shop_id: shopRecords._id,
					first_name: formData.get('first_name'),
					last_name: formData.get('last_name'),
					display_name: formData.get('first_name') +" "+ formData.get('last_name').charAt(0),
					email: formData.get('email'),
					description: formData.get('description'),
					rating: reviewStarRating,
					product_id: formData.get('product_id'),
					product_title: formData.get('product_title'),
					product_url: formData.get('product_url'),
					status: reviewStatus,
				});
				const result = await productReviewModel.save();

				const insertedId = result._id;

				// upload images/video

				const files = formData.getAll("image_and_videos[]");
				const uploadsDir = path.join(process.cwd(), "public/uploads");
				fs.mkdirSync(uploadsDir, { recursive: true });
				for (let i = 0; i < files.length; i++) {
					if (files[i].name != "" && files[i].name != null){
						const fileName = Date.now()+"-"+files[i].name; 
						const filePath = path.join(uploadsDir, fileName);
						const buffer = Buffer.from(await files[i].arrayBuffer());
						fs.writeFileSync(filePath, buffer);

						const isCover = i === 0; // index 0 will be true, others will be false
						const docType = 'image';
				
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
				console.log(questions);
				if (questions.length > 0) {
					questions.map( async (question, index) => {
						if(question.answer != null) {
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

				return json({ success: true });
			} catch (error) {
				console.error('Error updating record:', error);
				return json({ error: 'Failed to update record' }, { status: 500 });
			}
		case "PATCH":


		default:

			return json({ "message": "hello", "method": "POST" });

	}
}
