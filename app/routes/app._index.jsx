import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useNavigate } from 'react-router-dom';

import { getShopDetails } from './../utils/getShopDetails';
import HomeInformationAlert from './components/common/home-information-alert';
import EnableAppEmbedAlert from './components/common/enable-app-embed-alert';
import Cookies from 'js-cookie';
import { Tooltip as ReactTooltip } from 'react-tooltip'


import bannerImage from "./../images/medium-shot-young-people-with-reviews.jpg"
import { Dropdown, DropdownButton, Image } from 'react-bootstrap';

import ReviewRequestsSentIcon from "./components/icons/ReviewRequestsSentIcon";
import PhotoVideoReviewsIcon from "./components/icons/PhotoVideoReviewsIcon";
import UpsellsDashIcon from "./components/icons/UpsellsDashIcon";
import StoreVisitsIcon from "./components/icons/StoreVisitsIcon";
import SharesDashIcon from "./components/icons/SharesDashIcon";
import ReviewsCollectedIcon from "./components/icons/ReviewsCollectedIcon";
import OrdersDashIcon from "./components/icons/OrdersDashIcon";
import ImpressionsDashIcon from "./components/icons/ImpressionsDashIcon";
import InfoFillIcon from "./components/icons/InfoFillIcon";
import settingsJson from './../utils/settings.json';
import 'react-tooltip/dist/react-tooltip.css';
import { getAllThemes, checkAppEmbedAppStatus } from './../utils/common';


export const loader = async ({ request }) => {
	try {

		const shopRecords = await getShopDetails(request);
		const activeThemes = await getAllThemes(shopRecords.shop, true);
		const isEnabledAppEmbed = await checkAppEmbedAppStatus(shopRecords.shop, activeThemes.id);
        const reviewExtensionId = process.env.SHOPIFY_ALL_REVIEW_EXTENSION_ID;

		return json({ shopRecords, isEnabledAppEmbed, reviewExtensionId, activeThemes });

	} catch (error) {
		console.error('Error fetching records:', error);
		return json({ error: 'Error fetching records' }, { status: 500 });
	}
};


