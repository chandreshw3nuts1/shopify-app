import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import UploadLogo from './UploadLogo';
import {
	Card,
	Select,
	TextField
} from '@shopify/polaris';
import { getUploadDocument } from '../../../utils/documentPath';
import { Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap';
import settingsJson from './../../../utils/settings.json';
import SingleImageUpload from "./ImageUpload";
import ColorPicker from "./ColorPicker";


export default function GeneralAppearance({ shopRecords, generalAppearances }) {
	const [imageLogo, setImageLogo] = useState(getUploadDocument(generalAppearances?.logo, 'logo'));

	const [starIcon, setStarIcon] = useState(generalAppearances?.starIcon);
	const [cornerRadiusSelection, setCornerRadiusSelection] = useState(generalAppearances?.cornerRadius);
	const [widgetFontSelection, setWidgetFontSelection] = useState(generalAppearances?.widgetFont);
	const [appBranding, setAppBranding] = useState(generalAppearances?.appBranding);
	const [emailAppearanceSelection, setEmailAppearanceSelection] = useState(generalAppearances?.emailAppearance);
	
	const [generalAppearancesObj, setGeneralAppearancesObj] = useState(generalAppearances);
    const [isCheckedEmailBanner, setIsCheckedEmailBanner] = useState(
		generalAppearances?.enabledEmailBanner || false
	);
	const ratingIcons = settingsJson.ratingIcons;
	const changeStarIcon = async (icon) => {

		try {

			const updateData = {
				value: icon,
				actionType: "updateStarIcon",
				shop_domain: shopRecords.shop
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
				setStarIcon(icon);

			} else {
				toast.error(data.message);
			}

		} catch (error) {
			console.error('Error updating record:', error);
		}

	}

	const changeSelectOption = async (event) => {
		try {
			const eventKey = event.target.name;
			const eventVal = event.target.value;
			const updateData = {
				field: eventKey,
				value: eventVal,
				actionType: "updateGeneralAppearance",
				shop_domain: shopRecords.shop,
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
				if (eventKey == "cornerRadius") {
					setCornerRadiusSelection(eventVal);
				} else if (eventKey == "widgetFont") {
					setWidgetFontSelection(eventVal);
				} else if (eventKey == "appBranding") {
					setAppBranding(eventVal);
				} else if (eventKey == "emailAppearance") {
					setEmailAppearanceSelection(eventVal);
				}

				

			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}
	};


	const handleCheckboxChange = async event => {
		try {
			const eventKey = event.target.name;

			const updateData = {
				field: event.target.name,
				value: event.target.checked,
                actionType : "emailAppearanceSettings",
				shop_domain: shopRecords.shop
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
		<>
			<div className='row'>
				<div className='col-md-6'>
					<div className='whitebox h-100'>

						<UploadLogo className="emailbannerimage" hasEdit />
					</div>
				</div>
				<div className='col-md-6'>
					<div className='whitebox flxcol h-100'>
						<div className='form-group m-0'>
							<label htmlFor="">Corner radius</label>
							<select
								value={cornerRadiusSelection}
								name="cornerRadius"
								onChange={changeSelectOption}
								className='input_text'
							>
								<option value="sharp">Sharp</option>
								<option value="slightly-rounded">Slightly Rounded</option>
								<option value="rounded">Rounded</option>
								<option value="extra-rounded">Extra Rounded</option>
							</select>
						</div>
						<div className='form-group m-0'>
							<label htmlFor="">Rating icon</label>
							<div className='input_wrap flxrow'>
								<div className='iconbox flxfix'>
									<div className='starlightdd'>
										<DropdownButton id="dropdown-basic-button" className={''} title={<i style={{color:generalAppearancesObj?.starIconColor || "blue"}} className={starIcon}></i>}>
											{ratingIcons.map((icon, i) => (
												<Dropdown.Item eventKey={`rating-${i}`} key={i + 1} onClick={() => { changeStarIcon(icon) }} className="custom-dropdown-item">
													<i className={icon}></i>
												</Dropdown.Item>
											))}


										</DropdownButton>
									</div>
								</div>
								<div className='colorbox flxflexi'>
									<ColorPicker  generalAppearancesObj={generalAppearancesObj} shopRecords={shopRecords} setDocumentObj={setGeneralAppearancesObj}  pickerType="starIconColor"  />
								</div>
							</div>
						</div>


						<div className='form-group m-0'>
							<label htmlFor="">Widgets font</label>
							<select value={widgetFontSelection}
								name="widgetFont"
								onChange={changeSelectOption}
								className='input_text'>
								<option value="Roboto">Roboto</option>
								<option value="Open sans">Open sans</option>
								<option value="Barlow">Barlow</option>
								<option value="Manrope">Manrope</option>
							</select>
						</div>
						<div className='form-group m-0'>
							<label htmlFor="">w3review branding</label>
							<select
								value={appBranding}
								name="appBranding"
								onChange={changeSelectOption} className='input_text'>
								<option value="show">Shown</option>
								<option value="hide">Hide</option>
							</select>
						</div>
					</div>
				</div>
			</div>

			<div className="subtitlebox">
				<h2>Email appearance</h2>
				<p>Customize your email colors and font to match your brand</p>
			</div>

			<div className="row">
				<div className="col-lg-6">
					<div className="whitebox h-100">
						<div className="form-group m-0">
							<label htmlFor="">Logo</label>
							<SingleImageUpload className="emailbannerimage" shopRecords={shopRecords} documentObj={generalAppearancesObj} setDocumentObj={setGeneralAppearancesObj} hasEdit />
							<div className="inputnote">{settingsJson.bannerHelpText}</div>
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

							<label class="form-check-label" htmlFor="enabledEmailBanner">
								Enable email banners
								<span>Display email banners for all emails sent to customers</span>
							</label>
						</div>
						<div className="form-group m-0">
							<label htmlFor="">Appearance</label>
							<select value={emailAppearanceSelection}
								name="emailAppearance"
								onChange={changeSelectOption} className='input_text'>
								<option value="boxed">Boxed</option>
								<option value="modern">Modern</option>
								<option value="custom">Custom</option>
							</select>
						</div>


						<div className="form-group m-0">
							<label htmlFor="">Appearance</label>
							<ColorPicker  generalAppearancesObj={generalAppearancesObj} shopRecords={shopRecords} setDocumentObj={setGeneralAppearancesObj}  pickerType="emailBackgroundColor"  />

						</div>


					</div>
				</div>
			</div>
		</>

	);
}