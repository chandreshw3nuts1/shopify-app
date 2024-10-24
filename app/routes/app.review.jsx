import { useState, useCallback } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getShopDetails } from './../utils/getShopDetails';
import { getCustomQuestions } from './../utils/common';
import { useNavigate } from 'react-router-dom';
import {
	StarIcon,
	ClockIcon,
	DiscountIcon,
	QuestionCircleIcon,
	EmailIcon,
	ChatIcon,
	NoteIcon,
	PlayCircleIcon,
	ArrowRightIcon,
	ChevronDownIcon,
} from '@shopify/polaris-icons';

import Breadcrumb from './components/Breadcrumb';
import ReviewPageSidebar from './components/headerMenu/ReviewPageSidebar';
import CustomQuestions from "./components/collectReview/CustomQuestions";
import ManageNewReview from "./components/collectReview/ManageNewReview";
import ReviewRequestTiming from "./components/collectReview/ReviewRequestTiming";
import DiscountPhotoVideoReview from "./components/collectReview/DiscountPhotoVideoReview";
import ManageVideoSettings from "./components/collectReview/ManageVideoSettings";

import InformationAlert from './components/common/information-alert';

import settings from './models/settings';
import reviewRequestTimingSettings from './models/reviewRequestTimingSettings';
import reviewDiscountSettings from './models/reviewDiscountSettings';
import generalSettings from './models/generalSettings';

import {
	Button, 
	Icon,
	Page,
	Layout,
	Text,
	Collapsible,
	Card,
	Box,
	Grid, 
	Bleed,
	Divider,
	InlineStack,
	BlockStack,
	InlineGrid,
	Banner,
	Link,
} from '@shopify/polaris';
const collectionName = 'settings';

export async function loader({ request }) {
	try {
		const shopRecords = await getShopDetails(request);

		const settingsModel = await settings.findOne({
			shop_id: shopRecords._id
		});
		const reviewRequestTimingSettingsModel = await reviewRequestTimingSettings.findOne({
			shop_id: shopRecords._id
		});


		const reviewDiscountSettingsModel = await reviewDiscountSettings.findOne({
			shop_id: shopRecords._id
		});

		const customQuestionsData = await getCustomQuestions({
			shop_id: shopRecords._id,
		});

		const generalSettingsModel = await generalSettings.findOne({
			shop_id: shopRecords._id
		});
		

		return json({ settings: settingsModel, shopRecords: shopRecords, customQuestionsData: customQuestionsData, reviewRequestTimingSettings: reviewRequestTimingSettingsModel, reviewDiscountSettings: reviewDiscountSettingsModel, generalSettingsModel: generalSettingsModel });
	} catch (error) {
		return json(
			{ error: 'Failed to fetch records from MongoDB' },
			{ status: 500 }
		);
	}
}

