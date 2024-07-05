import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
	Card,
	Select,
	TextField
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
		settings?.AddOnsiteReview || false
	);

	const handleSelectChange = async (value, name) => {
		const updateData = {
			field: name,
			value: value,
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
		if (data.status == 200) {
			toast.success(data.message);
		} else {
			toast.error(data.message);
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
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}
			if (eventKey == 'autoPublishReview') {
				setIsChecked(!event.target.checked);
			} else if (eventKey == 'reviewNotification') {
				alert(event.target.checked);
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
					toast.success(data.message);
				} else {
					toast.error(data.message);
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
			if (data.status == 200) {
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}
		setIsAddOnsiteReview(!isAddOnsiteReview);
	};


	return (
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
								onChange={handleReviewNotificationEmailChange}
								onBlur={handleReviewNotificationEmailBlur}
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
									for="revNotiSwitchCheckChecked"
								>
									Review notifications
								</label>
							</div>
						</div>
					</Card>
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
									for="addonsiteNotiSwitchCheckChecked"
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