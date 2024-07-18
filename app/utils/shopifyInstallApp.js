import shopDetails from './../routes/models/shopDetails';
import settings from './../routes/models/settings';
import generalAppearances from './../routes/models/generalAppearances';
import appInstallLogs from './../routes/models/appInstallLogs';

export async function storeShopDetails(session) {
	try {
		const url = `https://${session.shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/shop.json`;

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'X-Shopify-Access-Token': session.accessToken,
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();

		const query = { shop: data.shop.domain };
		const update = {
			$set: {
				shop_id: data.shop.id,
				shop: data.shop.domain,
				country_name: data.shop.country_name,
				currency: data.shop.currency,
				timezone: data.shop.timezone,
				shop_owner: data.shop.shop_owner,
				name: data.shop.name,
				email: data.shop.email
			}
		};

		const options = {
			new: true,
			upsert: true,
		};

		const shopRecords = await shopDetails.findOneAndUpdate(query, update, options);

		await settings.updateOne(
			{ shop_id: shopRecords._id },
			{
				$setOnInsert: {
					shop_id: shopRecords._id,
					autoPublishReview: true,
					reviewPublishMode: "auto"
				}
			},
			{ upsert: true }
		);

		await generalAppearances.updateOne(
			{ shop_id: shopRecords._id },
			{
				$setOnInsert: {
					shop_id: shopRecords._id,
					banner: "default-banner.png",
					enabledEmailBanner: true,
					starIcon: "rating-star-rounded"
				}
			},
			{ upsert: true }
		);

		/* add install app log */
		const appInstallLogsModel = new appInstallLogs({
			
			shop_id: data.shop.id,
			shop: data.shop.domain,
			event_type: 'install',
			shop_owner: data.shop.shop_owner,
			name: data.shop.name,
			email: data.shop.email
		});

		await appInstallLogsModel.save();

		console.log('=============App Installed=====================');

	} catch (error) {
		console.error('Error installing App:', error);
	}
}

