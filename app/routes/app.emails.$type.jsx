import React, { useState, useEffect } from 'react';
import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import LanguageSelector from "./components/language-selector";
import ReviewRequest from './components/emailsComponents/ReviewRequest';
import ReviewRequestReminder from './components/emailsComponents/ReviewRequestReminder';
import DiscountPhotoVideoReviewReminder from './components/emailsComponents/DiscountPhotoVideoReviewReminder';
import ReviewReply from './components/emailsComponents/ReviewReply';
import DiscountPhotoVideoReview from './components/emailsComponents/DiscountPhotoVideoReview';
import PhotoVideoReminder from './components/emailsComponents/PhotoVideoReminder';
import ResendReviewRequestReminder from './components/emailsComponents/ResendReviewRequestReminder';

import { useNavigate } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import { getShopDetails } from './../utils/getShopDetails';
import emailReviewRequestSettings from './models/emailReviewRequestSettings';
import emailReviewRequestReminderSettings from './models/emailReviewRequestReminderSettings';
import emailReviewReplySettings from './models/emailReviewReplySettings';
import emailPhotovideoReminderSettings from './models/emailPhotovideoReminderSettings';
import emailDiscountPhotoVideoReviewSettings from './models/emailDiscountPhotoVideoReviewSettings';
import emailDiscountPhotoVideoReviewReminderSettings from './models/emailDiscountPhotoVideoReviewReminderSettings';
import generalAppearances from './models/generalAppearances';
import generalSettings from './models/generalSettings';
import emailResendReviewRequestSettings from './models/emailResendReviewRequestSettings';

import { useTranslation } from "react-i18next";

import {
	Page,
} from '@shopify/polaris';

export const loader = async ({ request, params }) => {
	const shopRecords = await getShopDetails(request);
	var JsonData = { params, shopRecords };
	const generalAppearancesData = await generalAppearances.findOne({ shop_id: shopRecords._id });
	JsonData.generalAppearances = generalAppearancesData;

	switch (params.type) {
		case 'review-request':
			JsonData['emailTemplateObj'] = await emailReviewRequestSettings.findOne({
				shop_id: shopRecords._id,
			});
			break;
		case 'review-reply':
			JsonData['emailTemplateObj'] = await emailReviewReplySettings.findOne({
				shop_id: shopRecords._id,
			});

			break;
		case 'discount-photo-video-review':
			JsonData['emailTemplateObj'] = await emailDiscountPhotoVideoReviewSettings.findOne({
				shop_id: shopRecords._id,
			});
			break;

		case 'review-request-reminder':
			JsonData['emailTemplateObj'] = await emailReviewRequestReminderSettings.findOne({
				shop_id: shopRecords._id,
			});
			break;
		case 'photo-video-reminder':
			JsonData['emailTemplateObj'] = await emailPhotovideoReminderSettings.findOne({
				shop_id: shopRecords._id,
			});
			break;
		case 'discount-photo-video-review-reminder':
			JsonData['emailTemplateObj'] = await emailDiscountPhotoVideoReviewReminderSettings.findOne({
				shop_id: shopRecords._id,
			});
			break;
		case 'resend-review-request':
			JsonData['emailTemplateObj'] = await emailResendReviewRequestSettings.findOne({
				shop_id: shopRecords._id,
			});
			break;
		default:
			content = <h4>404 - Page Not Found</h4>;
			break;
	}

	JsonData['generalSettingsModel'] = await generalSettings.findOne({ shop_id: shopRecords._id });
	return json(JsonData);
};

export default function EmailTemplateSettings() {


	const { params, shopRecords, emailTemplateObj, generalSettingsModel, generalAppearances } = useLoaderData();
	const { i18n } = useTranslation();

	const type = params.type;
	const navigate = useNavigate();

	useEffect(() => {
		const defaultLanguage = (generalSettingsModel && generalSettingsModel.defaul_language) ? generalSettingsModel.defaul_language : "en";
		i18n.changeLanguage(defaultLanguage);

	}, []);



	const backToReviewPage = (e) => {
		e.preventDefault();
		navigate('/app/review');
	}
	let content;
	let emailTemplateName;
	switch (type) {
		case 'review-request':
			content = <ReviewRequest shopRecords={shopRecords} emailTemplateObj={emailTemplateObj} generalAppearances={generalAppearances} generalSettingsModel={generalSettingsModel} />;
			emailTemplateName = "Review request"
			break;
		case 'review-reply':
			content = <ReviewReply shopRecords={shopRecords} emailTemplateObj={emailTemplateObj} generalAppearances={generalAppearances} generalSettingsModel={generalSettingsModel} />;
			emailTemplateName = "Reply to review"

			break;
		case 'discount-photo-video-review':
			content = <DiscountPhotoVideoReview shopRecords={shopRecords} emailTemplateObj={emailTemplateObj} generalAppearances={generalAppearances} generalSettingsModel={generalSettingsModel} />;
			emailTemplateName = "Discount for photo/video review"

			break;
		case 'review-request-reminder':
			content = <ReviewRequestReminder shopRecords={shopRecords} emailTemplateObj={emailTemplateObj} generalAppearances={generalAppearances} generalSettingsModel={generalSettingsModel} />;
			emailTemplateName = "Review request reminder"

			break;
		case 'photo-video-reminder':
			content = <PhotoVideoReminder shopRecords={shopRecords} emailTemplateObj={emailTemplateObj} generalAppearances={generalAppearances} generalSettingsModel={generalSettingsModel} />;
			emailTemplateName = "Photo/video reminder"

			break;
		case 'discount-photo-video-review-reminder':
			content = <DiscountPhotoVideoReviewReminder shopRecords={shopRecords} emailTemplateObj={emailTemplateObj} generalAppearances={generalAppearances} generalSettingsModel={generalSettingsModel} />;
			emailTemplateName = "Discount reminder for photo/video review"
			break;
		case 'resend-review-request':
			content = <ResendReviewRequestReminder shopRecords={shopRecords} emailTemplateObj={emailTemplateObj} generalAppearances={generalAppearances} generalSettingsModel={generalSettingsModel} />;
			emailTemplateName = "Resend Review request"
			break;
		default:
			content = <h4>404 - Page Not Found</h4>;
			break;
	}

	const [crumbs, setCrumbs] = useState([
		{ title: "Review", "link": "./../../review" },
		{ title: "Collect review", "link": "./../../review" },
		{ title: emailTemplateName, link: "" },
	]);

	// Return the EmailTemplateSettings component with LanguageSelector and content
	return (
		<>
			<Breadcrumb crumbs={crumbs} />
			<Page fullWidth>
				<div className='pagetitle'>
					<div className='pagebackbtn flxflexi'>
						<a href="#" onClick={backToReviewPage}><i className='twenty-arrow-left'></i>Collect reviews</a>
					</div>
					<div className='flxfix'>
						{generalSettingsModel && generalSettingsModel.multilingual_support &&
							<LanguageSelector className="inlinerow m-0" />
						}
					</div>
				</div>
				<div className='flxfix'>
					{content}
				</div>

			</Page>

		</>

	);
}