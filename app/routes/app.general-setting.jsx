import { useState, useEffect, useCallback } from "react";
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import SettingPageSidebar from "./components/headerMenu/SettingPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import generalSettings from './models/generalSettings';
import { getAllThemes, checkAppEmbedAppStatus, findOneRecord } from './../utils/common';
const CrownIcon = '/images/crown-icon.svg'
import { Image } from "react-bootstrap";
import AlertInfo from "./components/AlertInfo";
import settingsJson from './../utils/settings.json';
import EnableAppEmbedAlert from './components/common/enable-app-embed-alert';
import ProductGroupsComponent from './components/generalSettings/ProductGroups';


import { json } from "@remix-run/node";

import {
	Page,
	Select,
	Checkbox,
	Card,
	TextField,
	Text,
	BlockStack,
	Button,
	InlineGrid,
	InlineError, InlineStack, Box
} from "@shopify/polaris";

export async function loader({ request }) {
	try {

		const shopRecords = await getShopDetails(request);
		const shopSessionRecords = await findOneRecord("shopify_sessions", { shop: shopRecords.myshopify_domain });

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

		return json({ shopRecords, shopSessionRecords, generalSettingsModel, allThemes, activeTheme, isEnabledAppEmbed, reviewExtensionId });

	} catch (error) {
		console.error('Error fetching records:', error);
		return json({ error: 'Error fetching records' }, { status: 500 });
	}

}

