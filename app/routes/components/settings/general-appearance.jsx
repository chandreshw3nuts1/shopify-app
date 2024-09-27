import { useState, useCallback } from 'react';
import UploadLogo from './UploadLogo';

import { getDefaultProductImage, getUploadDocument } from '../../../utils/documentPath';
import { Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap';
import settingsJson from './../../../utils/settings.json';
import SingleImageUpload from "./ImageUpload";
import ColorPicker from "./ColorPicker";
import SampleAppearanceEmailTemplate from './../email/SampleAppearanceEmailTemplate';


export default function GeneralAppearance({ shopRecords, generalAppearances, generalSettingsModel }) {
	const [starIcon, setStarIcon] = useState(generalAppearances?.starIcon);
	const [cornerRadiusSelection, setCornerRadiusSelection] = useState(generalAppearances?.cornerRadius);
	const [widgetFontSelection, setWidgetFontSelection] = useState(generalAppearances?.widgetFont);
	const [appBranding, setAppBranding] = useState(generalAppearances?.appBranding);
	const [emailAppearanceSelection, setEmailAppearanceSelection] = useState(generalAppearances?.emailAppearance);
	const [fontTypeSelection, setFontTypeSelection] = useState(generalAppearances?.fontType);
	const [fontSizeSelection, setFontSizeSelection] = useState(generalAppearances?.fontSize);

	const [documentObj, setDocumentObj] = useState(generalAppearances);
	const [isCheckedEmailBanner, setIsCheckedEmailBanner] = useState(
		generalAppearances?.enabledEmailBanner || false
	);
	const [isHideBanner, setIsHideBanner] = useState(generalAppearances?.enabledEmailBanner);
	const [showViewSampleModal, setShowViewSampleModal] = useState(false);
	const handleCloseViewSampleModal = () => setShowViewSampleModal(false);
	const [emailContents, setEmailContents] = useState({});
	const [isHideCustomSettings, setIsHideCustomSettings] = useState(generalAppearances?.emailAppearance == "custom" ? true : false);

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
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
				setStarIcon(icon);

			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
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
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
				if (eventKey == "cornerRadius") {
					setCornerRadiusSelection(eventVal);
				} else if (eventKey == "widgetFont") {
					setWidgetFontSelection(eventVal);
				} else if (eventKey == "appBranding") {
					setAppBranding(eventVal);
				} else if (eventKey == "emailAppearance") {
					setEmailAppearanceSelection(eventVal);
					setIsHideCustomSettings(eventVal == "custom" ? true : false);
				} else if (eventKey == "fontType") {
					setFontTypeSelection(eventVal);

				} else if (eventKey == "fontSize") {
					setFontSizeSelection(eventVal);
				}
				setDocumentObj({
					...documentObj,
					[eventKey]: eventVal
				})
			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}
	};


	const handleCheckboxChange = async event => {
		try {
			const eventKey = event.target.name;
			const eventVal = event.target.checked;

			const updateData = {
				field: event.target.name,
				value: event.target.checked,
				actionType: "emailAppearanceSettings",
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
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
				setDocumentObj({
					...documentObj,
					[eventKey]: eventVal
				});

			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
			}
			if (eventKey == 'enabledEmailBanner') {
				setIsCheckedEmailBanner(!event.target.checked);
				setIsHideBanner(!isHideBanner);

			}
		} catch (error) {
			console.error('Error updating record:', error);
		}

	};
	const viewSample = (e) => {
		e.preventDefault();
		var footerContent = "";
        if(generalSettingsModel.email_footer_enabled) {
			const defaultLang = generalSettingsModel.defaul_language;
            footerContent = generalSettingsModel[defaultLang] ? generalSettingsModel[defaultLang].footerText : "";
        }
		const sampleEmailData = {
			logo: getUploadDocument(documentObj?.logo, shopRecords.shop_id, 'logo'),
			body: settingsJson.defaultSampleEmailBody,
			banner: getUploadDocument(documentObj?.banner, shopRecords.shop_id, 'banners'),
			getDefaultProductImage: getDefaultProductImage(),
			email_footer_enabled : generalSettingsModel.email_footer_enabled,
			footerContent: footerContent,
		}

		setEmailContents(sampleEmailData);
		setShowViewSampleModal(true);
	}
	return (
		<>
			<div className='row'>
				<div className='col-md-6'>
					<div className='whitebox h-100'>
						<div className="form-group m-0 flxcol h-100">
							<label htmlFor="">Logo</label>
							<UploadLogo fullHeight className="" shopRecords={shopRecords} documentObj={documentObj} setDocumentObj={setDocumentObj} hasEdit />
						</div>
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
								<option value="0">Sharp</option>
								<option value="4">Slightly Rounded</option>
								<option value="8">Rounded</option>
								<option value="16">Extra Rounded</option>
							</select>
						</div>
						<div className='form-group m-0'>
							<label htmlFor="">Rating icon</label>
							<div className='input_wrap flxrow'>
								<div className='iconbox flxfix'>
									<div className='starlightdd'>
										<DropdownButton id="dropdown-basic-button" className={''} title={<i style={{ color: documentObj?.starIconColor || "blue" }} className={starIcon}></i>}>
											{ratingIcons.map((icon, i) => (
												<Dropdown.Item eventKey={`rating-${i}`} key={i + 1} onClick={() => { changeStarIcon(icon) }} className="custom-dropdown-item">
													<i className={icon}></i>
												</Dropdown.Item>
											))}


										</DropdownButton>
									</div>
								</div>
								<div className='colorbox flxflexi'>
									<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="starIconColor" />
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
							<label htmlFor="">{settingsJson.app_name} branding</label>
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
					<div className="whitebox flxcol">
						<div className="form-check form-switch">

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

							<label className="form-check-label" htmlFor="enabledEmailBanner">
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
						{isHideCustomSettings &&
							<div className='custom-email-options'>
								<div className="form-group m-0 horizontal-form">
									<label htmlFor="">Email background color</label>
									<div className='sideinput mw300 flxflexi'>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="emailBackgroundColor" />
									</div>
								</div>
								<div className="form-group m-0 horizontal-form">
									<label htmlFor="">Content background color</label>
									<div className='sideinput mw300 flxflexi'>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="contentBackgroundColor" />
									</div>
								</div>
								<div className="form-group m-0 horizontal-form">
									<label htmlFor="">Email text color</label>
									<div className='sideinput mw300 flxflexi'>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="emailTextColor" />
									</div>
								</div>
								<div className="form-group m-0 horizontal-form">
									<label htmlFor="">Button background color</label>
									<div className='sideinput mw300 flxflexi'>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="buttonBackgroundColor" />
									</div>
								</div>
								<div className="form-group m-0 horizontal-form">
									<label htmlFor="">Button border color</label>
									<div className='sideinput mw300 flxflexi'>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="buttonBorderColor" />
									</div>
								</div>
								<div className="form-group m-0 horizontal-form">
									<label htmlFor="">Button title color</label>
									<div className='sideinput mw300 flxflexi'>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="buttonTitleColor" />
									</div>
								</div>
								<div className="form-group m-0 horizontal-form">
									<label htmlFor="">Font type</label>
									<div className='sideinput mw300 flxflexi'>
										<select value={fontTypeSelection}
											name="fontType"
											onChange={changeSelectOption} className='input_text'>
											{settingsJson.emailTemplateFontTypes.map((item, i) => (
												<option key={i} value={item}>{item}</option>
											))};

										</select>

									</div>
								</div>
								<div className="form-group m-0 horizontal-form">
									<label htmlFor="">Font size</label>
									<div className='sideinput mw300 flxflexi'>
										<select value={fontSizeSelection}
											name="fontSize"
											onChange={changeSelectOption} className='input_text'>
											{settingsJson.emailTemplateFontSizes.map((item, i) => (
												<option key={i} value={item}>{item}</option>
											))};
										</select>
									</div>
								</div>
							</div>}
					</div>

					<div className="btnwrap">
						<a href="#" onClick={viewSample} className='revbtn'>View sample</a>
					</div>
				</div>
				{isHideBanner &&
					<div className="col-lg-6">
						<div className="whitebox">
							<div className="form-group m-0">
								<label htmlFor="">Email banner</label>
								<SingleImageUpload className="emailbannerimage" shopRecords={shopRecords} documentObj={documentObj} setDocumentObj={setDocumentObj} hasEdit />
								<div className="inputnote">{settingsJson.bannerHelpText}</div>
							</div>
						</div>
					</div>
				}

			</div >

			<Modal show={showViewSampleModal} className='reviewimagepopup' onHide={handleCloseViewSampleModal} size="lg" backdrop="static">
				<Modal.Header closeButton>
					<Modal.Title>Sample email</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<SampleAppearanceEmailTemplate emailContents={emailContents} documentObj={documentObj} />

				</Modal.Body>
			</Modal>
		</>

	);
}