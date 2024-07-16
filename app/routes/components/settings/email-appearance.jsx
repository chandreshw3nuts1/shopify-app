import React, { useState } from 'react';
import { toast } from 'react-toastify';

import SingleImageUpload from "./ImageUpload";
const EmailAppearance = (props) => {
    const [generalAppearancesObj, setGeneralAppearancesObj] = useState(props.generalAppearances);
    const [isCheckedEmailBanner, setIsCheckedEmailBanner] = useState(
		props.generalAppearances?.enabledEmailBanner || false
	);
    const handleCheckboxChange = async event => {
		try {
			const eventKey = event.target.name;

			const updateData = {
				field: event.target.name,
				value: event.target.checked,
                actionType : "emailAppearanceSettings",
				shop_domain: props.shopRecords.shop
			};
			const response = await fetch('/api/branding', {
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
			if (eventKey == 'enabledEmailBanner') {
				setIsCheckedEmailBanner(!event.target.checked);
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}

	};
    return (
        <div className="row">
            <div className="col-lg-6">
                <div className="whitebox h-100">
                    <div className="form-group m-0">
                        <label htmlFor="">Logo</label>
                        <SingleImageUpload className="emailbannerimage" shopRecords={props.shopRecords} documentObj={generalAppearancesObj} setDocumentObj={setGeneralAppearancesObj} hasEdit />
                        <div className="inputnote">You can upload an image in JPG, PNG format up to 5MB. For best compatibility, upload an image size of 1200px by 630px.</div>
                    </div>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="whitebox h-100 flxcol">
                    <div class="form-check form-switch">

                        <input
                            checked={
                                isCheckedEmailBanner
                            }
                            onChange={
                                handleCheckboxChange
                            }
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            name="enabledEmailBanner"
                            id="enabledEmailBanner"
                        />

                        <label class="form-check-label" for="enabledEmailBanner">
                            Enable email banners
                            <span>Display email banners for all emails sent to customers</span>
                        </label>
                    </div>
                    <div className="form-group m-0">
                        <label htmlFor="">Appearance</label>
                        <select name="" id="" className='input_text'>
                            <option value="">Sharp</option>
                            <option value="">Slightly Rounded</option>
                            <option value="">Rounded</option>
                            <option value="">Extra Rounded</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmailAppearance;