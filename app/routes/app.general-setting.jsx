import { useEffect, useState,  useCallback } from "react";
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import SettingPageSidebar from "./components/headerMenu/SettingPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import GeneralAppearance from "./components/settings/general-appearance";
import { findOneRecord } from './../utils/common';
import CrownIcon from '../images/crown-icon.svg'
import { Image } from "react-bootstrap";
import AlertInfo from "./components/AlertInfo";


// import ColorPicker from "./components/svgIconPicker";
import { json } from "@remix-run/node";

import {
  Layout,
  Page,
  LegacyCard,
  Spinner,
  Text,
  Card,LegacyStack, TextField, Button, FormLayout,Collapsible
} from "@shopify/polaris";

export async function loader({request}) {
	try {
		
		const shopRecords = await getShopDetails(request);
		const generalAppearances = await findOneRecord('general_appearances',{
			shop_id: shopRecords._id,
		});


		return json({shopRecords : shopRecords,generalAppearances : generalAppearances});

	  } catch (error) {
		console.error('Error fetching records:', error);
		return json({ error: 'Error fetching records' }, { status: 500 });
	}

}

export default function GeneralSettings() {
	const loaderData = useLoaderData();
	const shopRecords = loaderData.shopRecords;
	const generalAppearances = loaderData.generalAppearances;
	
	const [crumbs, setCrumbs] = useState([
		{"title" : "Settings", "link" :"./../branding"},
		{"title" : "General setting", "link" :""}
	]);
 	return (
	<>
		<Breadcrumb crumbs={crumbs}/>
		<Page fullWidth>
			<SettingPageSidebar />

			<div className="pagebox">
				<div className="graywrapbox gapy24">
					{/* <div className="subtitlebox">
						<h2>General setting</h2>
						<p>Choose the right Loox plan to grow your business</p>
					</div> */}
					<div className="general_row">
						<a href="#" className="whitebox ourplanbox flxrow">
							<div className="iconbox flxfix">
								<Image src={CrownIcon} alt="w3 plans" width={100} height={100} />
							</div>
							<div className="detailbox flxflexi">
								<h6>Our plans</h6>
								<p>Choose the right W3 Reviews plan to grow your business</p>
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
									<h4>Add W3 Reviews to your theme</h4>
									<p>Send customers a next-purchase code after submitting a review with a photo/video.</p>
								</div>
							</div>
							<div className="formrow flxrow gapx24">
								<div className="flxflexi">
									<div className="form-group m-0">
										<select className="input_text">
											<option>Theme 1</option>
											<option>Theme 2</option>
											<option>Theme 3</option>
											<option>Theme 4</option>
										</select>
									</div>
								</div>
								<div className="flxfix">
									<input type="submit" value="Add W3 Reviews to your theme" className="revbtn" />
								</div>
							</div>
						</div>
					</div>
					<div className="whitebox">
						<div className="general_row">
							<div className="row_title">
								<div className="flxflexi lefttitle">
									<h4>Localization</h4>
									<p>Customize the languages used in Loox widgets and emails</p>
								</div>
							</div>
							<div className="formrow">
								<div className="row">
									<div className="col-lg-6">
										<div className="form-group m-0">
											<label htmlFor="">Primary language</label>
											<select className="input_text">
												<option>English</option>
												<option>Franch</option>
												<option>Spanish</option>
												<option>Gujarati</option>
											</select>
										</div>
									</div>
									<div className="col-lg-6">
										<div className="form-group m-0">
											<label htmlFor="">Multilingual support</label>
											<select className="input_text">
												<option>Enabled</option>
												<option>Disabled</option>
											</select>
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
									<p>Customer replies to Loox emails will be sent to this email address</p>
								</div>
							</div>
							<div className="formrow">
								<div className="row">
									<div className="col-lg-12">
										<div className="form-group m-0">
											<label htmlFor="">Send email replies to</label>
											<input type="text" className="input_text" placeholder="Enter your email address" />
										</div>
									</div>
									<div className="col-lg-12">
										<div className="inputnote">Leave empty to have email replies sent to: <strong>yash.w3nuts+20@gmail.com</strong></div>
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
									<p>Display text in the footer of Loox emails</p>
								</div>
								<div className="flxfix rightaction">
									<div className="form-check form-switch">
										<input className="form-check-input" type="checkbox" role="switch" name="DisplayFooter" id="DisplayFooter" />
										<label className="form-check-label" for="DisplayFooter">Display Footer</label>
									</div>
								</div>
							</div>
							<div className="formrow">
								<div className="row gapy16">
									<div className="col-lg-4">
										<div className="form-group m-0">
											<label htmlFor="">Primary language</label>
											<select className="input_text">
												<option>English</option>
												<option>Franch</option>
												<option>Spanish</option>
												<option>Gujarati</option>
											</select>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="form-group m-0">
											<label htmlFor="">Footer text</label>
											<input type="text" className="input_text" placeholder="Enter your email address" />
										</div>
									</div>
									<div className="col-lg-12">
										<div className="btnwrap m-0">
											<input type="submit" value="View sample" className="revbtn" />
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
									<p>Choose who receives Loox emails, and how to handle unsubscribes</p>
								</div>
							</div>
							<div className="formrow">
								<div className="row gapy16">
									<div className="col-lg-12">
										<div className="form-group m-0">
											<label htmlFor="">Send emails</label>
											<select className="input_text">
												<option>Everyone</option>
												<option>Customers who consent to receive marketing emails</option>
											</select>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="form-group m-0">
											<label htmlFor="">Unsubscribing</label>
											<select className="input_text">
												<option>Does not unsubscribe the customer from Shopify marketing emails</option>
												<option>Also unsubscribes the customer from Shopify marketing emails</option>
											</select>
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
									<p>W3 enables you to automatically display disclosures, in order to comply with any local laws, rules and regulations</p>
								</div>
							</div>
							<div className="formrow">
								<div className="row gapy16">
									<div className="col-lg-4">
										<div className="form-group m-0">
											<label htmlFor="">Verified review style</label>
											<select className="input_text">
												<option>Icon only</option>
												<option>Icon + Text</option>
											</select>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="form-group m-0">
											<div className="form-check form-switch">
												<input className="form-check-input" type="checkbox" role="switch" name="Transparency01" id="Transparency01" />
												<label className="form-check-label" for="Transparency01">Indicate that a review was imported from an external source <span>Display a disclosure in the review detail popup about reviews that were imported from a CSV file or another external source.</span></label>
											</div>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="form-group m-0">
											<div className="form-check form-switch">
												<input className="form-check-input" type="checkbox" role="switch" name="Transparency02" id="Transparency02" />
												<label className="form-check-label" for="Transparency02">Indicate that a review was marked as verified by the store owner<span>Display a disclosure in the review detail popup about site visitor reviews and imported reviews that you marked as verified.</span></label>
											</div>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="form-group m-0">
											<div className="form-check form-switch">
												<input className="form-check-input" type="checkbox" role="switch" name="Transparency03" id="Transparency03" />
												<label className="form-check-label" for="Transparency03">Indicate that a review was written by a site visitor<span>Display a disclosure in the review detail popup about reviews that were submitted by a visitor on your store.</span></label>
											</div>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="form-group m-0">
											<div className="form-check form-switch">
												<input className="form-check-input" type="checkbox" role="switch" name="Transparency04" id="Transparency04" />
												<label className="form-check-label" for="Transparency04">Indicate that a review is not verified<span>Display a disclosure about reviews from non-verified customers.</span></label>
											</div>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="form-group m-0">
											<div className="form-check form-switch">
												<input className="form-check-input" type="checkbox" role="switch" name="Transparency05" id="Transparency05" />
												<label className="form-check-label" for="Transparency05">Indicate that the reviewer received a future purchase discount for adding media to their review<span>Display a disclosure when the reviewer received an incentive for adding a photo or a video to their review.</span></label>
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
									<p>Customize how the reviewer name is displayed on Loox widgets</p>
								</div>
							</div>
							<div className="formrow">
								<div className="row gapy16">
									<div className="col-lg-12">
										<div className="form-group m-0">
											<label htmlFor="">Display name</label>
											<select className="input_text">
												<option>First name, Last name (John S.)</option>
												<option>First name (John)</option>
												<option>Last name (Smith)</option>
												<option>First initial, last initial (J. S.)</option>
											</select>
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
									<p>Define allowed domains where you want to display Loox widgets</p>
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
										<input className="form-check-input" type="checkbox" role="switch" name="ratingongooglesearch" id="ratingongooglesearch" />
										<label className="form-check-label" for="ratingongooglesearch">Show product ratings in Google search results</label>
									</div>
								</div>
							</div>
							<div className="formrow">
								<AlertInfo 
									alertContent={`To activate the feature, <a href="#">enable</a> the Loox Core Script. <a href="#">Learn more</a>`}
									alertClose
									// conlink="/"
									colorTheme="primarybox"
								 />
							</div>
							<div className="formrow">
								<AlertInfo 
									alertContent={`W3 will add the relevant rich snippets code to your store's theme. <a href="#">Click here to test search result</a>`}
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
