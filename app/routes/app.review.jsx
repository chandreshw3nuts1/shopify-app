import { useEffect, useState, useCallback } from 'react';
import { json } from '@remix-run/node';
import { useActionData, useNavigation, useSubmit } from '@remix-run/react';
import { useLoaderData } from '@remix-run/react';
import { mongoConnection } from './../utils/mongoConnection';
import { getShopDetails } from './../utils/getShopDetails';
import { findOneRecord } from './../utils/common';
import Breadcrumb from './components/Breadcrumb';
import ReviewPageSidebar from './components/headerMenu/ReviewPageSidebar';
import styles from './components/review.module.css';
import CustomQuestions from "./components/collect-review/CustomQuestions";
import { toast } from 'react-toastify';

import {
	Page,
	Layout,
	Text,
	Card,
	Button,
	BlockStack,
	Box,
	Link,
	InlineStack,
	Grid,
	List,
	LegacyCard,
	LegacyStack,
	Collapsible,
	TextContainer,
	Checkbox,
	Select,
	TextField
} from '@shopify/polaris';
const collectionName = 'settings';

export async function loader({ request }) {
	try {
		const shopRecords = await getShopDetails(request);

		const db = await mongoConnection();
		const settings = await findOneRecord(collectionName,{
			shop_id: shopRecords._id,
		});
		const customQuestionsData =  await db.collection('custom-questions')
		.find({
			shop_id : shopRecords._id,
		})
		.toArray();
		return json({"settings" : settings, "shopRecords" : shopRecords, "customQuestionsData" : customQuestionsData});
	} catch (error) {
		console.error('Error fetching records from MongoDB:', error);
		return json(
			{ error: 'Failed to fetch records from MongoDB' },
			{ status: 500 }
		);
	}
}
export const action = async ({ request }) => {
	let settings = {
		name: 'abc',
		method: request.method,
	};
	console.log('submit action');

	return json(settings);
};

