import { useState, useCallback } from 'react';
import {
	Card,
	Select,
	TextField,
	Box,
	Grid, 
	BlockStack,
	Checkbox,
	InlineError,
	InlineGrid,
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

	const handleCheckboxChange = useCallback(async (checked, name) => {
		try {
			const eventKey = name;

			const updateData = {
				field: name,
				value: checked,
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
				setIsChecked(checked);
			} else if (eventKey == 'reviewNotification') {
				setIsCheckedReviewNotification(checked);
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}
	});
	

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

	
	const handleAddOnsiteReviewChange = useCallback(async (checked, name) => {

		try {
			const updateData = {
				field: name,
				value: checked,
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
		setIsAddOnsiteReview(checked);
	})

	return (
		<BlockStack gap="400">
			<InlineGrid gap="400" columns={{xs: 1, sm: 1, md: 2, lg: 2, xl: 2}}>
				<Card>
					<BlockStack gap="400">
						<div className="bottomcheckrow">
							<Checkbox
								label="Auto-publish new reviews"
								checked={isChecked}
								onChange={ (value) => handleCheckboxChange(value , "autoPublishReview")}
								id="flexSwitchCheckChecked"
							/>
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
				<Card>
					<BlockStack gap="400">
						<div className="bottomcheckrow">
							<Checkbox
								label="Review notifications"
								checked={isCheckedReviewNotification}
								onChange={ (value) => handleCheckboxChange(value , "reviewNotification")}
							/>
						</div>
						<div className="formcontent" >
							<TextField
								value={reviewNotificationEmail}
								onChange={handleReviewNotificationEmailChange}
								onBlur={handleReviewNotificationEmailBlur}
								name="reviewNotificationEmail"
								autoComplete="off"
								helpText={`Leave empty to have notifications sent to: ${shopRecords.email}`}
								placeholder='Notification Email'
								id='reviewNotificationTextarea'
							/>
							{!isValidReviewNotificationEmail && <InlineError message="Email address is invalid." fieldID="reviewNotificationTextarea" />}
						</div>
					</BlockStack>
				</Card>
			</InlineGrid>
			<Card>
				<BlockStack gap="400">
					<Checkbox
						label="Add onsite reviewers to Shopify Customers list"
						checked={isAddOnsiteReview}
						onChange={ (value) => handleAddOnsiteReviewChange(value , "addOnsiteReview")}
					/>
						
							{/* <input
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
							</label> */}
						
					
				</BlockStack>
			</Card>
		</BlockStack>
	);
}