import React, { useState, useEffect } from 'react';
import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import LanguageSelector from "./components/language-selector";
import ReviewRequest from './components/emailsComponents/ReviewRequest';
import ReviewReply from './components/emailsComponents/ReviewReply';
import DiscountPhotoVideoReview from './components/emailsComponents/DiscountPhotoVideoReview';

import { useNavigate } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import { getShopDetails } from './../utils/getShopDetails';
import emailReviewRequestSettings from './models/emailReviewRequestSettings';
import emailReviewReplySettings from './models/emailReviewReplySettings';
import emailDiscountPhotoVideoReviewSettings from './models/emailDiscountPhotoVideoReviewSettings';
import generalAppearances from './models/generalAppearances';
import generalSettings from './models/generalSettings';
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
			content = <ReviewRequest shopRecords={shopRecords} emailTemplateObj={emailTemplateObj} generalAppearances={generalAppearances} />;
			emailTemplateName = "Review request"
			break;
		case 'review-reply':
			content = <ReviewReply shopRecords={shopRecords} emailTemplateObj={emailTemplateObj} generalAppearances={generalAppearances} />;
			emailTemplateName = "Reply to review"

			break;
		case 'discount-photo-video-review':
			content = <DiscountPhotoVideoReview shopRecords={shopRecords} emailTemplateObj={emailTemplateObj} generalAppearances={generalAppearances} />;
			emailTemplateName = "Discount for photo/video review"

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