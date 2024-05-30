import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import { GraphQLClient } from "graphql-request";
import { mongoConnection } from "./../utils/mongoConnection"; 
import { getShopDetails } from "./../utils/common"; 
import EmailTemplate from './components/email/EmailTemplate';
import ReactDOMServer from 'react-dom/server';

export async function loader() {

	
	const email = 'chandresh.w3nuts@gmail.com';
	const recipientName ="Chands";
	const content ="okok okoko ko ko ";
	const footer ="footer footerfooterfooter ";
	
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
		name:'response'
	});
}


export async function action({ request }) {
	
	const method = request.method;
	const formData = await request.formData();
	const shop = formData.get('shop_domain');

	console.log(formData.get('product_title'));

	switch(method){
		case "POST":
			try {


				const db = await mongoConnection();

				const shopCollection = db.collection('shop');
				const shopRecords = await shopCollection.findOne({"domain" : shop});
				const images = [
					"img1",
					"img2",
					"img3",
				];
				const collectionName = 'product-reviews';
				const collection = db.collection(collectionName);
				
				const currentDate = new Date();
    			const currentDateTimeString = currentDate.toISOString();

				const result = await db.collection(collectionName).insertOne({
					shop_id:shopRecords._id,
					first_name : "test",
					last_name : "lastname",
					email : "test@gmail.com",
					description: formData.get('review'),
					rating : formData.get('rating'),
					product_id : formData.get('product_id'),
					product_title : formData.get('product_title'),
					images : images,
					created_at : currentDateTimeString
				});

				//console.log(result);
	
				return json({ success: true });
			  } catch (error) {
				console.error('Error updating record:', error);
				return json({ error: 'Failed to update record' }, { status: 500 });
			  }
		case "PATCH":

			
		default:

		return json({"message" : "hello", "method" : "POST"});

	}
}
