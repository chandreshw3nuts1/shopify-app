import { json } from "@remix-run/node";
import { mongoConnection } from "./../utils/mongoConnection"; 
import { ObjectId } from 'mongodb';
import productReviewQuestions from "./models/productReviewQuestions";
import customQuestions from "./models/customQuestions";

export async function loader() {
	return json({});
}


export async function action({ request} ) {
	const requestBody = await request.json();
	const collectionName = 'custom_questions';

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

                    const customQuestionsData =  await customQuestions.find({
                        "shop_id" : shopObjectId,
                    });

                    customQuestionsData.map(async (item , index) => {
                        const reorderItem = questionList[index];
                        const query = { _id : new ObjectId(item._id) };
                        const update = { $set: { 
                                question : reorderItem.question,
                                answers : reorderItem.answers,
                                isHideAnswers : reorderItem.isHideAnswers,
                                isMakeRequireQuestion : reorderItem.isMakeRequireQuestion,
                            }
                        };
                        const options = { upsert: true };
                        await customQuestions.findOneAndUpdate(query, update, options);
                    });
                    return json({ status: 200, message : "Review form saved" });
                } else if (actionType == 'submitQuestionAnswer') {
                    const { question, answers, isHideAnswers, isMakeRequireQuestion} = requestBody;

                    const result = await customQuestions({
                        shop_id:shopObjectId,
                        question : question,
                        answers : answers,
                        isHideAnswers : isHideAnswers,
                        isMakeRequireQuestion : isMakeRequireQuestion,
                    });
                    await result.save();
                    const getLastRecord = await customQuestions.findOne({ _id: result._id });

                    return json({status: 200, data: getLastRecord, message : "Question saved" });

                } else if (actionType == 'updateQuestionAnswer') {
                    const { question, answers,isHideAnswers, isMakeRequireQuestion,  updatingQuestionId} = requestBody;
                    
                    const query = { _id : new ObjectId(updatingQuestionId) };
                    const update = { $set: { 
                            question : question,
                            answers : answers,
                            isHideAnswers : isHideAnswers,
                            isMakeRequireQuestion : isMakeRequireQuestion,
                        }
                    };
                    const options = { upsert: true };
                    await customQuestions.findOneAndUpdate(query, update, options);
                    
                    const getLastRecord = await customQuestions.findOne({ _id: updatingQuestionId });

                    return json({status: 200, data: getLastRecord, message : "Question updated" });

                }

            } catch (error) {
                console.error('Error updating record:', error);
                return json({ error: 'Failed to update record' , status: 500 });
            }

        case "PATCH":

        case "DELETE":
			try{
				var {id} = requestBody;
				const objectId = new ObjectId(id);
                await productReviewQuestions.updateMany(
                    { question_id: objectId },
                    { $set: { deletedAt: new Date() } },
                    { new: true }
                );
                await customQuestions.findOneAndDelete({_id : objectId});

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

