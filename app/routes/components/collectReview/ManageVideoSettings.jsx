import { useState, useCallback } from 'react';
import {
	Card,
	Select,
	TextField
} from '@shopify/polaris';
import settingsJson from './../../../utils/settings.json';


export default function ManageVideoSettings({ generalSettings, shopRecords }) {

	const [isVideoEnabled, setIsVideoEnabled] = useState(
		generalSettings?.is_enabled_video_review || false
	);
 
 

	const handleVideoEnableReviewChange = async event => {
		try {
			const updateData = {
				field: event.target.name,
				value: !isVideoEnabled,
				shop: shopRecords.shop,
                actionType : "generalSettings"
			};
			const response = await fetch('/api/general-settings', {
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
		setIsVideoEnabled(!isVideoEnabled);
	};


	return (
		<div className='row'>
			
			<div className='col-md-12'>
				<div className='collectreviewformbox'>
					<Card>
						<div className="">
							<div className="form-check form-switch">
								<input
									checked={
										isVideoEnabled
									}
									onChange={
										handleVideoEnableReviewChange
									}
									className="form-check-input"
									type="checkbox"
									role="switch"
									name="is_enabled_video_review"
									id="enableVideoSwitchCheckChecked"
								/>
								<label
									className="form-check-label"
									htmlFor="enableVideoSwitchCheckChecked"
								>
									Enable customers to upload a video with their review
								</label>
							</div>
						</div>
					</Card>
				</div>
			</div>

		</div>
	);
}