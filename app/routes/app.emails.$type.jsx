import React, { useState, useEffect } from 'react';
import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import LanguageSelector from "./components/language-selector";
import ReviewRequest from './components/emailsComponents/ReviewRequest';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import { getShopDetails } from './../utils/getShopDetails';
import emailReviewRequestSettings from './models/emailReviewRequestSettings';

import {
	Page,
	Card,
	Spinner,
	TextField,
} from '@shopify/polaris';

export const loader = async ({ request, params }) => {
	const shopRecords = await getShopDetails(request);
	
	const emailReviewRequest = await emailReviewRequestSettings.findOne({
		shop_id: shopRecords._id,
	});

	return json({ params, shopRecords , emailReviewRequest });
};

export default function EmailTemplateSettings() {


	const { params, shopRecords , emailReviewRequest} = useLoaderData();
	const type = params.type;
	const navigate = useNavigate();

	

	const backToReviewPage = (e) => {
		e.preventDefault();
		navigate('/app/review');
	}
	// Define the component to render based on the type
	let content;
	let emailTemplateName;
	switch (type) {
		case 'review-request':
			content = <ReviewRequest shopRecords={shopRecords} emailReviewRequest={emailReviewRequest}/>;
			emailTemplateName = "Review request"
			break;
		case 'review-reminders':
			content = <p>review-reminders</p>;
			emailTemplateName = "Review request reminder"

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
				<div className='pagebackbtn'>
					<a href="#" onClick={backToReviewPage}><i className='twenty-arrow-left'></i>Collect reviews</a>
				</div>
				<div>
					<LanguageSelector />
					{content}
				</div>

			</Page>

		</>

	);
}