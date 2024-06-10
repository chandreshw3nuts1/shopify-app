import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import { GraphQLClient } from "graphql-request";
import { mongoConnection } from "./../utils/mongoConnection"; 
import { findOneRecord } from "./../utils/common"; 
import EmailTemplate from './components/email/EmailTemplate';
import ReactDOMServer from 'react-dom/server';
import { getCurrentDate } from "./../utils/dateFormat"; 

export async function loader() {
	return json({});
}


export async function action({ request} ) {
	const requestBody = await request.json();
	const collectionName = 'custom-questions';

    const method = request.method;

    switch(method){
        case "POST":
		var {shop , question, answers} = requestBody;

        try {
            const db = await mongoConnection();
            
            const collection = db.collection(collectionName);
			const shopRecords = await findOneRecord("shop", {"domain" : shop});
			console.log(shop);
			const result = await db.collection(collectionName).insertOne({
				shop_id:shopRecords._id,
				question : question,
				answers : answers,
				created_at : getCurrentDate()
			});


            return json({ success: result });
          } catch (error) {
            console.error('Error updating record:', error);
            return json({ error: 'Failed to update record' }, { status: 500 });
          }

        case "PATCH":

        default:

        return json({"message" : "hello", "method" : "POST"});

    }


	return json(requestBody);
}