export async function fetchStatisticApi(requestParams) {
	try {
		const response = await fetch(`${settingsJson.host_url}/api/index`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestParams)
		});
		const data = await response.json();
		return data;

	} catch (error) {
		console.error('Failed to fetch reviews:', error);
	}
}
export default function Index() {
	const { shopRecords, isEnabledAppEmbed, reviewExtensionId, activeThemes } = useLoaderData();
	const [selectedDays, setSelectedDays] = useState(30);
	const [daysFilterTitle, setDaysFilterTitle] = useState('30 days');
	const [statisticResponse, setStatisticResponse] = useState({});

	const navigate = useNavigate();

	const daysTitles = {
		7: '7 days',
		14: '14 days',
		30: '30 days',
		60: '60 days',
		90: '90 days',
		all: 'All time',
	};
	const handleSelect = (eventKey) => {
		setDaysFilterTitle(daysTitles[eventKey]);
		setSelectedDays(eventKey);
	};


	useEffect(() => {
		(async () => {
			const paramData = {
				"shop": shopRecords.shop,
				"selectedDays": selectedDays,
				"actionType": "getStatistic"
			}

			const response = await fetchStatisticApi(paramData);
			setStatisticResponse(response.data);

		})()
	}, [selectedDays]);

	useEffect(() => {
		Cookies.set('storeName', shopRecords.name, {
			expires: 365,
			secure: true,
			sameSite: 'None'
		});
	}, []);

	const showManageReviewPage = (e) => {
		e.preventDefault();
		navigate('/app/manage-review/');
	}
	return (
		<>
			<div className="dashboardwrap max1048 mx-auto">
				{/* <HomeInformationAlert alertKey="home_header_info" /> */}

				{!isEnabledAppEmbed && 
					<EnableAppEmbedAlert alertKey="home_header_info" shopRecords={shopRecords} reviewExtensionId={reviewExtensionId} activeThemeId={activeThemes.id} />
				}

				<div className="dashbbanner">
					<div className="detailbox flxflexi">
						<h2>Ensure your best reviews get seen</h2>
						<p>Use the pop-up widget to build trust faster by making sure your reviews are never missed</p>
						<div className="btnwrap">
							<a href="#" className="revbtn smbtn">Add a pop-up</a>
						</div>
					</div>
					<div className="imagebox flxfix">
						<Image src={bannerImage} />
					</div>
				</div>

				<div className="dashdatawrap">
					<div className="maintitle">
						<h2>Performance Overview</h2>
						<div className="rightbox dropdownwrap ms-auto ddverylightbtn">
							<DropdownButton
								id="dropdown-basic-button"
								title={daysFilterTitle}
								align={'end'}
								onSelect={handleSelect}
							>

								{Object.entries(daysTitles).map(([key, value]) => (
									<Dropdown.Item
										key={key}
										eventKey={key}
										className={`custom-dropdown-item ${key == selectedDays ? 'active' : ''}`}
									>
										{value}
									</Dropdown.Item>
								))}



							</DropdownButton>
						</div>
					</div>
					<div className="dashstetesticsbox">
						<div className="titlebox">
							<h3>Reviews</h3>
							<div className="btnwrap m-0 ms-auto">
								<a href="#" className="revbtn plainlink" onClick={showManageReviewPage}>Manage reviews <i className="twenty-arrow-right"></i></a>
							</div>
						</div>
						<div className="numberboxwrap">
							<div className="numberbox">
								<div className="iconbox flxfix">
									<ReviewRequestsSentIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>{statisticResponse.requestSentcount}</h3>
									<p>Review Requests Sent</p>
								</div>
							</div>
							<div className="numberbox">
								<div className="iconbox flxfix">
									<ReviewsCollectedIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>{statisticResponse.totalReceivedReview}</h3>
									<p>Reviews Received</p>
								</div>
							</div>
							<div className="numberbox">
								<div className="iconbox flxfix">
									<PhotoVideoReviewsIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>{statisticResponse.totalReviewItemsImage}</h3>
									<p>Photo/Video Reviews</p>
								</div>
							</div>
						</div>
						<div className="revenuebox">
							<p><strong>{shopRecords.currency_symbol}{statisticResponse.reviewRevenue}</strong> Reviews-Generated Revenue</p>
							<span data-tooltip-id="my-tooltip-1" className="infolink">
								<InfoFillIcon />
							</span>

							<ReactTooltip
								id="my-tooltip-1"
								place="bottom"
								className="custom-tooltip"
								content="Revenue generated from orders that redeemed a discount for submitting a photo/video review"
							/>
							
						</div>
					</div>
					<div className="dashstetesticsbox">
						<div className="titlebox">
							<h3>Referrals</h3>
							<div className="btnwrap m-0 ms-auto">
								<a href="#" className="revbtn plainlink">Manage referrals <i className="twenty-arrow-right"></i></a>
							</div>
						</div>
						<div className="numberboxwrap">
							<div className="numberbox">
								<div className="iconbox flxfix">
									<SharesDashIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Shares</p>
								</div>
							</div>
							<div className="numberbox">
								<div className="iconbox flxfix">
									<StoreVisitsIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Store Visits</p>
								</div>
							</div>
							<div className="numberbox">
								<div className="iconbox flxfix">
									<OrdersDashIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Orders</p>
								</div>
							</div>
						</div>
						<div className="revenuebox">
							<p><strong>$00</strong> Referrals-Generated Revenue</p>
							<a href="#" className="infolink">
								<InfoFillIcon />
							</a>
						</div>
					</div>
					<div className="dashstetesticsbox">
						<div className="titlebox">
							<h3>Upsells</h3>
							<div className="btnwrap m-0 ms-auto">
								<a href="#" className="revbtn blueblacklightbtn bigbtn"><i className="twenty-Info_icon"></i> Complete Setup</a>
							</div>
						</div>
						<div className="numberboxwrap">
							<div className="numberbox">
								<div className="iconbox flxfix">
									<ImpressionsDashIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Impressions</p>
								</div>
							</div>
							<div className="numberbox">
								<div className="iconbox flxfix">
									<UpsellsDashIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Upsells</p>
								</div>
							</div>
						</div>
						<div className="revenuebox">
							<p><strong>$00</strong> Upsells-Generated Revenue</p>
							<a href="#" className="infolink">
								<InfoFillIcon />
							</a>
						</div>
					</div>

				</div>

			</div>
		</>
	);
}
