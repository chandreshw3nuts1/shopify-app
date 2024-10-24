import { useState, useCallback } from 'react';
import UploadLogo from './UploadLogo';

import { getDefaultProductImage, getUploadDocument } from '../../../utils/documentPath';
import settingsJson from './../../../utils/settings.json';
import SingleImageUpload from "./ImageUpload";
import ColorPicker from "./ColorPicker";
import SampleAppearanceEmailTemplate from './../email/SampleAppearanceEmailTemplate';
import { Modal, TitleBar } from '@shopify/app-bridge-react';

import { Box, Grid, Select, Popover, Button, Icon, Text, Card, BlockStack, InlineGrid, Checkbox } from '@shopify/polaris';
import { ViewIcon } from '@shopify/polaris-icons';

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
				setPopoverActive(false);
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

	const changeSelectOption = useCallback(async (value, name) => {
		try {
			const eventKey = name;
			const eventVal = value;
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
	}, []);


	const handleCheckboxChange = useCallback(async (checked, name) => {
		try {
			const eventKey = name;
			const eventVal = checked;

			const updateData = {
				field: name,
				value: checked,
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
				setIsCheckedEmailBanner(checked);
				setIsHideBanner(!isHideBanner);

			}
		} catch (error) {
			console.error('Error updating record:', error);
		}

	});
	const viewSample = (e) => {
		e.preventDefault();
		var footerContent = "";
		if (generalSettingsModel.email_footer_enabled) {
			const defaultLang = generalSettingsModel.defaul_language;
			footerContent = generalSettingsModel[defaultLang] ? generalSettingsModel[defaultLang].footerText : "";
		}
		const sampleEmailData = {
			logo: getUploadDocument(documentObj?.logo, shopRecords.shop_id, 'logo'),
			body: settingsJson.defaultSampleEmailBody,
			banner: getUploadDocument(documentObj?.banner, shopRecords.shop_id, 'banners'),
			getDefaultProductImage: getDefaultProductImage(),
			email_footer_enabled: generalSettingsModel.email_footer_enabled,
			footerContent: footerContent,
		}

		setEmailContents(sampleEmailData);
		setShowViewSampleModal(true);
	}


	const widgetFontOptions = [
		{ label: 'Roboto', value: 'Roboto' },
		{ label: 'Open sans', value: 'Open sans' },
		{ label: 'Barlow', value: 'Barlow' },
		{ label: 'Manrope', value: 'Manrope' },
	];


	const brandingOptions = [
		{ label: 'Shown', value: 'show' },
		{ label: 'Hide', value: 'hide' },
	];

	const appearanceOptions = [
		{ label: 'Boxed', value: 'boxed' },
		{ label: 'Modern', value: 'modern' },
		{ label: 'Custom', value: 'custom' },
	];

	const fontTypesOptions = settingsJson.emailTemplateFontTypes.map((item) => ({
		label: item,
		value: item,
	}));

	const fontSizeOptions = settingsJson.emailTemplateFontSizes.map((item) => ({
		label: item,
		value: item,
	}));



	const [popoverActive, setPopoverActive] = useState(false);

	const togglePopover = () => setPopoverActive((active) => !active);

	const handleClose = () => setPopoverActive(false);

	return (
		<>

			<Grid>
				<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
					<Card title="Logo" sectioned>
						<UploadLogo fullHeight className="" shopRecords={shopRecords} documentObj={documentObj} setDocumentObj={setDocumentObj} hasEdit />
					</Card>
				</Grid.Cell>
				<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
					<Card>
						<BlockStack gap="400">
							<Select
								label="Corner radius"
								options={settingsJson.cornerOptions}
								onChange={(value) => changeSelectOption(value, 'cornerRadius')}
								value={cornerRadiusSelection}
							/>

							<BlockStack gap="100">
								<Text variant="headingSm" as="h6" fontWeight="regular"> Rating icon</Text>
								<div className='input_wrap flxrow'>
									<Popover
										active={popoverActive}
										activator={
											<div
												onClick={togglePopover}
												style={{
													display: 'inline-flex',
													alignItems: 'center',
													paddingRight: '4px',
													border: '1px solid #dfe3e8',
													borderRadius: '8px',
													cursor: 'pointer',
													backgroundColor: '#fff',
													marginRight: '5px'
												}}
											>
												<i
													style={{
														color: documentObj?.starIconColor || "blue",
														fontSize: '32px',
													}}
													className={starIcon}
												></i>
												<span
													style={{
														display: 'inline-block',
														width: '0',
														height: '0',
														borderLeft: '5px solid transparent',
														borderRight: '5px solid transparent',
														borderTop: '5px solid black', // Arrow pointing down
													}}
												/>
											</div>
										}
										onClose={handleClose}
									>
										<div style={{ padding: '10px' }}>
											<div style={{ padding: '10px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
												{ratingIcons.map((icon, index) => (
													<button
														key={index}
														onClick={() => { changeStarIcon(icon) }}
														style={{
															background: 'none',
															border: 'none',
															padding: '0',
															cursor: 'pointer',
															fontSize: '30px'
														}}
													>
														<i className={icon}></i>
													</button>
												))}
											</div>
										</div>
									</Popover>

									<div className='colorbox flxflexi'>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="starIconColor" />
									</div>
								</div>

							</BlockStack>

							<Select
								label="Widgets font"
								options={widgetFontOptions}
								onChange={(value) => changeSelectOption(value, 'widgetFont')}
								value={widgetFontSelection}
							/>
							<Select
								label={`${settingsJson.app_name} branding`}
								options={brandingOptions}
								onChange={(value) => changeSelectOption(value, 'appBranding')}
								value={appBranding}
							/>

						</BlockStack>
					</Card>
				</Grid.Cell>
			</Grid >



			<div className="subtitlebox">
				<h2>Email appearance</h2>
				<p>Customize your email colors and font to match your brand</p>
			</div>

			<Grid>
				<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
					<Card title="" sectioned>
						<Box paddingBlock="200">
							<InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
								<Text>Appearance</Text>
								<Select
									options={appearanceOptions}
									onChange={(value) => changeSelectOption(value, 'emailAppearance')}
									value={emailAppearanceSelection}
								/>
							</InlineGrid>
						</Box>






						{isHideCustomSettings &&
							<>
								<Box paddingBlock="200">
									<InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
										<Text>Email background color</Text>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="emailBackgroundColor" />
									</InlineGrid>
								</Box>

								<Box paddingBlock="200">
									<InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
										<Text>Content background color</Text>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="contentBackgroundColor" />
									</InlineGrid>
								</Box>

								<Box paddingBlock="200">
									<InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
										<Text>Email text color</Text>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="emailTextColor" />
									</InlineGrid>
								</Box>

								<Box paddingBlock="200">
									<InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
										<Text>Button background color</Text>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="buttonBackgroundColor" />
									</InlineGrid>
								</Box>

								<Box paddingBlock="200">
									<InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
										<Text>Button title color</Text>
										<ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerType="buttonTitleColor" />
									</InlineGrid>
								</Box>

								<Box paddingBlock="200">
									<InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
										<Text>Font type</Text>
										<Select
											options={fontTypesOptions}
											onChange={(value) => changeSelectOption(value, 'fontType')}
											value={fontTypeSelection}
										/>
									</InlineGrid>
								</Box>

								<Box paddingBlock="200">
									<InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
										<Text>Font size</Text>
										<Select
											options={fontSizeOptions}
											onChange={(value) => changeSelectOption(value, 'fontSize')}
											value={fontSizeSelection}
										/>
									</InlineGrid>
								</Box>

							</>

						}

						<Box paddingBlock="200">
							<Button
								size="Medium"
								onClick={viewSample}
								accessibilityLabel=""
								icon={ViewIcon}
								variant="tertiary"
							>
								View sample
							</Button>
						</Box>

					</Card>
				</Grid.Cell>
				<Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
					<Card title="" sectioned>

						<Checkbox
							label="Enable email banners"
							checked={isCheckedEmailBanner}
							helpText="Display email banners for all emails sent to customers"
							onChange={(value) => handleCheckboxChange(value, "enabledEmailBanner")}
						/>

						{isHideBanner &&
							<div className="form-group m-10">
								<SingleImageUpload className="emailbannerimage" shopRecords={shopRecords} documentObj={documentObj} setDocumentObj={setDocumentObj} hasEdit />
								<div className="inputnote">{settingsJson.bannerHelpText}</div>
							</div>
						}

					</Card>
				</Grid.Cell>
			</Grid>

			{
				showViewSampleModal && (
					<Modal
						variant="large"
						open={showViewSampleModal}
						onHide={handleCloseViewSampleModal}
					>
						<TitleBar title="Sample email">

							<button onClick={handleCloseViewSampleModal}>Close</button>
						</TitleBar>
						<Box padding="500">

							<SampleAppearanceEmailTemplate emailContents={emailContents} documentObj={documentObj} />

						</Box>
					</Modal>
				)
			}

		</>

	);
}