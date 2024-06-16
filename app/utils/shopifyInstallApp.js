import { mongoConnection } from './mongoConnection'; 

export async function storeShopDetails(session) {
  	try{
		const url = `https://${session.shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/shop.json`;
		const response = await fetch(url, {
			method: 'GET',
			headers: {
			'X-Shopify-Access-Token': session.accessToken,
			'Content-Type': 'application/json',
			},
		});
		const data = await response.json();
		const db = await mongoConnection();
		const collection = db.collection('shopify_sessions');
		console.log('============end install======================');

		console.log(data);
		console.log('============end install======================');
		const query = { shop : data.shop.domain };
		const update = { $set: { 
				shop_id : data.shop.id,
				accessToken : session.accessToken,
				country_name : data.shop.country_name,
				currency : data.shop.currency,
				timezone : data.shop.timezone,
				shop_owner : data.shop.shop_owner,
				name : data.shop.name,
				email : data.shop.email
			}
		};
		const options = { upsert: true, returnDocument: 'after'};
		console.log(query, update, options);
		const shopRecords = await collection.findOneAndUpdate(query, update, options);
		const settingCollection = db.collection('settings');
		const testvar = await settingCollection.updateOne(
			{
				shop_id: shopRecords._id
			}, 
			{
			$setOnInsert: {shop_id: shopRecords._id, autoPublishReview: true, reviewPublishMode: "auto"}
			},
			{upsert: true}
		)
		console.log(shopRecords);

		 console.log('=============end=====================');

	} catch (error) {
		console.error('Error installing App:', error);
	} 
}

export async function getSessionDetails(shop) {
  // Implement your retrieval logic here, e.g., fetch from a database
  console.log('Getting session details for shop:', shop);
  return null; // Return the session details if found
}
