import { useEffect, useState,  useCallback } from "react";
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import SettingPageSidebar from "./components/headerMenu/SettingPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import GeneralAppearance from "./components/settings/general-appearance";
import { findOneRecord } from './../utils/common';
import { json } from "@remix-run/node";

import {
  Page
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

export default function Branding() {
	const loaderData = useLoaderData();
	const shopRecords = loaderData.shopRecords;
	const generalAppearances = loaderData.generalAppearances;
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	const [crumbs, setCrumbs] = useState([
		{"title" : "Settings", "link" :"./../branding"},
		{"title" : "Branding", "link" :""}
	]);
 	return (
	<>
		<Breadcrumb crumbs={crumbs}/>
		 
		<Page fullWidth>
			<SettingPageSidebar />
			<div className="pagebox">
				<div className="graywrapbox gapy24">
					<div className="subtitlebox">
						<h2>General appearance</h2>
						<p>Customize visual elements to fit your brand's look & feel</p>
					</div>
					<GeneralAppearance shopRecords={shopRecords} generalAppearances={generalAppearances}/>

				</div>
			
			</div>

		</Page>
	</>
  
    
  );
}
