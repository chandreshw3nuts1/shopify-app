import { useState, useCallback } from 'react';
import {
	Card,
	Select,
	TextField,
	Checkbox,
	Box
} from '@shopify/polaris';
import settingsJson from './../../../utils/settings.json';


export default function ManageVideoSettings({ generalSettings, shopRecords }) {

	const [isVideoEnabled, setIsVideoEnabled] = useState(
		generalSettings?.is_enabled_video_review || false
	);
 
 

	const handleVideoEnableReviewChange = useCallback(async (name) => {
		try {
			const updateData = {
				field: name,
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
	});


	return (
		<Box paddingBlock='200' paddingInline='300' borderStyle='solid' borderWidth='0165' borderColor='border-brand' borderRadius='200'>
			<Checkbox
				label="Enable customers to upload a video with their review"
				checked={isVideoEnabled}
				onChange={handleVideoEnableReviewChange}
				name="is_enabled_video_review"
				id="enableVideoSwitchCheckChecked"
			/>
		</Box>
	);
}