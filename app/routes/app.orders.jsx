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
                <div className="graywrapbox">
                    <div className="subtitlebox">
                        <h2>Orders</h2>
                        <p>Check you all order review for better decision making.</p>
                    </div>
                    <div className="whitebox ordersearchbox">
                        <form action="">
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Search by email" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <select className="input_text">
                                            <option>All orders</option>
                                            <option>Pending orders</option>
                                            <option>Scheduled order</option>
                                            <option>Sent orders</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <select className="input_text">
                                            <option>All time</option>
                                            <option>Last month</option>
                                            <option>Last year</option>
                                            <option>Custom</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="Start date" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <input type="text" className="form-control" placeholder="End date" />
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="btnwrap m-0">
                                        <input type="submit" className="revbtn" value="Search" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="orderlistmain">
                        <div className="whitebox order_row">
                            <div className="topmetabox flxrow">
                                <div className="titlebox flxflexi">chandresh.w3nuts+2@gmail.com</div>
                                <div className="actionbox">
                                    <a href="#" className="revbtn lightbtn">
                                        <i className="twenty-carticon"></i>
                                        Go to order
                                    </a>
                                    <a href="#" className="revbtn lightbtn">
                                        <i className="twenty-senticon"></i>
                                        Send now
                                    </a>
                                    <a href="#" className="revbtn lightbtn">
                                        <i className="twenty-canceliconr"></i>
                                        Cancel
                                    </a>
                                    <a href="#" className="revbtn lightbtn">
                                        <i className="twenty-timericon"></i>
                                        Yesterday
                                    </a>
                                </div>
                            </div>
                            <div className="suborderwrap">
                                <div className="suborderrow flxrow">
                                    <div className="ordername flxflexi">Adidas T-shirt</div>
                                    <div className="orderstatus flxfix">
                                        <span>Scheduled for 2024-07-13</span>
                                    </div>
                                </div>
                                <div className="suborderrow flxrow">
                                    <div className="ordername flxflexi">Puma T-shirt</div>
                                    <div className="orderstatus flxfix">
                                        <span>Sent : 4 days ago</span>
                                    </div>
                                </div>
                                <div className="suborderrow flxrow">
                                    <div className="ordername flxflexi">Nike T-shirt</div>
                                    <div className="orderstatus flxfix">
                                        <span>Scheduled for 2024-07-13</span>
                                    </div>
                                </div>
                                <div className="suborderrow flxrow">
                                    <div className="ordername flxflexi">Tommy T-shirt</div>
                                    <div className="orderstatus flxfix">
                                        <span>Sent : 4 days ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="whitebox order_row">
                            <div className="topmetabox flxrow">
                                <div className="titlebox flxflexi">chandresh.w3nuts+2@gmail.com</div>
                                <div className="actionbox">
                                    <a href="#" className="revbtn lightbtn">
                                        <i className="twenty-carticon"></i>
                                        Go to order
                                    </a>
                                    <a href="#" className="revbtn lightbtn">
                                        <i className="twenty-senticon"></i>
                                        Send now
                                    </a>
                                    <a href="#" className="revbtn lightbtn">
                                        <i className="twenty-canceliconr"></i>
                                        Cancel
                                    </a>
                                    <a href="#" className="revbtn lightbtn">
                                        <i className="twenty-timericon"></i>
                                        Yesterday
                                    </a>
                                </div>
                            </div>
                            <div className="suborderwrap">
                                <div className="suborderrow flxrow">
                                    <div className="ordername flxflexi">Adidas T-shirt</div>
                                    <div className="orderstatus flxfix">
                                        <span>Scheduled for 2024-07-13</span>
                                    </div>
                                </div>
                                <div className="suborderrow flxrow">
                                    <div className="ordername flxflexi">Puma T-shirt</div>
                                    <div className="orderstatus flxfix">
                                        <span>Sent : 4 days ago</span>
                                    </div>
                                </div>
                                <div className="suborderrow flxrow">
                                    <div className="ordername flxflexi">Nike T-shirt</div>
                                    <div className="orderstatus flxfix">
                                        <span>Scheduled for 2024-07-13</span>
                                    </div>
                                </div>
                                <div className="suborderrow flxrow">
                                    <div className="ordername flxflexi">Tommy T-shirt</div>
                                    <div className="orderstatus flxfix">
                                        <span>Sent : 4 days ago</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        </>

    );
}