const ReviewPage = () => {
	const loaderData = useLoaderData();
	const settings = loaderData.settings;
	console.log(settings);
	const customQuestionsData = loaderData.customQuestionsData;
	const shopRecords = loaderData.shopRecords;
	const [isChecked, setIsChecked] = useState(
		settings?.autoPublishReview || false
	);
	const [selected, setSelected] = useState(
		settings?.reviewPublishMode || false
	);

	const actionData = useActionData();
	const submit = useSubmit();

	const [crumbs, setCrumbs] = useState([
		{ title: 'Review', link: '' },
		{ title: 'Collect Review', link: '' },
	]);
	const [openNewReview, setOpenNewReview] = useState(false);
	const [openCustomQuestions, setOpenCustomQuestions] = useState(false);
    const [reviewNotificationEmail, setReviewNotificationEmail] = useState(
		settings?.reviewNotificationEmail || ''
	);
	const [initialReviewNotificationEmail, setInitialReviewNotificationEmail] = useState(
		settings?.reviewNotificationEmail || ''
	);
	const [isValidReviewNotificationEmail, setIsValidReviewNotificationEmail] = useState(true);
	
	
	const [isCheckedReviewNotification, setIsCheckedReviewNotification] = useState(
		settings?.reviewNotification || false
	);


	const [open, setOpen] = useState(false);

	const handleToggleNewReview = useCallback(() => setOpenNewReview(openNewReview => !openNewReview),[]);
	const handleToggleCustomQuestions = useCallback(() => setOpenCustomQuestions(openCustomQuestions => !openCustomQuestions),[]);

	const handleToggle = useCallback(() => setOpen(open => !open), []);

	const handleSelectChange = async (value, name) => {
		const updateData = {
			field: name,
			value: value,
			oid: settings._id,
		};
		const response  = await fetch('/api/collect-review-setting', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData),
		});
		const data = await response.json();
		if(data.status == 200) {
			toast.success(data.message);
		} else {
			toast.error(data.message);
		}

		setSelected(value); // Update the state with the selected value
	};

	const options = [
		{ label: 'All reviews', value: 'auto' },
		{ label: '5 star reviews', value: '5star' },
		{ label: '4 stars and up', value: 'above4' },
		{ label: '3 stars and up', value: 'above3' },
	];

	const handleCheckboxChange = async event => {
		try {

			const myKey = event.target.name;
			const updateData = {
				field: event.target.name,
				value: !isChecked,
				oid: settings._id,
			};
			const response = await fetch('/api/collect-review-setting', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateData),
			});
			const data = await response.json();
			if(data.status == 200) {
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}
		setIsChecked(!isChecked);
	};
 
	
	const handleReviewNotificationEmailChange = useCallback((value) => {
		setReviewNotificationEmail(value);
	}, []);

	const handleReviewNotificationEmailBlur = async (e) => {

		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		
		setIsValidReviewNotificationEmail(false);

		if (regex.test(e.target.value) || e.target.value == '') {

			setIsValidReviewNotificationEmail(true);

			if (initialReviewNotificationEmail != e.target.value) {
				const updateData = {
					field: e.target.name,
					value: reviewNotificationEmail,
					oid: settings._id,
				};
				const response = await fetch('/api/collect-review-setting', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updateData),
				});

				const data = await response.json();
				if(data.status == 200) {
					toast.success(data.message);
				} else {
					toast.error(data.message);
				}

				setInitialReviewNotificationEmail(e.target.value);

			}

		}
	};
	
	const handleReviewNotificationCheckboxchange = async event => {
		try {
			const myKey = event.target.name;
			const updateData = {
				field: event.target.name,
				value: !isCheckedReviewNotification,
				oid: settings._id,
			};
			const response = await fetch('/api/collect-review-setting', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateData),
			});
			const data = await response.json();
			if(data.status == 200) {
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}
		setIsCheckedReviewNotification(!isCheckedReviewNotification);
	};
	return (
		<>
			<Breadcrumb crumbs={crumbs} />

			<Page fullWidth>
				<div className="row">
					<div className="col-sm-12">
						<ReviewPageSidebar />
					</div>
					<div className="col-sm-12">
						<div className='accordian_rowmain'>
							<Layout.Section>
								<LegacyCard sectioned>
									<div
										onClick={handleToggleNewReview}
										ariaExpanded={openNewReview}
										ariaControls="basic-collapsible"
										className={openNewReview ? 'open' : ''}
									>
										<div className='flxrow acctitle'>
											<div className='flxfix iconbox'>
												<i className='twenty-star'></i>
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
											<div className='row'>
											<div className='col-md-6'>
													<div className='collectreviewformbox'>
														<Card>
														{isChecked && 
															<div className="formcontent" >
																<Select
																	name="reviewPublishMode"
																	id="reviewPublishMode"
																	helpText="Select which reviews you want to auto-publish. Any changes will only affect new reviews."
																	options={options}
																	onChange={
																		handleSelectChange
																	}
																	value={selected}
																/>
															</div>
														}


															
															<div className="bottomcheckrow">
																<div className="form-check form-switch">
																	<input
																		checked={
																			isChecked
																		}
																		onChange={
																			handleCheckboxChange
																		}
																		className="form-check-input"
																		type="checkbox"
																		role="switch"
																		name="autoPublishReview"
																		id="flexSwitchCheckChecked"
																	/>
																	<label
																		className="form-check-label"
																		for="flexSwitchCheckChecked"
																	>
																		Auto-publish new reviews
																	</label>
																</div>
															</div>
														</Card>
													</div>
												</div>




												<div className='col-md-6'>
													<div className='collectreviewformbox'>
														<Card>
														
															<div className="formcontent" >
																 <TextField
																	value={reviewNotificationEmail}
																	onChange={ handleReviewNotificationEmailChange } 
																	onBlur={ handleReviewNotificationEmailBlur }
																	name="reviewNotificationEmail"
																	autoComplete="off"
																	helpText={`Leave empty to have notifications sent to: ${shopRecords.email}`}
																	placeholder='Notification Email'
																/>
																{!isValidReviewNotificationEmail && <small class="text-danger">Email address is invalid.</small>}

															</div>


															
															<div className="bottomcheckrow">
																<div className="form-check form-switch">
																	<input
																		checked={
																			isCheckedReviewNotification
																		}
																		onChange={
																			handleReviewNotificationCheckboxchange
																		}
																		className="form-check-input"
																		type="checkbox"
																		role="switch"
																		name="reviewNotification"
																		id="revNotiSwitchCheckChecked"
																	/>
																	<label
																		className="form-check-label"
																		for="revNotiSwitchCheckChecked"
																	>
																		Review notifications
																	</label>
																</div>
															</div>
														</Card>
													</div>
												</div>

												
											</div>
										</Collapsible>
									</LegacyStack>
								</LegacyCard>
							</Layout.Section>
						</div>
					</div>

					<div className="col-sm-12">
						<div className='accordian_rowmain'>
							<Layout.Section>
								<LegacyCard sectioned>
									<div
										onClick={handleToggleCustomQuestions}
										ariaExpanded={openCustomQuestions}
										ariaControls="basic-collapsible"
										className={openCustomQuestions ? 'open' : ''}
									>
										<div className='flxrow acctitle'>
											<div className='flxfix iconbox'>
												<i className='twenty-star'></i>
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
												<div className='col-md-6'>
													<div className='collectreviewformbox'>
														<Card>
															<CustomQuestions customQuestionsData={customQuestionsData} shopRecords={shopRecords} />
														</Card>
													</div>
												</div>
											</div>
										</Collapsible>
									</LegacyStack>
								</LegacyCard>
							</Layout.Section>
						</div>
					</div>
				</div>
			</Page>
		</>
	);
};

export default ReviewPage;
