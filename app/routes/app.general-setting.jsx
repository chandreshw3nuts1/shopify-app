import { useState, useEffect } from "react";
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import SettingPageSidebar from "./components/headerMenu/SettingPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import generalSettings from './models/generalSettings';
import { getAllThemes, checkAppEmbedAppStatus } from './../utils/common';
const CrownIcon = '/images/crown-icon.svg'
import { Image } from "react-bootstrap";
import AlertInfo from "./components/AlertInfo";
import settingsJson from './../utils/settings.json';
import EnableAppEmbedAlert from './components/common/enable-app-embed-alert';


import { json } from "@remix-run/node";

import {
	Page,
	Select,
} from "@shopify/polaris";

export async function loader({ request }) {
	try {

		const shopRecords = await getShopDetails(request);

		const allThemes = await getAllThemes(shopRecords.myshopify_domain);
		let activeTheme;
		let isEnabledAppEmbed = false;
		if (allThemes) {
			activeTheme = allThemes.find(theme => theme.role === 'main');
			isEnabledAppEmbed = await checkAppEmbedAppStatus(shopRecords.myshopify_domain, activeTheme.id);
		}

		const generalSettingsModel = await generalSettings.findOne({
			shop_id: shopRecords._id
		});

		const reviewExtensionId = process.env.SHOPIFY_ALL_REVIEW_EXTENSION_ID;

		return json({ shopRecords, generalSettingsModel, allThemes,activeTheme, isEnabledAppEmbed, reviewExtensionId });

	} catch (error) {
		console.error('Error fetching records:', error);
		return json({ error: 'Error fetching records' }, { status: 500 });
	}

}

