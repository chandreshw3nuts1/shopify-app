import { json } from "@remix-run/node";
import { mongoConnection } from './../utils/mongoConnection';
import generalSettings from './models/generalSettings';
import { getShopDetailsByShop } from './../utils/common';

export async function loader() {
    return json({
        name: "loading"
    });
}

export async function action({ params, request }) {
    const method = request.method;
    const requestBody = await request.json();
    switch (method) {
        case "POST":
            var { shop, actionType } = requestBody;
            try {
                const db = await mongoConnection();
                const shopRecords = await getShopDetailsByShop(shop);
                if (actionType == 'generalSettings') {

                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [requestBody.field]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await generalSettings.findOneAndUpdate(query, update, options);
                    return json({ "status": 200, "message": "Settings saved" });

                } else if (actionType == 'generalSettingsFooterText') {
                    var { language } = requestBody;

                    const query = { shop_id: shopRecords._id };
                    const update = {
                        $set: {
                            [`${language}.${requestBody.field}`]: requestBody.value
                        }
                    };
                    const options = { upsert: true, returnOriginal: false };
                    await generalSettings.findOneAndUpdate(query, update, options);
                    
                    return json({ "status": 200, "message": "Settings saved" });

                }


                emailFooterTextEnable

            } catch (error) {
                return json({ "status": 400, "message": "Failed to update record", error: error });
            }

        case "PATCH":

        default:

            return json({ "message": "", "method": "" });

    }
}
