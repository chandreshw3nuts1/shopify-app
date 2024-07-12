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

				<Layout.Section>
					
				
				</Layout.Section>

		</Page>
	</>
  
    
  );
}
