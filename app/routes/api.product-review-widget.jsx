import { json } from "@remix-run/node";
// import { sendEmail } from "./../utils/email.server";
import { GraphQLClient } from "graphql-request";
import { mongoConnection } from "./../utils/mongoConnection";
import { findOneRecord } from "./../utils/common";
import EmailTemplate from './components/email/EmailTemplate';
import ReactDOMServer from 'react-dom/server';
import { getCurrentDate } from "./../utils/dateFormat";
import { ObjectId } from 'mongodb';

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
				const shopRecords = await findOneRecord("shopify_sessions", { "shop": shop });
				const settings = await findOneRecord('settings', {
					shop_id: shopRecords._id,
				});


				const collectionName = 'product_reviews';

				const currentDate = new Date();
				var reviewStatus = 'pending';
				const reviewStarRating = parseInt(formData.get('rating'));
				if (settings.autoPublishReview == false) {
					var reviewStatus = 'pending';
				} else {
					if (settings.autoPublishReview == true && (settings.autoPublishReview == 'auto' || settings.reviewPublishMode == '5star')) {
						var reviewStatus = 'publish';
					} else if (settings.reviewPublishMode == 'above4' && reviewStarRating >= 4) {
						var reviewStatus = 'publish';
					} else if (settings.reviewPublishMode == 'above3' && reviewStarRating >= 3) {
						var reviewStatus = 'publish';
					}
				}
				const db = await mongoConnection();
				const result = await db.collection(collectionName).insertOne({
					shop_id: shopRecords._id,
					first_name: formData.get('first_name'),
					last_name: formData.get('last_name'),
					email: formData.get('email'),
					description: formData.get('description'),
					rating: reviewStarRating,
					product_id: formData.get('product_id'),
					product_title: formData.get('product_title'),
					product_url: formData.get('product_url'),
					status: reviewStatus,
					created_at: getCurrentDate()
				});
				const insertedId = result.insertedId;

				// upload images/video

				const images = [
					"https://png.pngtree.com/thumb_back/fh260/background/20230817/pngtree-lotus-flower-jpg-pink-lotus-flower-image_13023952.jpg",
					"https://png.pngtree.com/thumb_back/fh260/background/20230817/pngtree-lotus-flower-jpg-pink-lotus-flower-image_13023952.jpg",
				];

				images.map( async (img, index) => {
					const isCover = index == 0 ? true : false;
					const docType = 'image';
					await db.collection('review_documents').insertOne({
						review_id: new ObjectId(insertedId),
						type: docType,
						url : img,
						is_approve : true,
						is_cover : isCover
					})
				});



				//insert questions and answers 
				var questions = [];
				for (let i = 0; ; i++) {
					const question_id = formData.get(`questions[${i}][question_id]`);
					const answer = formData.get(`questions[${i}][answer]`);
					if (!question_id) break; // Exit loop if question_id is not found
					questions.push({ question_id, answer });
				}

				if (questions.length > 0) {
					const insertPromises = questions.map(question =>
						db.collection('product_review_questions').insertOne({
							review_id: new ObjectId(insertedId),
							question_id: new ObjectId(question.question_id),
							answer: question.answer
						})
					);
					await Promise.all(insertPromises);
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
