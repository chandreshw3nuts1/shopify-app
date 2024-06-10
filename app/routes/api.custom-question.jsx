import { json } from "@remix-run/node";
import { sendEmail } from "./../utils/email.server";
import { GraphQLClient } from "graphql-request";
import { mongoConnection } from "./../utils/mongoConnection"; 
import { findOneRecord } from "./../utils/common"; 
import EmailTemplate from './components/email/EmailTemplate';
import ReactDOMServer from 'react-dom/server';
import { ObjectId } from 'mongodb';

export async function loader() {
	return json({});
}


export async function action({ request} ) {
	const requestBody = await request.json();
	const collectionName = 'custom-questions';

    const method = request.method;
    switch(method){
        case "POST":
            const {shopRecords, actionType } = requestBody;
            try {
                const db = await mongoConnection();         
                const collection = db.collection(collectionName);
                const shopObjectId = new ObjectId(shopRecords._id);

                if (actionType == 'reorderQuestion') {
                    const {questionList } = requestBody;

                    const customQuestionsData =  await db.collection('custom-questions')
                    .find({
                        "shop_id" : shopObjectId,
                    })
                    .toArray();
                    customQuestionsData.map(async (item , index) => {
                        const reorderItem = questionList[index];
                        const query = { _id : new ObjectId(item._id) };
                        const update = { $set: { 
                                question : reorderItem.question,
                                answers : reorderItem.answers,
                            }
                        };
                        const options = { upsert: true };
                        await collection.findOneAndUpdate(query, update, options);
                    });
                    return json({ success: true });
                } else if (actionType == 'submitQuestionAnswer') {
                    const { question, answers} = requestBody;

                    const result = await db.collection(collectionName).insertOne({
                        shop_id:shopObjectId,
                        question : question,
                        answers : answers,
                    });
                    
                    const getLastRecord =  await db.collection(collectionName)
                    .findOne({
                        "_id" : new ObjectId(result.insertedId),
                    });
                    return json({status: 200, data: getLastRecord });

                } else if (actionType == 'updateQuestionAnswer') {
                    const { question, answers, updatingQuestionId} = requestBody;
                    
                    const query = { _id : new ObjectId(updatingQuestionId) };
                    const update = { $set: { 
                            question : question,
                            answers : answers,
                        }
                    };
                    const options = { upsert: true };
                    await collection.findOneAndUpdate(query, update, options);
                
                    const getLastRecord =  await db.collection(collectionName)
                    .findOne({
                        "_id" : new ObjectId(updatingQuestionId),
                    });
                    return json({status: 200, data: getLastRecord });

                }

            } catch (error) {
                console.error('Error updating record:', error);
                return json({ error: 'Failed to update record' , status: 500 });
            }

        case "PATCH":

        case "DELETE":
			try{
				var {id} = requestBody;
				console.log(id);
				const objectId = new ObjectId(id);
				const db = await mongoConnection();
				await db.collection(collectionName).deleteOne({ _id: objectId });
				return json({"status" : 200, "message" : "Question deleted successfully!"});
			} catch (error) {
				console.error('Error deleting record:', error);
				return json({"status" : 400, "message" : "Error deleting record!"});
			}
        default:

        return json({"message" : "hello", "method" : "POST"});

    }

	return json(requestBody);
}

