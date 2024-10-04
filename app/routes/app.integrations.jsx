import { useEffect, useState, useCallback } from "react";
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import SettingPageSidebar from "./components/headerMenu/SettingPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import { findOneRecord } from './../utils/common';
import settingsJson from './../utils/settings.json';

import { json } from "@remix-run/node";
const aliExpressImage = '/images/ali-express-bg.png';
import InformationAlert from "./components/common/information-alert";
import DragIcon from "./components/icons/DragIcon";
import HandIcon from "./components/icons/HandIcon";

import {
    Page,
    Layout,
    Text,
    LegacyCard,
    LegacyStack,
    Collapsible,
    Card,
    Select,
    Spinner,
    TextField
} from "@shopify/polaris";
export async function loader({ request }) {
    try {

        const shopRecords = await getShopDetails(request);
        const generalAppearances = await findOneRecord('general_appearances', {
            shop_id: shopRecords._id,
        });

        return json({ shopRecords: shopRecords, generalAppearances: generalAppearances });

    } catch (error) {
        console.error('Error fetching records:', error);
        return json({ error: 'Error fetching records' }, { status: 500 });
    }

}

export default function InterationPage() {
    const loaderData = useLoaderData();
    const shopRecords = loaderData.shopRecords;
 
	const crumbs = [
		{ "title": "Settings", "link": "./../branding" },
		{ "title": "Integrations", "link": "" }
	];
    return (
        <>
            <Breadcrumb crumbs={crumbs} />

            <Page fullWidth>
                <SettingPageSidebar />
                <div className="pagebox">
                    

                </div>

            </Page>
        </>


    );
}