export default function GeneralSettings() {
	const loaderData = useLoaderData();
	const shopRecords = loaderData.shopRecords;
	const [generalSettings, setGeneralSettings] = useState(loaderData.generalSettingsModel);
	const reviewExtensionId = loaderData.reviewExtensionId;
	const allThemes = loaderData.allThemes;
	const isEnabledAppEmbed = loaderData.isEnabledAppEmbed;
	const activeTheme = loaderData.activeTheme;
	const [selectedTheme, setSelectedTheme] = useState('');
	const [addAppThemeButton, setAddAppThemeButton] = useState(false);

	const [initialData, setInitialData] = useState({});

	const [initialReplyEmail, setInitialReplyEmail] = useState(
		generalSettings?.reply_email || ''
	);
	const [isValidReplyEmail, setIsValidReplyEmail] = useState(true);

	const [replyEmail, setReplyEmail] = useState(generalSettings?.reply_email);
	const [isEnableFooterTextChecked, setIsEnableFooterTextChecked] = useState(
		generalSettings?.email_footer_enabled || false
	);
	const [isEnableImportFromExternalSource, setIsEnableImportFromExternalSource] = useState(
		generalSettings?.is_enable_import_from_external_source || false
	);
	const [isEnableFuturePurchaseDiscount, setIsEnableFuturePurchaseDiscount] = useState(
		generalSettings?.is_enable_future_purchase_discount || false
	);
	const [isEnableReviewNotVerified, setIsEnableReviewNotVerified] = useState(
		generalSettings?.is_enable_review_not_verified || false
	);
	const [isEnableReviewWrittenBySiteVisitor, setIsEnableReviewWrittenBySiteVisitor] = useState(
		generalSettings?.is_enable_review_written_by_site_visitor || false
	);
	const [isEnableMarkedVerifiedByStoreOwner, setIsEnableMarkedVerifiedByStoreOwner] = useState(
		generalSettings?.is_enable_marked_verified_by_store_owner || false
	);

	const [isEnableSeoRichSnippetChecked, setIsEnableSeoRichSnippetChecked] = useState(
		generalSettings?.is_enable_seo_rich_snippet || false
	);


	const [currentLanguage, setCurrentLanguage] = useState(generalSettings?.defaul_language || '');
	const [footerText, setFooterText] = useState('');

	let themesOptions = allThemes.map(theme => ({
		label: theme.name,
		value: theme.id
	}));
	themesOptions = [
		{ label: 'Please select theme', value: '' },
		...themesOptions
	];


	const formattedLanguages = settingsJson.languages.map(language => ({
		value: language.code,
		label: language.lang
	}));



	useEffect(() => {


		const footerEmailTextInfo = (generalSettings && generalSettings[currentLanguage]) ? generalSettings[currentLanguage] : {};
		const { footerText } = footerEmailTextInfo;
		setFooterText(footerText || '');

		setInitialData({
			reply_email: generalSettings.reply_email || '',
			footerText: footerText || ''
		});

	}, [generalSettings, currentLanguage]);

	const handleSelectChange = async (value, name) => {

		if (name == "multilingual_support") {
			value = value == 'true' ? true : false;
		}
		const updateData = {
			field: name,
			value: value,
			shop: shopRecords.shop,
			actionType: "generalSettings"
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
			setGeneralSettings(prevState => ({
				...prevState,
				[name]: value
			}));

			if (name == "multilingual_support") {
				setCurrentLanguage(generalSettings.defaul_language);
			} else if (name == "defaul_language") {
				setCurrentLanguage(value);
			}

			shopify.toast.show(data.message, {
				duration: settingsJson.toasterCloseTime
			});
		} else {
			shopify.toast.show(data.message, {
				duration: settingsJson.toasterCloseTime,
				isError: true
			});
		}
	};

	const handleFooterLanguageChange = async (value, name) => {
		setCurrentLanguage(value);
	};

	const changeInput = (event) => {
		const eventKey = event.target.name;
		const eventVal = event.target.value;

		if (eventKey == 'reply_email') {
			setReplyEmail(eventVal);
		} else if (eventKey == 'footerText') {
			setFooterText(eventVal);
		}

	};

	const handleReplyEmailBlur = async (e) => {

		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		setIsValidReplyEmail(false);

		if (regex.test(e.target.value) || e.target.value == '') {

			setIsValidReplyEmail(true);

			if (initialReplyEmail != e.target.value) {
				const updateData = {
					field: e.target.name,
					value: replyEmail,
					shop: shopRecords.shop,
					actionType: "generalSettings"
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

				setInitialReplyEmail(e.target.value);

			}

		}
	};

	const handleCheckboxEnableChange = async event => {
		try {
			const eventKey = event.target.name;

			const updateData = {
				field: event.target.name,
				value: event.target.checked,
				actionType: "generalSettings",
				shop: shopRecords.shop
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
			if (eventKey == 'email_footer_enabled') {
				setIsEnableFooterTextChecked(!event.target.checked);
			} else if (eventKey == 'is_enable_import_from_external_source') {
				setIsEnableImportFromExternalSource(!event.target.checked);
			} else if (eventKey == 'is_enable_marked_verified_by_store_owner') {
				setIsEnableMarkedVerifiedByStoreOwner(!event.target.checked);
			} else if (eventKey == 'is_enable_review_written_by_site_visitor') {
				setIsEnableReviewWrittenBySiteVisitor(!event.target.checked);
			} else if (eventKey == 'is_enable_review_not_verified') {
				setIsEnableReviewNotVerified(!event.target.checked);
			} else if (eventKey == 'is_enable_future_purchase_discount') {
				setIsEnableFuturePurchaseDiscount(!event.target.checked);
			} else if (eventKey == 'is_enable_seo_rich_snippet') {
				setIsEnableSeoRichSnippetChecked(!event.target.checked);
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}

	};

	const inputFooterTextBlur = async (e) => {
		if (initialData[e.target.name] != e.target.value) {
			const updateData = {
				field: e.target.name,
				value: e.target.value,
				language: currentLanguage,
				actionType: "generalSettingsFooterText",
				shop: shopRecords.shop
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

				setGeneralSettings(prevState => ({
					...(prevState || {}),  // Ensure prevState is an object
					[currentLanguage]: {
						...(prevState ? prevState[currentLanguage] : {}),  // Ensure nested object is an object
						[e.target.name]: e.target.value
					}
				}));

				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});

			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
			}
		}

	}

	const handleSelectThemeChange = async (value, name) => {
		setSelectedTheme(parseInt(value));
		if (value == "") {
			setAddAppThemeButton(false);
		} else {
			setAddAppThemeButton(true);
		}
	};

	const addAppEmbedToTheme = async () => {
		const appEmbedUrl = `https://admin.shopify.com/store/${shopRecords.myshopify_domain.replace(".myshopify.com", "")}/themes/${selectedTheme}/editor?context=apps&activateAppId=${reviewExtensionId}%2Fapp-embed`;
		window.open(appEmbedUrl, '_blank');
	}

	const reviewerNameFormatOptions = [
		{ "value": "default", "label": "First name, last initial (John S.)" },
		{ "value": "fn", "label": "First name (John)" },
		{ "value": "ln", "label": "Last name (Smith)" },
		{ "value": "initial", "label": "First initial, last initial (J. S.)" },
	];

	const emailsOptions = [
		{ "value": "everyone", "label": "Everyone" },
		{ "value": "marketing_emails_only", "label": "Customers who consent to receive marketing emails" }
	];
	const unsubscribeOptions = [
		{ "value": "not_unsubscribe_marking_email", "label": "Does not unsubscribe the customer from Shopify marketing emails" },
		{ "value": "unsubscribe_marking_email", "label": "Also unsubscribes the customer from Shopify marketing emails" }
	];


	const crumbs = [
		{ "title": "Settings", "link": "./../branding" },
		{ "title": "General setting", "link": "" }
	];

	return (
		<>
			<Breadcrumb crumbs={crumbs} />
			<Page fullWidth>
				<SettingPageSidebar />

				<div className="pagebox">
					<div className="graywrapbox gapy24">
						{/* <div className="subtitlebox">
						<h2>General setting</h2>
						<p>Choose the right W3 plan to grow your business</p>
					</div> */}
						<div className="general_row">
							<a href="#" className="whitebox ourplanbox flxrow">
								<div className="iconbox flxfix">
									<Image src={CrownIcon} alt="w3 plans" width={100} height={100} />
								</div>
								<div className="detailbox flxflexi">
									<h6>Our plans</h6>
									<p>Choose the right {settingsJson.app_name} Reviews plan to grow your business</p>
								</div>
								<div className="linkicon flxfix">
									<i className="twenty-longarrow-right"></i>
								</div>
							</a>
						</div>
						<div className="whitebox">
							<div className="general_row">
								<div className="row_title">
									<div className="flxflexi lefttitle">
										<h4>Add {settingsJson.app_name} to your theme</h4>
										<p><b>To enable the {settingsJson.app_name} Core Script on your Shopify theme, follow the steps below.</b></p>
										<p>1 . Select the theme you want to integrate with {settingsJson.app_name}</p>
										<p>2 . Click "Add {settingsJson.app_name} to your theme"</p>
										<p>3 . Make sure "{settingsJson.app_name} Core Script" is on</p>
										<p>4 . Click "Save"</p>
									</div>
								</div>
								<div className="formrow flxrow gapx24">
									<div className="flxflexi">
										<div className="form-group m-0">
											<Select
												name="theme_id"
												id="theme_id"
												options={themesOptions}
												onChange={
													handleSelectThemeChange
												}
												value={selectedTheme}
											/>
										</div>
									</div>
									<div className="flxfix">
										<button type="button" className="revbtn" onClick={addAppEmbedToTheme} disabled={!addAppThemeButton}  >Add {settingsJson.app_name} to your theme</button>
									</div>
								</div>
							</div>
						</div>
						<div className="whitebox">
							<div className="general_row">
								<div className="row_title">
									<div className="flxflexi lefttitle">
										<h4>Localization</h4>
										<p>Customize the languages used in {settingsJson.app_name} widgets and emails</p>
									</div>
								</div>
								<div className="formrow">
									<div className="row">
										<div className="col-lg-6">
											<div className="form-group m-0">
												<label htmlFor="">Primary language</label>

												<Select
													name="defaul_language"
													id="defaul_language"
													options={formattedLanguages}
													onChange={
														handleSelectChange
													}
													value={generalSettings?.defaul_language}
												/>

											</div>
										</div>
										<div className="col-lg-6">
											<div className="form-group m-0">
												<label htmlFor="">Multilingual support</label>
												<Select
													name="multilingual_support"
													id="multilingual_support"
													options={[{ "label": "Enabled", "value": "true" }, { "label": "Disabled", "value": "false" }]}
													onChange={
														handleSelectChange
													}
													value={generalSettings.multilingual_support ? "true" : "false"}
												/>

											</div>
										</div>
										<div className="col-lg-12">
											<div className="inputnote"><strong>Note:</strong> When you enable multilingual support, we will use each customer's checkout language for the emails and review form.</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="whitebox">
							<div className="general_row">
								<div className="row_title">
									<div className="flxflexi lefttitle">
										<h4>Email replies address</h4>
										<p>Customer replies to {settingsJson.app_name} emails will be sent to this email address</p>
									</div>
								</div>
								<div className="formrow">
									<div className="row">
										<div className="col-lg-12">
											<div className="form-group m-0">
												<label htmlFor="">Send email replies to</label>

												<input type="text" onBlur={handleReplyEmailBlur} onChange={changeInput} name="reply_email" value={replyEmail} className="input_text" placeholder="Enter your email address" />
												{!isValidReplyEmail && <small className="text-danger">Email address is invalid.</small>}

											</div>
										</div>
										<div className="col-lg-12">
											<div className="inputnote">Leave empty to have email replies sent to: <strong>{shopRecords.email}</strong></div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="whitebox">
							<div className="general_row">
								<div className="row_title">
									<div className="flxflexi lefttitle">
										<h4>Email footer</h4>
										<p>Display text in the footer of {settingsJson.app_name} emails</p>
									</div>
									<div className="flxfix rightaction">
										<div className="form-check form-switch">
											<input
												checked={
													isEnableFooterTextChecked
												}
												onChange={
													handleCheckboxEnableChange
												}
												className="form-check-input"
												type="checkbox"
												role="switch"
												name="email_footer_enabled"
												id="enablefooterText"
											/>
											<label
												className="form-check-label"
												htmlFor="enablefooterText"
											>
												Display Footer
											</label>

										</div>
									</div>
								</div>
								<div className="formrow">
									<div className="row gapy16">
										{generalSettings.multilingual_support &&
											<div className="col-lg-4">
												<div className="form-group m-0">
													<label htmlFor="">Editing text in</label>

													<Select
														name="footer_email_text_language"
														id="footer_email_text_language"
														options={formattedLanguages}
														onChange={
															handleFooterLanguageChange
														}
														value={currentLanguage}
													/>

												</div>
											</div>
										}
										<div className="col-lg-12">
											<div className="form-group m-0">
												<label htmlFor="">Footer text</label>

												<input type="text" disabled={!isEnableFooterTextChecked} onChange={changeInput} onBlur={inputFooterTextBlur} value={footerText} className="input_text" name="footerText" placeholder="Enter your email address" />
											</div>
										</div>

									</div>
								</div>
							</div>
						</div>
						<div className="whitebox">
							<div className="general_row">
								<div className="row_title">
									<div className="flxflexi lefttitle">
										<h4>Email compliance</h4>
										<p>Choose who receives {settingsJson.app_name} emails, and how to handle unsubscribes</p>
									</div>
								</div>
								<div className="formrow">
									<div className="row gapy16">
										<div className="col-lg-12">
											<div className="form-group m-0">

												<label htmlFor="">Send emails</label>

												<Select
													name="send_email_type"
													id="send_email_type"
													options={emailsOptions}
													onChange={
														handleSelectChange
													}
													value={generalSettings?.send_email_type}
												/>


											</div>
										</div>
										<div className="col-lg-12">
											<div className="form-group m-0">
												<label htmlFor="">Unsubscribing</label>

												<Select
													name="unsubscribing_type"
													id="unsubscribing_type"
													options={unsubscribeOptions}
													onChange={
														handleSelectChange
													}
													value={generalSettings?.unsubscribing_type}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="whitebox">
							<div className="general_row">
								<div className="row_title">
									<div className="flxflexi lefttitle">
										<h4>Transparency</h4>
										<p>{settingsJson.app_name} enables you to automatically display disclosures, in order to comply with any local laws, rules and regulations</p>
									</div>
								</div>
								<div className="formrow">
									<div className="row gapy16">
										<div className="col-lg-4">
											<div className="form-group m-0">
												<label htmlFor="">Verified review style</label>

												<Select
													name="verified_review_style"
													id="verified_review_style"
													options={[{ "label": "Icon only", "value": "icon" }, { "label": "Icon + Text", "value": "icon_text" }]}
													onChange={
														handleSelectChange
													}
													value={generalSettings.verified_review_style}
												/>

											</div>
										</div>
										<div className="col-lg-12">
											<div className="form-group m-0">
												<div className="form-check form-switch">

													<input
														checked={
															isEnableImportFromExternalSource
														}
														onChange={
															handleCheckboxEnableChange
														}
														className="form-check-input"
														type="checkbox"
														role="switch"
														name="is_enable_import_from_external_source"
														id="is_enable_import_from_external_source"
													/>
													<label
														className="form-check-label"
														htmlFor="is_enable_import_from_external_source"
													>
														Indicate that a review was imported from an external source <span>Display a disclosure in the review detail popup about reviews that were imported from a CSV file or another external source.</span>
													</label>


												</div>
											</div>
										</div>
										<div className="col-lg-12">
											<div className="form-group m-0">
												<div className="form-check form-switch">


													<input
														checked={
															isEnableMarkedVerifiedByStoreOwner
														}
														onChange={
															handleCheckboxEnableChange
														}
														className="form-check-input"
														type="checkbox"
														role="switch"
														name="is_enable_marked_verified_by_store_owner"
														id="is_enable_marked_verified_by_store_owner"
													/>
													<label
														className="form-check-label"
														htmlFor="is_enable_marked_verified_by_store_owner"
													>
														Indicate that a review was marked as verified by the store owner<span>Display a disclosure in the review detail popup about site visitor reviews and imported reviews that you marked as verified.</span>
													</label>

												</div>
											</div>
										</div>
										<div className="col-lg-12">
											<div className="form-group m-0">
												<div className="form-check form-switch">
													<input
														checked={
															isEnableReviewWrittenBySiteVisitor
														}
														onChange={
															handleCheckboxEnableChange
														}
														className="form-check-input"
														type="checkbox"
														role="switch"
														name="is_enable_review_written_by_site_visitor"
														id="is_enable_review_written_by_site_visitor"
													/>
													<label
														className="form-check-label"
														htmlFor="is_enable_review_written_by_site_visitor"
													>
														Indicate that a review was written by a site visitor<span>Display a disclosure in the review detail popup about reviews that were submitted by a visitor on your store.</span>

													</label>

												</div>
											</div>
										</div>
										<div className="col-lg-12">
											<div className="form-group m-0">
												<div className="form-check form-switch">

													<input
														checked={
															isEnableReviewNotVerified
														}
														onChange={
															handleCheckboxEnableChange
														}
														className="form-check-input"
														type="checkbox"
														role="switch"
														name="is_enable_review_not_verified"
														id="is_enable_review_not_verified"
													/>
													<label
														className="form-check-label"
														htmlFor="is_enable_review_not_verified"
													>
														Indicate that a review is not verified<span>Display a disclosure about reviews from non-verified customers.</span>

													</label>
												</div>
											</div>
										</div>
										<div className="col-lg-12">
											<div className="form-group m-0">
												<div className="form-check form-switch">

													<input
														checked={
															isEnableFuturePurchaseDiscount
														}
														onChange={
															handleCheckboxEnableChange
														}
														className="form-check-input"
														type="checkbox"
														role="switch"
														name="is_enable_future_purchase_discount"
														id="is_enable_future_purchase_discount"
													/>
													<label
														className="form-check-label"
														htmlFor="is_enable_future_purchase_discount"
													>
														Indicate that the reviewer received a future purchase discount for adding media to their review<span>Display a disclosure when the reviewer received an incentive for adding a photo or a video to their review.</span>

													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="whitebox">
							<div className="general_row">
								<div className="row_title">
									<div className="flxflexi lefttitle">
										<h4>Reviewers name format</h4>
										<p>Customize how the reviewer name is displayed on {settingsJson.app_name} widgets</p>
									</div>
								</div>
								<div className="formrow">
									<div className="row gapy16">
										<div className="col-lg-12">
											<div className="form-group m-0">
												<label htmlFor="">Display name</label>

												<Select
													name="reviewers_name_format"
													id="reviewers_name_format"
													options={reviewerNameFormatOptions}
													onChange={
														handleSelectChange
													}
													value={generalSettings.reviewers_name_format}
												/>

											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="whitebox">
							<div className="general_row">
								<div className="row_title">
									<div className="flxflexi lefttitle">
										<h4>External pages</h4>
										<p>Define allowed domains where you want to display W3 widgets</p>
									</div>
								</div>
								<div className="formrow">
									<AlertInfo
										alertContent="Upgrade to Scale to display your store in an external page"
										alertClose
										// conlink="/"
										colorTheme="primarybox"
									/>
								</div>
							</div>
						</div>
						<div className="whitebox">
							<div className="general_row">
								<div className="row_title">
									<div className="flxflexi lefttitle">
										<h4>SEO</h4>
										<p>Display the average rating and number of reviews for each product in Google search results</p>
									</div>
								</div>
								<div className="formrow">
									<div className="form-group m-0">
										<div className="form-check form-switch">
											<input
												checked={
													isEnableSeoRichSnippetChecked
												}
												onChange={
													handleCheckboxEnableChange
												}
												className="form-check-input"
												type="checkbox"
												role="switch"
												name="is_enable_seo_rich_snippet"
												id="ratingongooglesearch"
											/>
											<label
												className="form-check-label"
												htmlFor="ratingongooglesearch"
											>
												Show product ratings in Google search results
											</label>

										</div>
									</div>
								</div>
								<div className="formrow">
									{!isEnabledAppEmbed &&
										<EnableAppEmbedAlert alertKey="general_seo_snippet" shopRecords={shopRecords} reviewExtensionId={reviewExtensionId} activeThemeId={activeTheme.id} page="general" alertClose/>
									}
								</div>
								<div className="formrow">
									<AlertInfo
										alertContent={`${settingsJson.app_name} will add the relevant rich snippets code to your store's theme. <a href="https://search.google.com/test/rich-results" target=_blank>Click here to test search result</a>`}
										// alertClose
										// conlink="/"
										colorTheme=""
									/>
								</div>
							</div>
						</div>


					</div>
				</div>

			</Page>
		</>


	);
}
