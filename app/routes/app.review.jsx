import { useState, useCallback } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { getShopDetails } from './../utils/getShopDetails';
import { getCustomQuestions } from './../utils/common';
import { useNavigate } from 'react-router-dom';
import {Icon} from '@shopify/polaris';
import {
	StarIcon,
	ClockIcon,
	DiscountIcon,
	QuestionCircleIcon,
	EmailIcon,
	ChatIcon,
	NoteIcon,
	PlayCircleIcon
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
	Page,
	Layout,
	Text,
	LegacyCard,
	LegacyStack,
	Collapsible,
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
			<Breadcrumb crumbs={crumbs} />

			<Page fullWidth>
				<ReviewPageSidebar />
				<div className='accordian_rowmain'>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								onClick={handleToggleNewReview}
								aria-expanded={openNewReview}
								aria-controls="basic-collapsible"
								className={openNewReview ? 'open' : ''}
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										{/* <i className='twenty-star'></i> */}
										<Icon source={StarIcon} tone="base"/>
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
											Manage New Review
										</Text>
										<Text>
											Choose which reviews you want to auto
											publish and how you want to be notified
											of new reviews
										</Text>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-arrow-down'></i>
									</div>
								</div>
							</div>
							<LegacyStack vertical>
								<Collapsible
									open={openNewReview}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<ManageNewReview settings={settings} shopRecords={shopRecords} />
								</Collapsible>
							</LegacyStack>
						</LegacyCard>
					</Layout.Section>
				</div>



				<div className='accordian_rowmain'>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								onClick={handleToggleReviewRequestTiming}
								aria-expanded={openReviewRequestTiming}
								aria-controls="basic-collapsible"
								className={openReviewRequestTiming ? 'open' : ''}
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										{/* <i className='twenty-review-timing'></i> */}
										<Icon source={ClockIcon} tone="base"/>
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
											Review request timing
										</Text>
										<Text>
											Set the timing of the first review request email sent to your customers
										</Text>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-arrow-down'></i>
									</div>
								</div>
							</div>
							<LegacyStack vertical>
								<Collapsible
									open={openReviewRequestTiming}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<ReviewRequestTiming reviewRequestTimingSettings={reviewRequestTimingSettings} shopRecords={shopRecords} />
								</Collapsible>
							</LegacyStack>
						</LegacyCard>
					</Layout.Section>
				</div>

				<div className='accordian_rowmain'>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								onClick={handleToggleDiscountPhotoVideoReview}
								aria-expanded={openDiscountPhotoVideoReview}
								aria-controls="basic-collapsible"
								className={openDiscountPhotoVideoReview ? 'open' : ''}
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										{/* <i className='twenty-discount'></i> */}
										<Icon source={DiscountIcon} tone="base" />
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
											Discount for photo/video reviews
										</Text>
										<Text>
											Incentivize customers to leave a photo/video review by offering a discount for their next purchase
										</Text>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-arrow-down'></i>
									</div>
								</div>
							</div>
							<LegacyStack vertical>
								<Collapsible
									open={openDiscountPhotoVideoReview}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<DiscountPhotoVideoReview reviewDiscountSettings={reviewDiscountSettings} shopRecords={shopRecords} />
								</Collapsible>
							</LegacyStack>
						</LegacyCard>
					</Layout.Section>
				</div>


				<div className='accordian_rowmain'>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								onClick={handleToggleCustomQuestions}
								aria-expanded={openCustomQuestions}
								aria-controls="basic-collapsible"
								className={openCustomQuestions ? 'open' : ''}
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										{/* <i className='twenty-questions'></i> */}
										<Icon source={QuestionCircleIcon} tone="base" />
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
											Custom Questions
										</Text>
										<Text>
											Add your own custom questions to the review form
										</Text>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-arrow-down'></i>
									</div>
								</div>
							</div>
							<LegacyStack vertical>
								<Collapsible
									open={openCustomQuestions}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<div className='row'>
										<div className='col-md-12'>
											<CustomQuestions customQuestionsData={customQuestionsData} shopRecords={shopRecords} />
										</div>
									</div>
								</Collapsible>
							</LegacyStack>
						</LegacyCard>
					</Layout.Section>
				</div>


				<div className='accordian_rowmain'>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								onClick={handleToggleEmailSettings}
								aria-expanded={openEmailSettings}
								aria-controls="basic-collapsible"
								className={openEmailSettings ? 'open' : ''}
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										{/* <i className='twenty-emails'></i> */}
										<Icon source={EmailIcon} tone="base" />
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
											Emails
										</Text>
										<Text>
											Customize the emails sent to your customers
										</Text>
									</div>
									<div className='flxfix btnwrap m-0'>
										<a href="#" className='revbtn'>Learn More</a>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-arrow-down'></i>
									</div>
								</div>
							</div>
							<LegacyStack vertical>
								<Collapsible
									open={openEmailSettings}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<div className='maininsideacc'>
										{/* Below DIV will be repeat */}
										<div className='insiderowacc' onClick={() => showEmailSettingsForm("review-request")}>
											<div className='titledetail flxflexi'>
												<h6>Review Request</h6>
												<p>Encourage your customers to leave a review with an automated email</p>
											</div>
											<div className='flxfix btnwrap m-0'>
												<a href="#" className='revbtn'>Learn More</a>
											</div>
											<div className='flxfix arrowicon'>
												<i className="twenty-longarrow-right"></i>
											</div>
										</div>

										<div className='insiderowacc' onClick={() => showEmailSettingsForm("review-request-reminder")}>
											<div className='titledetail flxflexi'>
												<h6>Review request reminder</h6>
												<p>Send a second review request to customers who did not submit a review yet
												</p>
											</div>
											<div className='flxfix btnwrap m-0'>
												<a href="#" className='revbtn'>Learn More</a>
											</div>
											<div className='flxfix arrowicon'>
												<i className="twenty-longarrow-right"></i>
											</div>
										</div>

										<div className='insiderowacc' onClick={() => showEmailSettingsForm("photo-video-reminder")}>
											<div className='titledetail flxflexi'>
												<h6>Photo/video reminder</h6>
												<p>Remind customers who submitted a text review to add a photo/video
												</p>
											</div>
											<div className='flxfix btnwrap m-0'>
												<a href="#" className='revbtn'>Learn More</a>
											</div>
											<div className='flxfix arrowicon'>
												<i className="twenty-longarrow-right"></i>
											</div>
										</div>

										<div className='insiderowacc' onClick={() => showEmailSettingsForm("review-reply")}>
											<div className='titledetail flxflexi'>
												<h6>Reply to review</h6>
												<p>Inform your customers once you publicly reply to their review</p>
											</div>

											<div className='flxfix arrowicon'>
												<i className="twenty-longarrow-right"></i>
											</div>
										</div>

										<div className='insiderowacc' onClick={() => showEmailSettingsForm("discount-photo-video-review")}>
											<div className='titledetail flxflexi'>
												<h6>Discount for photo/video review</h6>
												<p>Send customers a next-purchase code after submitting a review with a photo/video</p>
											</div>

											<div className='flxfix arrowicon'>
												<i className="twenty-longarrow-right"></i>
											</div>
										</div>

										<div className='insiderowacc' onClick={() => showEmailSettingsForm("discount-photo-video-review-reminder")}>
											<div className='titledetail flxflexi'>
												<h6>Discount reminder for photo/video review</h6>
												<p>Remind your customers to use their next-purchase discount if they haven't used it yet</p>
											</div>

											<div className='flxfix arrowicon'>
												<i className="twenty-longarrow-right"></i>
											</div>
										</div>

										<div className='insiderowacc' onClick={() => showEmailSettingsForm("resend-review-request")}>
											<div className='titledetail flxflexi'>
												<h6>Resend review request email </h6>
												<p>Resend review request email to your customers.</p>
											</div>

											<div className='flxfix arrowicon'>
												<i className="twenty-longarrow-right"></i>
											</div>
										</div>

										{/* Above DIV will be repeat */}
										<InformationAlert alertKey="email_review" alertType="email_appearance" colorTheme="primarybox mt-24" pageSlug="/app/branding" className="mt-24" alertClose/>

									</div>
								</Collapsible>
							</LegacyStack>
						</LegacyCard>
					</Layout.Section>
				</div>


				<div className='accordian_rowmain' onClick={showManualRequestForm}>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								aria-controls="basic-collapsible"
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										{/* <i className='twenty-manualreview'></i> */}
										<Icon source={ChatIcon} tone="base" />
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
											Manual review requests
										</Text>
										<Text>
											Send one-time emails to collect reviews of your products
										</Text>
									</div>
									<div className='flxfix btnwrap m-0'>
										<a href="#" className='revbtn'>Learn More</a>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-longarrow-right'></i>
									</div>
								</div>
							</div>
						</LegacyCard>
					</Layout.Section>
				</div>



				<div className='accordian_rowmain' onClick={showReviewFormSettings}>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								aria-controls="basic-collapsible"
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										{/* <i className='twenty-reviewform'></i> */}
										<Icon source={NoteIcon} tone="base" />
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
											Review Form
										</Text>
										<Text>
											Customize the form your customers use when writing a review
										</Text>
									</div>
									<div className='flxfix btnwrap m-0'>
										<a href="#" className='revbtn'>Learn More</a>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-longarrow-right'></i>
									</div>
								</div>
							</div>
						</LegacyCard>
					</Layout.Section>
				</div>


				<div className='accordian_rowmain'>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								onClick={handleToggleVideoSettings}
								aria-expanded={openVideoSettings}
								aria-controls="basic-collapsible"
								className={openVideoSettings ? 'open' : ''}
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										{/* <i className='twenty-star'></i> */}
										<Icon source={PlayCircleIcon} tone="base" />
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
											Video reviews
										</Text>
										<Text>
											Collect and display video reviews of your happy customers
										</Text>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-arrow-down'></i>
									</div>
								</div>
							</div>
							<LegacyStack vertical>
								<Collapsible
									open={openVideoSettings}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<ManageVideoSettings generalSettings={generalSettings} shopRecords={shopRecords} />
								</Collapsible>
							</LegacyStack>
						</LegacyCard>
					</Layout.Section>
				</div>

			</Page>
		</>
	);
};

export default ReviewPage;
