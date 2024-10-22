import { useState, useCallback } from 'react';
import {
	Card,
	Select,
	TextField,
	Box,
	Grid, 
	BlockStack,
	Checkbox,
} from '@shopify/polaris';
import settingsJson from './../../../utils/settings.json';


export default function ManageNewReview({ settings, shopRecords }) {

	const [isChecked, setIsChecked] = useState(
		settings?.autoPublishReview || false
	);
	const [selected, setSelected] = useState(
		settings?.reviewPublishMode || false
	);
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

	const [isAddOnsiteReview, setIsAddOnsiteReview] = useState(
		settings?.addOnsiteReview || false
	);

	const handleSelectChange = async (value, name) => {
		const updateData = {
			field: name,
			value: value,
			shop: shopRecords.shop
		};
		const response = await fetch('/api/collect-review-setting', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData),
		});
		const data = await response.json();
		if (data.status == 200) {
			shopify.toast.show(data.message, {
				duration: settingsJson.toasterCloseTime
			});
		} else {
			shopify.toast.show(data.message, {
				duration: settingsJson.toasterCloseTime,
				isError: true
			});
		}

		setSelected(value); // Update the state with the selected value
	};
	const options = settingsJson.manage_new_review_options;


	const handleCheckboxChange = async event => {
		try {
			const eventKey = event.target.name;

			const updateData = {
				field: event.target.name,
				value: event.target.checked,
				oid: settings._id,
				shop: shopRecords.shop
			};
			const response = await fetch('/api/collect-review-setting', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateData),
			});
			const data = await response.json();
			if (data.status == 200) {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
			}
			if (eventKey == 'autoPublishReview') {
				setIsChecked(!event.target.checked);
			} else if (eventKey == 'reviewNotification') {
				setIsCheckedReviewNotification(!event.target.checked);
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}

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
					shop: shopRecords.shop
				};
				const response = await fetch('/api/collect-review-setting', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(updateData),
				});

				const data = await response.json();
				if (data.status == 200) {
					shopify.toast.show(data.message, {
						duration: settingsJson.toasterCloseTime
					});
				} else {
					shopify.toast.show(data.message, {
						duration: settingsJson.toasterCloseTime,
						isError: true
					});
				}

				setInitialReviewNotificationEmail(e.target.value);

			}

		}
	};

	const handleAddOnsiteReviewChange = async event => {
		try {
			const myKey = event.target.name;
			const updateData = {
				field: event.target.name,
				value: !isAddOnsiteReview,
				shop: shopRecords.shop
			};
			const response = await fetch('/api/collect-review-setting', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateData),
			});
			const data = await response.json();
			if (data.status == 200) {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}
		setIsAddOnsiteReview(!isAddOnsiteReview);
	};


	return (
		<div className='row'>
			<Grid>
				<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 4, xl: 4}}>
					<Card>
						<BlockStack gap="400">
							<div className="bottomcheckrow">
								<Checkbox
									label="Auto-publish new reviews"
									checked={isChecked}
									onChange={handleCheckboxChange}
									id="flexSwitchCheckChecked"
									name="autoPublishReview"
								/>
								{/* <div className="form-check form-switch">
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
										htmlFor="flexSwitchCheckChecked"
									>
										Auto-publish new reviews
									</label>
								</div> */}
							</div>
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
						</BlockStack>
					</Card>
				</Grid.Cell>
				<Grid.Cell columnSpan={{xs: 6, sm: 3, md: 6, lg: 4, xl: 4}}>
					<Card>
						<div className="formcontent" >
							<TextField
								value={reviewNotificationEmail}
								onChange={handleReviewNotificationEmailChange}
								onBlur={handleReviewNotificationEmailBlur}
								name="reviewNotificationEmail"
								autoComplete="off"
								helpText={`Leave empty to have notifications sent to: ${shopRecords.email}`}
								placeholder='Notification Email'
							/>
							{!isValidReviewNotificationEmail && <small className="text-danger">Email address is invalid.</small>}

						</div>
						<div className="bottomcheckrow">
							<div className="form-check form-switch">
								<input
									checked={
										isCheckedReviewNotification
									}
									onChange={
										handleCheckboxChange
									}
									className="form-check-input"
									type="checkbox"
									role="switch"
									name="reviewNotification"
									id="revNotiSwitchCheckChecked"
								/>
								<label
									className="form-check-label"
									htmlFor="revNotiSwitchCheckChecked"
								>
									Review notifications
								</label>
							</div>
						</div>
					</Card>
				</Grid.Cell>
			</Grid>
			<div className='col-md-6'>
				<div className='collectreviewformbox'>
					{/* <Card>
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
									htmlFor="flexSwitchCheckChecked"
								>
									Auto-publish new reviews
								</label>
							</div>
						</div>
					</Card> */}
				</div>
			</div>


			<div className='col-md-6'>
				<div className='collectreviewformbox'>
					{/* <Card>

						<div className="formcontent" >
							<TextField
								value={reviewNotificationEmail}
								onChange={handleReviewNotificationEmailChange}
								onBlur={handleReviewNotificationEmailBlur}
								name="reviewNotificationEmail"
								autoComplete="off"
								helpText={`Leave empty to have notifications sent to: ${shopRecords.email}`}
								placeholder='Notification Email'
							/>
							{!isValidReviewNotificationEmail && <small className="text-danger">Email address is invalid.</small>}

						</div>



						<div className="bottomcheckrow">
							<div className="form-check form-switch">
								<input
									checked={
										isCheckedReviewNotification
									}
									onChange={
										handleCheckboxChange
									}
									className="form-check-input"
									type="checkbox"
									role="switch"
									name="reviewNotification"
									id="revNotiSwitchCheckChecked"
								/>
								<label
									className="form-check-label"
									htmlFor="revNotiSwitchCheckChecked"
								>
									Review notifications
								</label>
							</div>
						</div>
					</Card> */}
				</div>
			</div>

			<div className='col-md-12'>
				<div className='collectreviewformbox'>
					<Card>
						<div className="">
							<div className="form-check form-switch">
								<input
									checked={
										isAddOnsiteReview
									}
									onChange={
										handleAddOnsiteReviewChange
									}
									className="form-check-input"
									type="checkbox"
									role="switch"
									name="addOnsiteReview"
									id="addonsiteNotiSwitchCheckChecked"
								/>
								<label
									className="form-check-label"
									htmlFor="addonsiteNotiSwitchCheckChecked"
								>
									Add onsite reviewers to Shopify Customers list
								</label>
							</div>
						</div>
					</Card>
				</div>
			</div>

		</div>
	);
}