export default function GeneralSettings() {
	const loaderData = useLoaderData();
	const shopRecords = loaderData.shopRecords;
	const shopSessionRecords = loaderData.shopSessionRecords;

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
	const [footerCurrentLanguage, setFooterCurrentLanguage] = useState(generalSettings?.defaul_language || '');
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

		const footerEmailTextInfo = (generalSettings && generalSettings[footerCurrentLanguage]) ? generalSettings[footerCurrentLanguage] : {};
		const { footerText } = footerEmailTextInfo;
		setFooterText(footerText || '');
		setFooterCurrentLanguage(footerCurrentLanguage);

		setInitialData({
			reply_email: generalSettings.reply_email || '',
			footerText: footerText || ''
		});

	}, [footerCurrentLanguage]);

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
				setFooterCurrentLanguage(value);
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

	const handleFooterLanguageChange = useCallback((value) => {
		setFooterCurrentLanguage(value);
	}, []);

	const changeInput = useCallback((value, name) => {
		const eventKey = name;
		const eventVal = value;

		if (eventKey == 'reply_email') {
			setReplyEmail(eventVal);
		} else if (eventKey == 'footerText') {
			setFooterText(eventVal);
		}
	}, []);

	const handleReplyEmailBlur = useCallback(async (value, name) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		console.log(value, name);
		setIsValidReplyEmail(false);

		if (regex.test(value) || value == '') {

			setIsValidReplyEmail(true);

			if (initialReplyEmail != value) {
				const updateData = {
					field: name,
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

				setInitialReplyEmail(value);

			}

		}
	});

	const handleReplyEmailBlurolx = async (e) => {

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

	const handleCheckboxEnableChange = useCallback(async (checked, name) => {
		try {
			const eventKey = name;

			const updateData = {
				field: eventKey,
				value: checked,
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
				setIsEnableFooterTextChecked(checked);
			} else if (eventKey == 'is_enable_import_from_external_source') {
				setIsEnableImportFromExternalSource(checked);
			} else if (eventKey == 'is_enable_marked_verified_by_store_owner') {
				setIsEnableMarkedVerifiedByStoreOwner(checked);
			} else if (eventKey == 'is_enable_review_written_by_site_visitor') {
				setIsEnableReviewWrittenBySiteVisitor(checked);
			} else if (eventKey == 'is_enable_review_not_verified') {
				setIsEnableReviewNotVerified(checked);
			} else if (eventKey == 'is_enable_future_purchase_discount') {
				setIsEnableFuturePurchaseDiscount(checked);
			} else if (eventKey == 'is_enable_seo_rich_snippet') {
				setIsEnableSeoRichSnippetChecked(checked);
			}
		} catch (error) {
			console.error('Error updating record:', error);
		}
	}, []);


	const inputFooterTextBlur = useCallback(async (value, name) => {
		const eventKey = name;
		const eventVal = value;
		console.log("input blur : ", footerCurrentLanguage);
		if (initialData[eventKey] != eventVal) {
			const updateData = {
				field: eventKey,
				value: eventVal,
				language: footerCurrentLanguage,
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
					[footerCurrentLanguage]: {
						...(prevState ? prevState[footerCurrentLanguage] : {}),  // Ensure nested object is an object
						[eventKey]: eventVal
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
	}, [footerCurrentLanguage]);


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
						<Text variant="headingLg" as="h5">General setting</Text>
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

						<Card sectioned padding="400" roundedAbove="xs">
							<BlockStack gap="500">
								<BlockStack gap="100">
									<Text as="h3" variant="headingMd">Add {settingsJson.app_name} to your theme</Text>
									<Text >To enable the {settingsJson.app_name} Core Script on your Shopify theme, follow the steps below.</Text>
									<Text >1 . Select the theme you want to integrate with {settingsJson.app_name}</Text>
									<Text>2 . Click "Add {settingsJson.app_name} to your theme"</Text>
									<Text>3 . Make sure "{settingsJson.app_name} Core Script" is on</Text>
									<Text>4 . Click "Save"</Text>
								</BlockStack>

								<BlockStack gap="400">
									<InlineGrid columns={['twoThirds', 'oneThird']} alignItems="center">
										<Box>
											<Select
												name="theme_id"
												id="theme_id"
												options={themesOptions}
												onChange={
													handleSelectThemeChange
												}
												value={selectedTheme}
											/>
										</Box>
										<Box style={{ marginLeft: '10px' }} >
											<Button variant="primary" className="revbtn" onClick={addAppEmbedToTheme} disabled={!addAppThemeButton}  >Add {settingsJson.app_name} to your theme</Button>
										</Box>
									</InlineGrid>
								</BlockStack>
							</BlockStack>
						</Card>

						<Card sectioned padding="400" roundedAbove="xs">
							<BlockStack gap="500">
								<BlockStack gap="100">
									<Text as="h3" variant="headingMd">Localization</Text>
									<Text>Customize the languages used in {settingsJson.app_name} widgets and emails</Text>
								</BlockStack>

								<Select
									label="Primary language"
									name="defaul_language"
									id="defaul_language"
									options={formattedLanguages}
									onChange={
										handleSelectChange
									}
									value={generalSettings?.defaul_language}
								/>

								<Select
									label="Multilingual support"

									name="multilingual_support"
									id="multilingual_support"
									options={[{ "label": "Enabled", "value": "true" }, { "label": "Disabled", "value": "false" }]}
									onChange={
										handleSelectChange
									}
									value={generalSettings.multilingual_support ? "true" : "false"}
								/>

								<Text><strong>Note:</strong> When you enable multilingual support, we will use each customer's checkout language for the emails and review form.</Text>

							</BlockStack>
						</Card>


						<Card sectioned padding="400" roundedAbove="xs">
							<BlockStack gap="500">
								<BlockStack gap="100">
									<Text as="h3" variant="headingMd">Email replies address</Text>
									<Text>Customer replies to {settingsJson.app_name} emails will be sent to this email address</Text>
								</BlockStack>

								<TextField
									label="Send email replies to"
									type="email"
									value={replyEmail}
									onChange={(value) => changeInput(value, "reply_email")}
									onBlur={() => handleReplyEmailBlur(replyEmail, "reply_email")} // pass the value directly
									autoComplete="off"
									placeholder="Enter your email address"
									helpText={`Leave empty to have email replies sent to: ${shopRecords.email}`}

								/>

								{!isValidReplyEmail && <InlineError message="Email address is invalid" />}

							</BlockStack>
						</Card>


						<Card padding="400" roundedAbove="xs">
							<BlockStack gap="500">
								<InlineGrid gap="400" columns={['twoThirds', 'oneThird']} alignItems="center">
									<InlineStack align="start" gap="400" >
										<BlockStack gap="100">
											<Text as="h4" variant="headingMd">Email footer</Text>
											<p>Display text in the footer of {settingsJson.app_name} emails</p>

										</BlockStack>

									</InlineStack>
									<InlineStack align="end" gap="400" >
										<Checkbox
											label="Display Footer"
											checked={isEnableFooterTextChecked}
											onChange={(value) => handleCheckboxEnableChange(value, "email_footer_enabled")}
										/>
									</InlineStack>
								</InlineGrid>

								{generalSettings.multilingual_support &&
									<Select
										label="Editing text in"
										name="footer_email_text_language"
										id="footer_email_text_language"
										options={formattedLanguages}
										onChange={
											handleFooterLanguageChange
										}
										value={footerCurrentLanguage}
									/>
								}
								<TextField
									label="Footer text"
									value={footerText}
									onChange={(value) => changeInput(value, "footerText")}
									onBlur={() => inputFooterTextBlur(footerText, "footerText")} // pass the value directly

									disabled={!isEnableFooterTextChecked}
									autoComplete="off"
									placeholder="Enter footer text"
								/>
							</BlockStack>
						</Card>

						<Card padding="400" roundedAbove="xs">
							<BlockStack gap="500">
								<BlockStack gap="100">
									<Text as="h4" variant="headingMd">Email compliance</Text>
									<Text>Choose who receives {settingsJson.app_name} emails, and how to handle unsubscribes</Text>
								</BlockStack>
								<Select
									label="Send emails"
									name="send_email_type"
									id="send_email_type"
									options={emailsOptions}
									onChange={
										handleSelectChange
									}
									value={generalSettings?.send_email_type}
								/>
								<Select
									label="Unsubscribing"
									name="unsubscribing_type"
									id="unsubscribing_type"
									options={unsubscribeOptions}
									onChange={
										handleSelectChange
									}
									value={generalSettings?.unsubscribing_type}
								/>

							</BlockStack>

						</Card>

						<Card padding="400" roundedAbove="xs">
							<BlockStack gap="200">
								<BlockStack gap="100">
									<Text as="h4" variant="headingMd">Transparency</Text>
									<Text>{settingsJson.app_name} enables you to automatically display disclosures, in order to comply with any local laws, rules and regulations</Text>
								</BlockStack>

								<Select
									label="Verified review style"
									name="verified_review_style"
									id="verified_review_style"
									options={[{ "label": "Icon only", "value": "icon" }, { "label": "Icon + Text", "value": "icon_text" }]}
									onChange={
										handleSelectChange
									}
									value={generalSettings.verified_review_style}
								/>

								<Checkbox
									label="Indicate that a review was imported from an external source"
									helpText="Display a disclosure in the review detail popup about reviews that were imported from a CSV file or another external source."
									checked={isEnableImportFromExternalSource}
									onChange={(value) => handleCheckboxEnableChange(value, "is_enable_import_from_external_source")}
								/>

								<Checkbox
									label="Indicate that a review was marked as verified by the store owner"
									helpText="Display a disclosure in the review detail popup about site visitor reviews and imported reviews that you marked as verified."
									checked={isEnableMarkedVerifiedByStoreOwner}
									onChange={(value) => handleCheckboxEnableChange(value, "is_enable_marked_verified_by_store_owner")}
								/>

								<Checkbox
									label="Indicate that a review was written by a site visitor"
									helpText="Display a disclosure in the review detail popup about reviews that were submitted by a visitor on your store."
									checked={isEnableReviewWrittenBySiteVisitor}
									onChange={(value) => handleCheckboxEnableChange(value, "is_enable_review_written_by_site_visitor")}
								/>

								<Checkbox
									label="Indicate that a review is not verified"
									helpText="Display a disclosure about reviews from non-verified customers."
									checked={isEnableReviewNotVerified}
									onChange={(value) => handleCheckboxEnableChange(value, "is_enable_review_not_verified")}
								/>

								<Checkbox
									label="Indicate that the reviewer received a future purchase discount for adding media to their review"
									helpText="Display a disclosure when the reviewer received an incentive for adding a photo or a video to their review."
									checked={isEnableFuturePurchaseDiscount}
									onChange={(value) => handleCheckboxEnableChange(value, "is_enable_future_purchase_discount")}
								/>

							</BlockStack>
						</Card>

						<Card padding="400" roundedAbove="xs">
							<BlockStack gap="500">
								<BlockStack gap="100">
									<Text as="h4" variant="headingMd">Reviewers name format</Text>
									<Text>Customize how the reviewer name is displayed on {settingsJson.app_name} widgets</Text>
								</BlockStack>

								<Select
									label="Display name"
									name="reviewers_name_format"
									id="reviewers_name_format"
									options={reviewerNameFormatOptions}
									onChange={
										handleSelectChange
									}
									value={generalSettings.reviewers_name_format}
								/>

							</BlockStack>
						</Card>


						{/* <div className="whitebox">
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
						</div> */}

						<ProductGroupsComponent shopRecords={shopRecords} shopSessionRecords={shopSessionRecords} />

						<Card padding="400" roundedAbove="xs">
							<BlockStack gap="500">
								<BlockStack gap="100">
									<Text as="h4" variant="headingMd">SEO</Text>
									<Text>Display the average rating and number of reviews for each product in Google search results</Text>
								</BlockStack>

								<Checkbox
									label="Show product ratings in Google search results"
									checked={isEnableSeoRichSnippetChecked}
									onChange={(value) => handleCheckboxEnableChange(value, "is_enable_seo_rich_snippet")}
								/>

								<div className="formrow">
									{!isEnabledAppEmbed &&
										<EnableAppEmbedAlert alertKey="general_seo_snippet" shopRecords={shopRecords} reviewExtensionId={reviewExtensionId} activeThemeId={activeTheme.id} page="general" alertClose />
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
							</BlockStack>
						</Card>

					</div>
				</div>

			</Page>
		</>


	);
}
