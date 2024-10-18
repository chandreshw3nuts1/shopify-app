import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useNavigate } from 'react-router-dom';

import { getShopDetails } from './../utils/getShopDetails';
import HomeInformationAlert from './components/common/home-information-alert';
import EnableAppEmbedAlert from './components/common/enable-app-embed-alert';
import Cookies from 'js-cookie';
import {
	MediaCard, 
	Text, 
	Button, 
	Popover, 
	ActionList, 
	Card, 
	InlineGrid, 
	BlockStack, 
	Divider, 
	Banner, 
	Link, 
	Icon, 
	Tooltip,
	Box,
	Grid, 
} from '@shopify/polaris';
import { 
	ChevronRightIcon, 
	InfoIcon,
	SendIcon,
	StarIcon,
	ImageIcon,
	OrderIcon,
	StoreManagedIcon,
	ShareIcon,
	SettingsIcon,
	ChartHistogramGrowthIcon,
	CashDollarIcon
} from '@shopify/polaris-icons';


const bannerImage = "/images/medium-shot-young-people-with-reviews.jpg"
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
		const activeThemes = await getAllThemes(shopRecords.myshopify_domain, true);
		const isEnabledAppEmbed = await checkAppEmbedAppStatus(shopRecords.myshopify_domain, activeThemes.id);
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
		setPopoverActive(false);
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
		const storeName = shopRecords.myshopify_domain.replace(".myshopify.com", "");

		Cookies.set('storeName', storeName, {
			expires: 365,
			secure: true,
			sameSite: 'None'
		});
	}, []);

	const showManageReviewPage = (e) => {
		e.preventDefault();
		navigate('/app/manage-review/');
	}
	
	
    const redirectToCustomizePage = (e, type = "") => {
        e.preventDefault();
        if (type == 'popupWidget') {
            navigate('/app/widget-customize/popup-widget');
        }

    }

	const [isVisible, setIsVisible] = useState(true);

	// Function to handle the dismiss action
	const handleDismiss = () => {
		setIsVisible(false);
		console.log('yes');
	};



	const [popoverActive, setPopoverActive] = useState(false);

	const togglePopoverActive = useCallback(
		() => setPopoverActive((popoverActive) => !popoverActive),
		[],
	);

	const activator = (
		<Button onClick={togglePopoverActive} disclosure>
			{daysFilterTitle}
		</Button>
	);

	return (
		<>
			<div className="dashboardwrap max1048 mx-auto">
				{/* <HomeInformationAlert alertKey="home_header_info" /> */}

				{!isEnabledAppEmbed && 
					<EnableAppEmbedAlert alertKey="home_header_info" shopRecords={shopRecords} reviewExtensionId={reviewExtensionId} activeThemeId={activeThemes.id} page="index" />
				}
				{isVisible && (
					<MediaCard
						title="Ensure your best reviews get seen"
						primaryAction={{
							content: 'Add a pop-up',
							onAction: (e) => redirectToCustomizePage(e, "popupWidget"),
							outline: true,
						}}
						description="Use the pop-up widget to build trust faster by making sure your reviews are never missed"
						popoverActions={[{content: 'Dismiss', onAction: handleDismiss}]}
					>
						<img
							alt=""
							width="100%"
							height="100%"
							style={{
							objectFit: 'cover',
							objectPosition: 'center',
							}}
							src={bannerImage}
						/>
					</MediaCard>
				)}

				<div className="dashdatawrap">
					<div className="maintitle">
						<Text variant="headingXl" as="h2">Performance Overview</Text>
						<Popover
							active={popoverActive}
							activator={activator}
							autofocusTarget="first-node"
							onClose={togglePopoverActive}
							fullWidth={true}
						>
							<ActionList
							actionRole="menuitem"
							items={
								Object.entries(daysTitles).map(([key, value]) => {
									return{ content: value, active: key === selectedDays , onAction:() => handleSelect(key) }
								})
							}
							/>
						</Popover>
					</div>
					<div className="dashstetesticsbox">
						<Card padding="400" roundedAbove="xs">
							<BlockStack gap="400">
								<InlineGrid columns="1fr auto" alignItems="center">
									<Text as="h3" variant="headingMd">
										Reviews
									</Text>
									<Button
										size="Medium"
										onClick={showManageReviewPage}
										accessibilityLabel="Manage reviews"
										icon={SettingsIcon}
									>
										Manage reviews
									</Button>
								</InlineGrid>
								<Divider borderColor="border" />
								<div className="gridwrap">
									<Grid>
										<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 4, xl: 4}}>
											<card>
												<InlineGrid columns="auto 1fr" alignItems="center" gap="600">
													<Box background="bg-fill-transparent-hover" color="icon" padding="300" borderRadius="200">
														<Icon tone="inherit" source={SendIcon}></Icon>
													</Box>
													<Box>
														<Text as="h3" variant="heading2xl">{statisticResponse.requestSentcount}</Text>
														<Text as="p" variant="bodyMd">Review Requests Sent</Text>
													</Box>
												</InlineGrid>
											</card>
										</Grid.Cell>
										<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
											<card >
												<InlineGrid columns="auto 1fr" alignItems="center" gap="600">
													<Box background="bg-fill-transparent-hover" color="icon" padding="300" borderRadius="200">
														<Icon tone="inherit" source={StarIcon}></Icon>
													</Box>
													<Box>
														<Text as="h3" variant="heading2xl">{statisticResponse.totalReceivedReview}</Text>
														<Text as="p" variant="bodyMd">Reviews Received</Text>
													</Box>
												</InlineGrid>
											</card>
										</Grid.Cell>
										<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
											<card >
												<InlineGrid columns="auto 1fr" alignItems="center" gap="600">
													<Box background="bg-fill-transparent-hover" color="icon" padding="300" borderRadius="200">
														<Icon tone="inherit" source={ImageIcon}></Icon>
													</Box>
													<Box>
														<Text as="h3" variant="heading2xl">{statisticResponse.totalReviewItemsImage}</Text>
														<Text as="p" variant="bodyMd">Photo/Video Reviews</Text>
													</Box>
												</InlineGrid>
											</card>
										</Grid.Cell>
									</Grid>
								</div>
								<Box padding="300" background="bg-surface-info" borderRadius="200">
									<InlineGrid columns="1fr auto" alignItems="center">
										<Text as="p" variant="bodyMd">
											<strong>{shopRecords.currency_symbol}{statisticResponse.reviewRevenue}</strong> Reviews-Generated Revenue
										</Text>
										<Tooltip content="Revenue generated from orders that redeemed a discount for submitting a photo/video review" preferredPosition="above" width="wide" padding="300">
											<Icon source={InfoIcon}></Icon>
										</Tooltip>
									</InlineGrid>
								</Box>
							</BlockStack>
						</Card>
					</div>
					<div className="dashstetesticsbox">
						<Card padding="400" roundedAbove="xs">
							<BlockStack gap="400">
								<InlineGrid columns="1fr auto" alignItems="center">
									<Text as="h3" variant="headingMd">
										Referrals
									</Text>
									<Button
										// variant="primary"
										size="Medium"
										// onClick={showManageReviewPage}
										accessibilityLabel="Manage referrals"
										icon={SettingsIcon}
									>
										Manage referrals
									</Button>
								</InlineGrid>
								<Divider borderColor="border" />
								<div className="gridwrap">
									<Grid>
										<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
											<card>
												<InlineGrid columns="auto 1fr" alignItems="center" gap="600">
													<Box background="bg-fill-transparent-hover" color="icon" padding="300" borderRadius="200">
														<Icon tone="inherit" source={ShareIcon}></Icon>
													</Box>
													<Box>
														<Text as="h3" variant="heading2xl">0</Text>
														<Text as="p" variant="bodyMd">Shares</Text>
													</Box>
												</InlineGrid>
											</card>
										</Grid.Cell>
										<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
											<card >
												<InlineGrid columns="auto 1fr" alignItems="center" gap="600">
													<Box background="bg-fill-transparent-hover" color="icon" padding="300" borderRadius="200">
														<Icon tone="inherit" source={StoreManagedIcon}></Icon>
													</Box>
													<Box>
														<Text as="h3" variant="heading2xl">0</Text>
														<Text as="p" variant="bodyMd">Store Visits</Text>
													</Box>
												</InlineGrid>
											</card>
										</Grid.Cell>
										<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
											<card >
												<InlineGrid columns="auto 1fr" alignItems="center" gap="600">
													<Box background="bg-fill-transparent-hover" color="icon" padding="300" borderRadius="200">
														<Icon tone="inherit" source={OrderIcon}></Icon>
													</Box>
													<Box>
														<Text as="h3" variant="heading2xl">0</Text>
														<Text as="p" variant="bodyMd">Orders</Text>
													</Box>
												</InlineGrid>
											</card>
										</Grid.Cell>
									</Grid>
								</div>
								<Box padding="300" background="bg-surface-info" borderRadius="200">
									<InlineGrid columns="1fr auto" alignItems="center">
										<Text as="p" variant="bodyMd">
											<strong>$0</strong> Referrals-Generated Revenue
										</Text>
										<Icon source={InfoIcon}></Icon>
									</InlineGrid>
								</Box>
							</BlockStack>
						</Card>
					</div>
					<div className="dashstetesticsbox">
						<Card padding="400" roundedAbove="xs">
							<BlockStack gap="400">
								<InlineGrid columns="1fr auto" alignItems="center">
									<Text as="h3" variant="headingMd">
										Upsells
									</Text>
									<Button
										// variant="primary"
										size="medium"
										// onClick={showManageReviewPage}
										accessibilityLabel="Complete Setup"
										icon={SettingsIcon}
									>
										Complete Setup
									</Button>
								</InlineGrid>
								<Divider borderColor="border" />
								<div className="gridwrap">
									<Grid>
										<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
											<card>
												<InlineGrid columns="auto 1fr" alignItems="center" gap="600">
													<Box background="bg-fill-transparent-hover" color="icon" padding="300" borderRadius="200">
														<Icon tone="inherit" source={ChartHistogramGrowthIcon}></Icon>
													</Box>
													<Box>
														<Text as="h3" variant="heading2xl">0</Text>
														<Text as="p" variant="bodyMd">Impressions</Text>
													</Box>
												</InlineGrid>
											</card>
										</Grid.Cell>
										<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 3, lg: 4, xl: 4}}>
											<card >
												<InlineGrid columns="auto 1fr" alignItems="center" gap="600">
													<Box background="bg-fill-transparent-hover" color="icon" padding="300" borderRadius="200">
														<Icon tone="inherit" source={CashDollarIcon}></Icon>
													</Box>
													<Box>
														<Text as="h3" variant="heading2xl">0</Text>
														<Text as="p" variant="bodyMd">Upsells</Text>
													</Box>
												</InlineGrid>
											</card>
										</Grid.Cell>
									</Grid>
								</div>
								<Box padding="300" background="bg-surface-info" borderRadius="200">
									<InlineGrid columns="1fr auto" alignItems="center">
										<Text as="p" variant="bodyMd">
											<strong>$0</strong> Upsells-Generated Revenue
										</Text>
										<Icon source={InfoIcon}></Icon>
									</InlineGrid>
								</Box>
							</BlockStack>
						</Card>
					</div>

				</div>

			</div>
		</>
	);
}
