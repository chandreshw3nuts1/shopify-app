import shopDetails from './../routes/models/shopDetails';
import settings from './../routes/models/settings';
import generalAppearances from './../routes/models/generalAppearances';
import generalSettings from './../routes/models/generalSettings';
import appInstallLogs from './../routes/models/appInstallLogs';
import reviewRequestTimingSettings from './../routes/models/reviewRequestTimingSettings';
import productReviewWidgetCustomizes from './../routes/models/productReviewWidgetCustomizes';
import reviewDiscountSettings from './../routes/models/reviewDiscountSettings';
import sidebarReviewWidgetCustomizes from './../routes/models/sidebarReviewWidgetCustomizes';
import reviewFormSettings from './../routes/models/reviewFormSettings';
import floatingWidgetCustomizes from './../routes/models/floatingWidgetCustomizes';

import settingsJson from './../utils/settings.json';

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
		if (data.shop) {
			/* get default location*/
			const locationResponse = await fetch(`https://${session.shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/locations/${data.shop.primary_location_id}.json`, {
				method: 'GET',
				headers: {
					'X-Shopify-Access-Token': session.accessToken,
					'Content-Type': 'application/json',
				},
			});
			const locationData = await locationResponse.json();
			/* get default location end*/


			const query = { shop: data.shop.domain };
			const currency_symbol = data.shop.money_format.replace(/{{.*?}}/g, '').trim();

			const update = {
				$set: {
					shop_id: data.shop.id,
					shop: data.shop.domain,
					country_name: data.shop.country_name,
					country_code: locationData.location.country_code || null,
					currency: data.shop.currency,
					currency_symbol: currency_symbol,
					timezone: data.shop.iana_timezone,
					shop_owner: data.shop.shop_owner,
					primary_location_id: data.shop.primary_location_id,
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


			await generalSettings.updateOne(
				{ shop_id: shopRecords._id },
				{
					$setOnInsert: {
						shop_id: shopRecords._id,
						defaul_language: 'en',
						multilingual_support: true
					}
				},
				{ upsert: true }
			);

			await generalAppearances.updateOne(
				{ shop_id: shopRecords._id },
				{
					$setOnInsert: {
						shop_id: shopRecords._id,
						banner: settingsJson.defaultColors.defaultBanner,
						enabledEmailBanner: true,
						starIcon: settingsJson.defaultColors.starIcon,
						cornerRadius: settingsJson.defaultColors.cornerRadius,
						widgetFont: settingsJson.defaultColors.widgetFont,
						starIconColor: settingsJson.defaultColors.starIconColor,
						emailBackgroundColor: settingsJson.defaultColors.emailBackgroundColor,
						contentBackgroundColor: settingsJson.defaultColors.contentBackgroundColor,
						emailTextColor: settingsJson.defaultColors.emailTextColor,
						buttonBackgroundColor: settingsJson.defaultColors.buttonBackgroundColor,
						buttonBorderColor: settingsJson.defaultColors.buttonBorderColor,
						buttonTitleColor: settingsJson.defaultColors.buttonTitleColor,
						fontType: settingsJson.defaultColors.fontType,
						fontSize: settingsJson.defaultColors.fontSize,
						appBranding: settingsJson.defaultColors.appBranding,
						emailAppearance: settingsJson.defaultColors.emailAppearance,
					}
				},
				{ upsert: true }
			);


			await reviewRequestTimingSettings.updateOne(
				{ shop_id: shopRecords._id },
				{
					$setOnInsert: {
						shop_id: shopRecords._id,
						is_different_timing: settingsJson.defaultReviewRequestTiming.isDifferentTiming,
						default_day_timing: settingsJson.defaultReviewRequestTiming.defaultDayTiming,
						default_order_timing: settingsJson.defaultReviewRequestTiming.defaultOrderTiming,
						domestic_day_timing: settingsJson.defaultReviewRequestTiming.domesticDayTiming,
						domestic_order_timing: settingsJson.defaultReviewRequestTiming.domesticOrderTiming,
						international_day_timing: settingsJson.defaultReviewRequestTiming.internationalDayTiming,
						international_order_timing: settingsJson.defaultReviewRequestTiming.internationalOrderTiming,
						fallback_timing: settingsJson.defaultReviewRequestTiming.fallbackTiming
					}
				},
				{ upsert: true }
			);


			await productReviewWidgetCustomizes.updateOne(
				{ shop_id: shopRecords._id },
				{
					$setOnInsert: {
						shop_id: shopRecords._id,
						widgetLayout: settingsJson.productWidgetCustomize.widgetLayout,
						widgetColor: settingsJson.productWidgetCustomize.widgetColor,
						headerTextColor: settingsJson.productWidgetCustomize.headerTextColor,
						buttonBorderColor: settingsJson.productWidgetCustomize.buttonBorderColor,
						buttonTitleColor: settingsJson.productWidgetCustomize.buttonTitleColor,
						buttonBackgroundOnHover: settingsJson.productWidgetCustomize.buttonBackgroundOnHover,
						buttonTextOnHover: settingsJson.productWidgetCustomize.buttonTextOnHover,
						buttonBackground: settingsJson.productWidgetCustomize.buttonBackground,
						reviewsText: settingsJson.productWidgetCustomize.reviewsText,
						reviewsBackground: settingsJson.productWidgetCustomize.reviewsBackground,
						reviewsBackgroundOnHover: settingsJson.productWidgetCustomize.reviewsBackgroundOnHover,
						replyText: settingsJson.productWidgetCustomize.replyText,
						replyBackground: settingsJson.productWidgetCustomize.replyBackground,
						replyBackgroundOnHover: settingsJson.productWidgetCustomize.replyBackgroundOnHover,
						verifiedBadgeBackgroundColor: settingsJson.productWidgetCustomize.verifiedBadgeBackgroundColor,
						starsBarFill: settingsJson.productWidgetCustomize.starsBarFill,
						starsBarBackground: settingsJson.productWidgetCustomize.starsBarBackground,
						reviewShadow: settingsJson.productWidgetCustomize.reviewShadow,
						cornerRadius: settingsJson.productWidgetCustomize.cornerRadius,
						headerLayout: settingsJson.productWidgetCustomize.headerLayout,
						productReviewsWidget: settingsJson.productWidgetCustomize.productReviewsWidget,
						writeReviewButton: settingsJson.productWidgetCustomize.writeReviewButton,
						itemType: settingsJson.productWidgetCustomize.itemType,
						reviewDates: settingsJson.productWidgetCustomize.reviewDates,
						defaultSorting: settingsJson.productWidgetCustomize.defaultSorting,
						showSortingOptions: settingsJson.productWidgetCustomize.showSortingOptions,
						showRatingsDistribution: settingsJson.productWidgetCustomize.showRatingsDistribution,
					}
				},
				{ upsert: true }
			);

			await reviewDiscountSettings.updateOne(
				{ shop_id: shopRecords._id },
				{
					$setOnInsert: {
						shop_id: shopRecords._id,
					}
				},
				{ upsert: true }
			);


			await sidebarReviewWidgetCustomizes.updateOne(
				{ shop_id: shopRecords._id },
				{
					$setOnInsert: {
						shop_id: shopRecords._id,
						isActive: settingsJson.sidebarRatingWidgetCustomize.isActive,
						widgetPosition: settingsJson.sidebarRatingWidgetCustomize.widgetPosition,
						widgetOrientation: settingsJson.sidebarRatingWidgetCustomize.widgetOrientation,
						buttonText: settingsJson.sidebarRatingWidgetCustomize.buttonText,
						buttonBackgroundColor: settingsJson.sidebarRatingWidgetCustomize.buttonBackgroundColor,
						buttonTextColor: settingsJson.sidebarRatingWidgetCustomize.buttonTextColor,
						hideOnMobile: settingsJson.sidebarRatingWidgetCustomize.hideOnMobile,
					}
				},
				{ upsert: true }
			);


			await reviewFormSettings.updateOne(
				{ shop_id: shopRecords._id },
				{
					$setOnInsert: {
						shop_id: shopRecords._id,
						themeColor: settingsJson.reviewFormSettings.themeColor,
						themeTextColor: settingsJson.reviewFormSettings.themeTextColor,
					}
				},
				{ upsert: true }
			);

			await floatingWidgetCustomizes.updateOne(
				{ shop_id: shopRecords._id },
				{
					$setOnInsert: {
						shop_id: shopRecords._id,
						backgroundColor: settingsJson.floatingWidgetCustomize.backgroundColor,
						textColor: settingsJson.floatingWidgetCustomize.textColor,
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

		}


	} catch (error) {
		console.error('Error installing App:', error);
	}
}

