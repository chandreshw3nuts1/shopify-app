import { useEffect, useState,  useCallback } from "react";
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import SettingPageSidebar from "./components/headerMenu/SettingPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import GeneralAppearance from "./components/settings/general-appearance";
import { findOneRecord } from './../utils/common';

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

		// const getUploadDocumentss =  getUploadDocument();

		return json({shopRecords : shopRecords,generalAppearances : generalAppearances});

	  } catch (error) {
		console.error('Error fetching records:', error);
		return json({ error: 'Error fetching records' }, { status: 500 });
	}

}

export default function Branding() {
	const loaderData = useLoaderData();
	const shopRecords = loaderData.shopRecords;
	const generalAppearances = loaderData.generalAppearances;
	
	const [crumbs, setCrumbs] = useState([
		{"title" : "Settings", "link" :"./../branding"},
		{"title" : "Branding", "link" :""}
	]);
	const [openGeneralAppr, setOpenGeneralAppr] = useState(false);
	const handleToggleGeneralAppr = useCallback(() => setOpenGeneralAppr(openGeneralAppr => !openGeneralAppr),[]);
 	return (
	<>
	<Breadcrumb crumbs={crumbs}/>
	<Page fullWidth>
				<SettingPageSidebar />
				<div className='accordian_rowmain'>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								onClick={handleToggleGeneralAppr}
								ariaExpanded={openGeneralAppr}
								ariaControls="basic-collapsible"
								className={openGeneralAppr ? 'open' : ''}
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										<i className='twenty-star'></i>
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
										General appearance
										</Text>
										<Text>
										Customize visual elements to fit your brand's look & feel
										</Text>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-arrow-down'></i>
									</div>
								</div>
							</div>
							<LegacyStack vertical>
								<Collapsible
									open={openGeneralAppr}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
								<GeneralAppearance shopRecords={shopRecords} generalAppearances={generalAppearances}/>
								</Collapsible>
							</LegacyStack>
						</LegacyCard>
					</Layout.Section>
				</div>
				
			</Page>
		</>
  
    
  );
}
