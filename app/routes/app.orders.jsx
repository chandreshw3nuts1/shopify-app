import { useEffect, useState, useCallback } from "react";
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import SettingPageSidebar from "./components/headerMenu/SettingPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import GeneralAppearance from "./components/settings/general-appearance";
import { findOneRecord } from './../utils/common';

import { json } from "@remix-run/node";

import {
    Layout,
    Page,
    LegacyCard,
    Spinner,
    Text,
    Card, LegacyStack, TextField, Button, FormLayout, Collapsible
} from "@shopify/polaris";

export async function loader({ request }) {
    try {

        const shopRecords = await getShopDetails(request);
        const generalAppearances = await findOneRecord('general_appearances',{
			shop_id: shopRecords._id,
		});

        return json({ shopRecords: shopRecords });

    } catch (error) {
        console.error('Error fetching manage review:', error);
        return json({ error: 'Error fetching manage review' }, { status: 500 });
    }

}

export default function Orders() {
    const loaderData = useLoaderData();
    const shopRecords = loaderData.shopRecords;

    const [crumbs, setCrumbs] = useState([
        { "title": "Settings", "link": "./../branding" },
        { "title": "Orders", "link": "" }
    ]);
    return (
        <>
            <Breadcrumb crumbs={crumbs} />
            <Page fullWidth>
                <SettingPageSidebar />
                Order will appear here
            </Page>
        </>

    );
}
