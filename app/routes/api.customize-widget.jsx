import { json } from "@remix-run/node";
import { mongoConnection } from "./../utils/mongoConnection"; 
import { ObjectId } from 'mongodb';
import { getShopDetailsByShop } from './../utils/common';
import productReviewWidgetCustomizes from "./models/productReviewWidgetCustomizes";

export async function loader() {
	return json({});
}


export async function action({ request} ) {
	const requestBody = await request.json();

    const method = request.method;
    switch(method){
        case "POST":
            const {shop, actionType, language } = requestBody;
            try {
                const db = await mongoConnection();
                const shopRecords = await getShopDetailsByShop(shop);

                if (actionType == 'productReviewCustomize') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestBody.field]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await productReviewWidgetCustomizes.findOneAndUpdate(query, update, options);
                    return json({ "status": 200, "message": "Settings saved" });
                } else if(actionType == 'productReviewCustomizeLanguageContent') {
                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [`${language}.${requestBody.field}`]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await productReviewWidgetCustomizes.findOneAndUpdate(query, update, options);

                    return json({ status: 200, message: "Setting saved" });                        
                }

                

            } catch (error) {
                console.error('Error updating record:', error);
                return json({ error: 'Failed to update record' , status: 500 });
            }

        case "DELETE":
			
        default:

        return json({"message" : "", "method" : "POST"});

    }

	return json(requestBody);
}

