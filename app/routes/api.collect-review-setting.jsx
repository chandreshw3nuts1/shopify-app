import { json } from "@remix-run/node";
import { mongoConnection } from './../utils/mongoConnection'; 
import { getShopDetails } from './../utils/getShopDetails'; 

// import ObjectId from 'bson-objectid';
import { Types } from 'mongoose';

export async function loader() {
    return json({
        name:"loading"
    });
  }

  export async function action({ params, request }) {
    const collectionName = 'settings';

    const method = request.method;
    const requestData = await request.json();
    // const oid= new Types.ObjectId(requestData.oid);
    const shopRecords =await getShopDetails(request);
    switch(method){
        case "POST":

        try {
            const db = await mongoConnection();
            
            const collection = db.collection(collectionName);

            const query = { shop_id : shopRecords._id };
            const update = { $set: { 
                [requestData.field] : requestData.value
              }
            };
            const options = { upsert: true };
            const result = await collection.findOneAndUpdate(query, update, options);
            
            return json({"status" : 200, "message" : "Settings saved"});

          } catch (error) {
            return json({"status" : 400, "message" : "Failed to update record"});
          }

        case "PATCH":

        default:

        return json({"message" : "hello", "method" : "POST"});

    }
  }
  