const ReviewPage = () => {
	const loaderData = useLoaderData();
	const navigate = useNavigate();

	const settings = loaderData.settings;
	const customQuestionsData = loaderData.customQuestionsData;
	const shopRecords = loaderData.shopRecords;
	const reviewRequestTimingSettings = loaderData.reviewRequestTimingSettings;
	const reviewDiscountSettings = loaderData.reviewDiscountSettings;
	const generalSettings = loaderData.generalSettingsModel;
	
	const [crumbs, setCrumbs] = useState([
		{ title: "Review", "link": "./../review" },
		{ title: "Collect review", link: "" },
	]);
	const [openNewReview, setOpenNewReview] = useState(false);
	const [openCustomQuestions, setOpenCustomQuestions] = useState(false);
	const [openReviewRequestTiming, setOpenReviewRequestTiming] = useState(false);
	const [openDiscountPhotoVideoReview, setOpenDiscountPhotoVideoReview] = useState(false);
	const [openEmailSettings, setOpenEmailSettings] = useState(false);
	const [openVideoSettings, setOpenVideoSettings] = useState(false);

	const handleToggleNewReview = useCallback(() => setOpenNewReview(openNewReview => !openNewReview), []);
	const handleToggleCustomQuestions = useCallback(() => setOpenCustomQuestions(openCustomQuestions => !openCustomQuestions), []);
	const handleToggleReviewRequestTiming = useCallback(() => setOpenReviewRequestTiming(openReviewRequestTiming => !openReviewRequestTiming), []);
	const handleToggleDiscountPhotoVideoReview = useCallback(() => setOpenDiscountPhotoVideoReview(openDiscountPhotoVideoReview => !openDiscountPhotoVideoReview), []);


	const handleToggleEmailSettings = useCallback(() => setOpenEmailSettings(openEmailSettings => !openEmailSettings), []);
	const handleToggleVideoSettings = useCallback(() => setOpenVideoSettings(openVideoSettings => !openVideoSettings), []);

	const showManualRequestForm = () => {
		navigate('/app/manual-review-requests/');
	}

	const showReviewFormSettings = () => {
		navigate('/app/review-form-settings/');
	}

	const showEmailSettingsForm = (emailType = "") => {
		navigate(`/app/emails/${emailType}/`);
	}

	return (
		<>
			<InlineStack align='center'>
				<Box maxWidth='1048px' width='100%'>
					<Breadcrumb crumbs={crumbs} />
				</Box>
			</InlineStack>
			<Page fullWidth>
				<InlineStack align='center'>
					<Box maxWidth='1048px' width='100%'>

						<ReviewPageSidebar />
						
						<div className='accordian_rowmain'>
							<Card gap="200" padding='0'>
								<InlineGrid columns="1fr auto" alignItems="center">
									<div
										onClick={handleToggleNewReview}
										aria-expanded={openNewReview}
										aria-controls="basic-collapsible"
										className={openNewReview ? 'open' : ''}
									>
										<Box style={{cursor: 'pointer'}}>
											<Box padding='400'>
												<InlineGrid columns="auto 1fr" gap='400' alignItems='center'>
													<div className='bigiconbox'>
														<Icon source={StarIcon} tone="base" />
													</div>
													<BlockStack gap={100}>
														<Text as='h3' variant='headingMd'>Manage New Review</Text>
														<Text tone="subdued">Choose which reviews you want to auto publish and how you want to be notified of new reviews</Text>
													</BlockStack>
												</InlineGrid>
											</Box>
										</Box>
									</div>
									<Box padding='400'>
										<InlineGrid columns="1fr auto" gap={200}>
											<Icon source={ChevronDownIcon} tone="base" />
										</InlineGrid>
									</Box>
								</InlineGrid>
								<Collapsible
									open={openNewReview}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<Box paddingInline='400' paddingBlockEnd='400'>
										<ManageNewReview settings={settings} shopRecords={shopRecords} />
									</Box>
								</Collapsible>
							</Card>
						</div>

						<div className='accordian_rowmain'>
							<Card gap="200" padding='0'>
								<InlineGrid columns="1fr auto" alignItems="center">
									<div
										onClick={handleToggleReviewRequestTiming}
										aria-expanded={openReviewRequestTiming}
										aria-controls="basic-collapsible"
										className={openReviewRequestTiming ? 'open' : ''}
									>
										<Box style={{cursor: 'pointer'}}>
											<Box padding='400'>
												<InlineGrid columns="auto 1fr" gap='400' alignItems='center'>
													<div className='bigiconbox'>
														<Icon source={ClockIcon} tone="base" />
													</div>
													<BlockStack gap={100}>
														<Text as='h3' variant='headingMd'>Review request timing</Text>
														<Text tone="subdued">Set the timing of the first review request email sent to your customers</Text>
													</BlockStack>
												</InlineGrid>
											</Box>
										</Box>
									</div>
									<Box padding='400'>
										<InlineGrid columns="1fr auto" gap={200}>
											<Icon source={ChevronDownIcon} tone="base" />
										</InlineGrid>
									</Box>
								</InlineGrid>
								<Collapsible
									open={openReviewRequestTiming}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<Box paddingInline='400' paddingBlockEnd='400'>
										<ReviewRequestTiming reviewRequestTimingSettings={reviewRequestTimingSettings} shopRecords={shopRecords} />
									</Box>
								</Collapsible>
							</Card>
						</div>

						<div className='accordian_rowmain'>
							<Card gap="200" padding='0'>
								<InlineGrid columns="1fr auto" alignItems="center">
									<div
										onClick={handleToggleDiscountPhotoVideoReview}
										aria-expanded={openDiscountPhotoVideoReview}
										aria-controls="basic-collapsible"
										className={openDiscountPhotoVideoReview ? 'open' : ''}
									>
										<Box style={{cursor: 'pointer'}}>
											<Box padding='400'>
												<InlineGrid columns="auto 1fr" gap='400' alignItems='center'>
													<div className='bigiconbox'>
														<Icon source={DiscountIcon} tone="base" />
													</div>
													<BlockStack gap={100}>
														<Text as='h3' variant='headingMd'>Discount for photo/video reviews</Text>
														<Text tone="subdued">Incentivize customers to leave a photo/video review by offering a discount for their next purchase</Text>
													</BlockStack>
												</InlineGrid>
											</Box>
										</Box>
									</div>
									<Box padding='400'>
										<InlineGrid columns="1fr auto" gap={200}>
											<Icon source={ChevronDownIcon} tone="base" />
										</InlineGrid>
									</Box>
								</InlineGrid>
								
								<Collapsible
									open={openDiscountPhotoVideoReview}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<Box paddingInline='400' paddingBlockEnd='400'>
										<DiscountPhotoVideoReview reviewDiscountSettings={reviewDiscountSettings} shopRecords={shopRecords} />
									</Box>
								</Collapsible>
								
							</Card>
						</div>

						<div className='accordian_rowmain'>
							<Card gap="200" padding='0'>
								<InlineGrid columns="1fr auto" alignItems="center">
									<div
										onClick={handleToggleCustomQuestions}
										aria-expanded={openCustomQuestions}
										aria-controls="basic-collapsible"
										className={openCustomQuestions ? 'open' : ''}
									>
										<Box style={{cursor: 'pointer'}}>
											<Box padding='400'>
												<InlineGrid columns="auto 1fr" gap='400' alignItems='center'>
													<div className='bigiconbox'>
														<Icon source={QuestionCircleIcon} tone="base" />
													</div>
													<BlockStack gap={100}>
														<Text as='h3' variant='headingMd'>Custom Questions</Text>
														<Text tone="subdued">Add your own custom questions to the review form</Text>
													</BlockStack>
												</InlineGrid>
											</Box>
										</Box>
									</div>
									<Box padding='400'>
										<InlineGrid columns="1fr auto" gap={200}>
											<Icon source={ChevronDownIcon} tone="base" />
										</InlineGrid>
									</Box>
								</InlineGrid>
								<Box>
									<Collapsible
										open={openCustomQuestions}
										id="basic-collapsible"
										transition={{
											duration: '300ms',
											timingFunction: 'ease-in-out',
										}}
										expandOnPrint
									>
										<Box paddingInline='400' paddingBlockEnd='400'>
											<CustomQuestions customQuestionsData={customQuestionsData} shopRecords={shopRecords} />
										</Box>
											
									</Collapsible>
								</Box>
							</Card>
						</div>

						<div className='accordian_rowmain'>
							<Card padding='0' gap="200">
								<InlineGrid columns="1fr auto" alignItems="center">
									<div
										onClick={handleToggleEmailSettings}
										aria-expanded={openEmailSettings}
										aria-controls="basic-collapsible"
										className={openEmailSettings ? 'open' : ''}
									>
										<Box style={{cursor: 'pointer'}}>
											<Box padding='400'>
												<InlineGrid columns="auto 1fr" gap='400' alignItems='center'>
													<div className='bigiconbox'>
														<Icon source={EmailIcon} tone="base" />
													</div>
													<BlockStack gap={100}>
														<Text as='h3' variant='headingMd'>Emails</Text>
														<Text tone="subdued">Customize the emails sent to your customers</Text>
													</BlockStack>
												</InlineGrid>
											</Box>
										</Box>
									</div>
									<Box padding='400'>
										<InlineGrid columns="1fr auto" gap={200}>
											<Button variant='primary'>Learn More</Button>
											<Icon source={ChevronDownIcon} tone="base" />
										</InlineGrid>
									</Box>
								</InlineGrid>
								<Collapsible
									open={openEmailSettings}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<Box paddingInline='400' paddingBlockEnd='400'>
										<Card>
											<BlockStack gap={400}>
												{/* Below DIV will be repeat */}
												<InlineGrid columns="1fr auto" alignItems="center" >
													<Box style={{cursor: 'pointer'}} onClick={() => showEmailSettingsForm("review-request")}>
														<BlockStack gap={100} >
															<Text as='h3' variant='headingMd'>Review Request</Text>
															<Text>Encourage your customers to leave a review with an automated email</Text>
														</BlockStack>
													</Box>
													<InlineGrid columns="1fr auto" gap={200}>
														<Button fullWidth={true} variant='primary'>Learn More</Button>
														<Icon source={ArrowRightIcon} tone="base" />
													</InlineGrid>
												</InlineGrid>
												<Divider />
												<InlineGrid columns="1fr auto" alignItems="center" >
													<Box style={{cursor: 'pointer'}} onClick={() => showEmailSettingsForm("review-request-reminder")}>
														<BlockStack gap={100}>
															<Text as='h3' variant='headingMd'>Review request reminder</Text>
															<Text>Send a second review request to customers who did not submit a review yet</Text>
														</BlockStack>
													</Box>
													<InlineGrid columns="1fr auto" gap={200}>
														<Button fullWidth={true} variant='primary'>Learn More</Button>
														<Icon source={ArrowRightIcon} tone="base" />
													</InlineGrid>
												</InlineGrid>
												<Divider />
												<InlineGrid columns="1fr auto" alignItems="center" >
													<Box style={{cursor: 'pointer'}} onClick={() => showEmailSettingsForm("photo-video-reminder")}>
														<BlockStack gap={100}>
															<Text as='h3' variant='headingMd'>Photo/video reminder</Text>
															<Text>Remind customers who submitted a text review to add a photo/video</Text>
														</BlockStack>
													</Box>
													<InlineGrid columns="1fr auto" gap={200}>
														<Button fullWidth={true} variant='primary'>Learn More</Button>
														<Icon source={ArrowRightIcon} tone="base" />
													</InlineGrid>
												</InlineGrid>
												<Divider />
												<InlineGrid columns="1fr auto" alignItems="center" >
													<Box style={{cursor: 'pointer'}} onClick={() => showEmailSettingsForm("review-reply")}>
														<BlockStack gap={100}>
															<Text as='h3' variant='headingMd'>Reply to review</Text>
															<Text>Inform your customers once you publicly reply to their review</Text>
														</BlockStack>
													</Box>
													<InlineGrid columns="1fr auto" gap={200}>
														<Icon source={ArrowRightIcon} tone="base" />
													</InlineGrid>
												</InlineGrid>
												<Divider />
												<InlineGrid columns="1fr auto" alignItems="center" >
													<Box style={{cursor: 'pointer'}} onClick={() => showEmailSettingsForm("discount-photo-video-review")}>
														<BlockStack gap={100}>
															<Text as='h3' variant='headingMd'>Discount for photo/video review</Text>
															<Text>Send customers a next-purchase code after submitting a review with a photo/video</Text>
														</BlockStack>
													</Box>
													<InlineGrid columns="1fr auto" gap={200}>
														<Icon source={ArrowRightIcon} tone="base" />
													</InlineGrid>
												</InlineGrid>
												<Divider />
												<InlineGrid columns="1fr auto" alignItems="center" >
													<Box style={{cursor: 'pointer'}} onClick={() => showEmailSettingsForm("discount-photo-video-review-reminder")}>
														<BlockStack gap={100}>
															<Text as='h3' variant='headingMd'>Discount reminder for photo/video review</Text>
															<Text>Remind your customers to use their next-purchase discount if they haven't used it yet</Text>
														</BlockStack>
													</Box>
													<InlineGrid columns="1fr auto" gap={200}>
														<Icon source={ArrowRightIcon} tone="base" />
													</InlineGrid>
												</InlineGrid>
												<Divider />
												<InlineGrid columns="1fr auto" alignItems="center" >
													<Box style={{cursor: 'pointer'}} onClick={() => showEmailSettingsForm("resend-review-request")}>
														<BlockStack gap={100}>
															<Text as='h3' variant='headingMd'>Resend review request email</Text>
															<Text>Resend review request email to your customers.</Text>
														</BlockStack>
													</Box>
													<InlineGrid columns="1fr auto" gap={200}>
														<Icon source={ArrowRightIcon} tone="base" />
													</InlineGrid>
												</InlineGrid>
												{/* Above DIV will be repeat */}
												<Banner onDismiss={() => {}}>
													<Text>
													Your email appearance settings can be customized on the{' '}
														<Link url="/app/branding">Branding</Link> page.
													</Text>
												</Banner>
											</BlockStack>
										</Card>
									</Box>
									{/* <div className='maininsideacc'>
										<InformationAlert alertKey="email_review" alertType="email_appearance" colorTheme="primarybox mt-24" pageSlug="/app/branding" className="mt-24" alertClose/>
									</div> */}
								</Collapsible>
							</Card>
						</div>

						<div className='accordian_rowmain'>
							<Card padding='0'>
								<InlineGrid columns="1fr auto" alignItems="center" >
									<Box style={{cursor: 'pointer'}} onClick={showManualRequestForm}>
										<Box padding='400'>
											<InlineGrid columns="auto 1fr" gap='400' alignItems='center'>
												<div className='bigiconbox'>
													<Icon source={ChatIcon} tone="base" />
												</div>
												<BlockStack gap={100}>
													<Text as='h3' variant='headingMd'>Manual review requests</Text>
													<Text tone="subdued">Send one-time emails to collect reviews of your products</Text>
												</BlockStack>
											</InlineGrid>
										</Box>
									</Box>
									<Box padding='400'>
										<InlineGrid columns="1fr auto" gap={200}>
											<Button fullWidth={true} variant='primary'>Learn More</Button>
											<Icon source={ArrowRightIcon} tone="base" />
										</InlineGrid>
									</Box>
								</InlineGrid>
							</Card>
						</div>

						<div className='accordian_rowmain'>
							<Card padding='0'>
								<InlineGrid columns="1fr auto" alignItems="center" >
									<Box style={{cursor: 'pointer'}} onClick={showReviewFormSettings}>
										<Box padding='400'>
											<InlineGrid columns="auto 1fr" gap='400' alignItems='center'>
												<div className='bigiconbox'>
													<Icon source={NoteIcon} tone="base" />
												</div>
												<BlockStack gap={100}>
													<Text as='h3' variant='headingMd'>Review Form</Text>
													<Text tone="subdued">Customize the form your customers use when writing a review</Text>
												</BlockStack>
											</InlineGrid>
										</Box>
									</Box>
									<Box padding='400'>
										<InlineGrid columns="1fr auto" gap={200}>
											<Button fullWidth={true} variant='primary'>Learn More</Button>
											<Icon source={ArrowRightIcon} tone="base" />
										</InlineGrid>
									</Box>
								</InlineGrid>
							</Card>
						</div>

						<div className='accordian_rowmain'>
							<Card padding='0' gap="200">
								<InlineGrid columns="1fr auto" alignItems="center" >
									<div
										onClick={handleToggleVideoSettings}
										aria-expanded={openVideoSettings}
										aria-controls="basic-collapsible"
										className={openVideoSettings ? 'open' : ''}
									>
										<Box style={{cursor: 'pointer'}}>
											<Box padding='400'>
												<InlineGrid columns="auto 1fr" gap='400' alignItems='center'>
													<div className='bigiconbox'>
														<Icon source={PlayCircleIcon} tone="base" />
													</div>
													<BlockStack gap={100}>
														<Text as='h3' variant='headingMd'>Video reviews</Text>
														<Text tone="subdued">Collect and display video reviews of your happy customers</Text>
													</BlockStack>
												</InlineGrid>
											</Box>
										</Box>
									</div>
									<Box padding='400'>
										<InlineGrid columns="1fr auto" gap={200}>
											<Icon source={ChevronDownIcon} tone="base" />
										</InlineGrid>
									</Box>
								</InlineGrid>
								
								<Box>
									<Collapsible
										open={openVideoSettings}
										id="basic-collapsible"
										transition={{
											duration: '300ms',
											timingFunction: 'ease-in-out',
										}}
										expandOnPrint
									>
										<Box paddingInline='400' paddingBlockEnd='400'>
											<ManageVideoSettings generalSettings={generalSettings} shopRecords={shopRecords} />
										</Box>
									</Collapsible>
								</Box>
							</Card>
						</div>
						
					</Box>
				</InlineStack>
			</Page>
		</>
	);
};

export default ReviewPage;
