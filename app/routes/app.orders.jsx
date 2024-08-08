import React, { useEffect, useState, useRef } from "react";
import { mongoConnection } from './../utils/mongoConnection';
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import SettingPageSidebar from "./components/headerMenu/SettingPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import settingsJson from './../utils/settings.json';
import { formatTimeAgo, formatDate, addDaysToDate } from './../utils/dateFormat';
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';

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
        const db = await mongoConnection();

        const shopRecords = await getShopDetails(request);

        const limit = settingsJson.page_limit;

        const defaultSearchParams = {
            "shop": shopRecords.shop,
            "page": 1,
            "limit": limit,
            "search_keyword": "",
            "filter_status": "all",
            "filter_time": "all",
            "start_date": "",
            "end_date": "",
            "actionType": "orderListing"
        }
        return json({ defaultSearchParams, shopRecords });

    } catch (error) {
        console.error('Error fetching manage review:', error);
        return json({ error: 'Error fetching manage review' }, { status: 500 });
    }

}

export async function fetchAllOrdersApi(requestParams) {
    try {
        const response = await fetch(`${settingsJson.host_url}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestParams)
        });
        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Failed to fetch reviews:', error);
    }
}
export default function Orders() {
    const loaderData = useLoaderData();
    const [searchFormData, setSearchFormData] = useState(loaderData.defaultSearchParams);
    const shopRecords = loaderData.shopRecords;

    const [submitHandle, setSubmitHandle] = useState(false);
    const [hasMore, setHasMore] = useState(1);
    const [loading, setLoading] = useState(false);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [productDetails, setProductDetails] = useState({});
    const [reviewRequestTimingSettings, setReviewRequestTimingSettings] = useState({});

    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedTimes, setSelectedTimes] = useState('all');
    const [isAllTime, setIsAllTime] = useState(true);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sendNowLoading, setSendNowLoading] = useState(null);


    const orderUrl = "https://admin.shopify.com/store/";

    const handleKeywordChange = (e) => {
        setSearchFormData({ ...searchFormData, [e.target.name]: e.target.value });
    };

    const handleSelectStatusChange = (e) => {
        setSelectedStatus(e.target.value);
        setSearchFormData({ ...searchFormData, filter_status: e.target.value });
    };

    const handleSelectTimeChange = (e) => {
        setSelectedTimes(e.target.value);
        setSearchFormData({ ...searchFormData, filter_time: e.target.value });
        setIsAllTime(!isAllTime);
    };


    const handleStartDateChange = (date) => {


        setStartDate(date);
        setSearchFormData({ ...searchFormData, start_date: formatDate(date) });

    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setSearchFormData({ ...searchFormData, end_date: formatDate(date) });

    };



    const observer = useRef();
    const lastElementRef = useRef();

    useEffect(() => {
        if (!hasMore || loading) return;

        const handleObserver = (entries) => {
            const target = entries[0];
            if (target.isIntersecting) {
                loadMore();
            }
        };

        observer.current = new IntersectionObserver(handleObserver, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        });

        if (lastElementRef.current) {
            observer.current.observe(lastElementRef.current);
        }

        return () => {
            if (observer.current && lastElementRef.current) {
                observer.current.unobserve(lastElementRef.current);
            }
        };
    }, [lastElementRef, hasMore]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = await fetchAllOrdersApi(searchFormData);

            if (searchFormData.page === 1) {
                setFilteredOrders([...response.ordersItems]);
                setProductDetails({ ...response.mapProductDetails });

            } else {
                setFilteredOrders(prevData => ([
                    ...prevData,
                    ...response.ordersItems
                ]));
                setProductDetails(prevProducts => ({
                    ...prevProducts,
                    ...response.mapProductDetails
                }));
            }
            setReviewRequestTimingSettings({ ...response.reviewRequestTimingSettings });
            setHasMore(response.hasMore);
            setLoading(false);

        })()
    }, [searchFormData.page, submitHandle]);

    const loadMore = async () => {
        setSearchFormData((prevData) => ({
            ...prevData,
            page: prevData.page + 1,
        }));
    };

    const sendReviewRequest = async (e, requestId, index) => {
        e.preventDefault();
        if (sendNowLoading) {
            return true;
        }
        setSendNowLoading(index);

        try {
            const updateData = {
                actionType: "sendRequest",
                requestId: requestId,
                shop: shopRecords.shop,
            };
            const response = await fetch('/api/orders', {
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
                setFilteredOrders(filteredOrders.map((item, idx) => {
                    if (idx === index) {
                        return {
                            ...item,
                            request_status: 'sent',
                            manualRequestProducts: item.manualRequestProducts.map(product => ({
                                ...product,
                                status: 'sent',
                                updatedAt: new Date().toISOString()
                            }))
                        };
                    }
                    return item;
                }));

            } else {
                shopify.toast.show(data.message, {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
            }
        } catch (error) {
            console.error('Request failed:', error);
        } finally {
            setSendNowLoading(null);
        }
    }

    const cancelReviewRequest = async (e, requestId, index) => {
        e.preventDefault();

        const updateData = {
            actionType: "cancelRequest",
            requestId: requestId,
            shop: shopRecords.shop,
        };
        const response = await fetch('/api/orders', {
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
            setFilteredOrders(filteredOrders.map((item, idx) => {
                if (idx === index) {
                    return {
                        ...item,
                        request_status: 'cancel',
                        manualRequestProducts: item.manualRequestProducts.map(product => ({
                            ...product,
                            status: 'cancelled'
                        }))
                    };
                }
                return item;
            }));
        } else {
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime,
                isError: true
            });
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault();

        setSearchFormData((prevData) => ({
            ...prevData,
            page: 1,
        }));
        setSubmitHandle(!submitHandle);

    };

    const renderOrderStatus = (order, products) => {
        switch (products.status) {
            case "sent":
                return <span>Sent : {formatDate(products.updatedAt, shopRecords.timezone)}</span>;
            case "cancelled":
                return <span>Cancelled</span>;
            case "received":
                return <span>Review received</span>;
            case "pending":
                if (!reviewRequestTimingSettings.is_different_timing) {

                    if (reviewRequestTimingSettings.default_day_timing == 'never') {
                        return 'Paused';
                    }
                    if (reviewRequestTimingSettings.default_order_timing == 'purchase') {
                        return <span>Scheduled for {addDaysToDate(products.createdAt, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone)}</span>;

                    } else if (reviewRequestTimingSettings.default_order_timing == 'fulfillment') {
                        return 'Awaiting fulfillment';
                    } else {
                        return 'Awaiting delivery';
                    }
                } else {
                    if (shopRecords.country_code == order.country_code) {
                        if (reviewRequestTimingSettings.domestic_order_timing == 'purchase') {
                            return <span>Scheduled for {addDaysToDate(products.createdAt, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone)}</span>;

                        } else if (reviewRequestTimingSettings.domestic_order_timing == 'fulfillment') {
                            return 'Awaiting fulfillment';
                        }
                    } else {

                        if (reviewRequestTimingSettings.international_order_timing == 'purchase') {
                            return <span>Scheduled for {addDaysToDate(products.createdAt, reviewRequestTimingSettings.international_day_timing, shopRecords.timezone)}</span>;

                        } else if (reviewRequestTimingSettings.international_order_timing == 'fulfillment') {
                            return 'Awaiting fulfillment';
                        }
                    }
                }
                break;
            case "fulfilled":
                if (!reviewRequestTimingSettings.is_different_timing) {

                    if (reviewRequestTimingSettings.default_day_timing == 'never') {
                        return 'Paused';
                    }
                    if (reviewRequestTimingSettings.default_order_timing == 'purchase') {
                        return <span>Scheduled for {addDaysToDate(products.createdAt, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone)}</span>;
                    } else if (reviewRequestTimingSettings.default_order_timing == 'fulfillment') {
                        return <span>Scheduled for {addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone)}</span>;
                    } else if (reviewRequestTimingSettings.default_order_timing == 'delivery' && reviewRequestTimingSettings.fallback_timing != "") {
                        return <span>Scheduled for {addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.fallback_timing, shopRecords.timezone)}</span>;
                    } else {
                        return "Awaiting delivery";
                    }
                } else {
                    if (shopRecords.country_code == order.country_code) {
                        if (reviewRequestTimingSettings.domestic_order_timing == 'purchase') {
                            return <span>Scheduled for {addDaysToDate(products.createdAt, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone)}</span>;

                        } else if (reviewRequestTimingSettings.domestic_order_timing == 'fulfillment') {
                            return <span>Scheduled for {addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone)}</span>;

                        }
                    } else {

                        if (reviewRequestTimingSettings.international_order_timing == 'purchase') {
                            return <span>Scheduled for {addDaysToDate(products.createdAt, reviewRequestTimingSettings.international_day_timing, shopRecords.timezone)}</span>;

                        } else if (reviewRequestTimingSettings.international_order_timing == 'fulfillment') {
                            return <span>Scheduled for {addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.international_day_timing, shopRecords.timezone)}</span>;

                        }
                    }
                }
                break;
            case "delivered":
                if (!reviewRequestTimingSettings.is_different_timing) {

                    if (reviewRequestTimingSettings.default_day_timing == 'never') {
                        return 'Paused';
                    }
                    if (reviewRequestTimingSettings.default_order_timing == 'purchase') {
                        return <span>Scheduled for {addDaysToDate(products.createdAt, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone)}</span>;
                    } else if (reviewRequestTimingSettings.default_order_timing == 'fulfillment') {
                        return <span>Scheduled for {addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone)}</span>;
                    } else if (reviewRequestTimingSettings.default_order_timing == 'delivery') {
                        return <span>Scheduled for {addDaysToDate(products.delivered_date, reviewRequestTimingSettings.default_day_timing, shopRecords.timezone)}</span>;
                    } else {
                        return "Awaiting delivery";
                    }
                } else {
                    if (shopRecords.country_code == order.country_code) {
                        if (reviewRequestTimingSettings.domestic_order_timing == 'purchase') {
                            return <span>Scheduled for {addDaysToDate(products.createdAt, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone)}</span>;

                        } else if (reviewRequestTimingSettings.domestic_order_timing == 'fulfillment') {
                            return <span>Scheduled for {addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.domestic_day_timing, shopRecords.timezone)}</span>;

                        }
                    } else {

                        if (reviewRequestTimingSettings.international_order_timing == 'purchase') {
                            return <span>Scheduled for {addDaysToDate(products.createdAt, reviewRequestTimingSettings.international_day_timing, shopRecords.timezone)}</span>;

                        } else if (reviewRequestTimingSettings.international_order_timing == 'fulfillment') {
                            return <span>Scheduled for {addDaysToDate(products.fulfillment_date, reviewRequestTimingSettings.international_day_timing, shopRecords.timezone)}</span>;

                        }
                    }
                }
                break;
            default:
                return <span>{`Status: ${products.status}`}</span>;
        }
    }
    const crumbs = [
        { "title": "Settings", "link": "./../branding" },
        { "title": "Orders", "link": "" }
    ];
    return (
        <>
            <Breadcrumb crumbs={crumbs} />
            <Page fullWidth>
                <SettingPageSidebar />
                <div className="graywrapbox gapy24">
                    <div className="subtitlebox">
                        <h2>Orders</h2>
                        <p>Check you all order review for better decision making.</p>
                    </div>
                    <div className="whitebox ordersearchbox">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-6">
                                    <div className="form-group">
                                        <input type="text" name="search_keyword" className="form-control" value={searchFormData.search_keyword} onChange={handleKeywordChange} placeholder="Search by email" />
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <select value={selectedStatus} onChange={handleSelectStatusChange} className="input_text">
                                            <option value="all">All orders</option>
                                            <option value="sent">Sent orders</option>
                                            <option value="pending">Scheduled/Pending fulfilled</option>
                                            <option value="received">Review received</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-lg-3">
                                    <div className="form-group">
                                        <select value={selectedTimes} onChange={handleSelectTimeChange} className="input_text">
                                            <option value="all">All time</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>
                                </div>
                                {!isAllTime &&
                                    <>
                                        <div className="col-lg-3">
                                            <div className="form-group">
                                                <DatePicker className="form-control" maxDate={new Date()} format="y-MM-dd" onChange={handleStartDateChange} value={startDate} />

                                            </div>
                                        </div>
                                        <div className="col-lg-3">
                                            <div className="form-group">
                                                <DatePicker className="form-control" maxDate={new Date()} format="y-MM-dd" onChange={handleEndDateChange} value={endDate} />

                                            </div>
                                        </div>
                                    </>
                                }

                                <div className="col-lg-12">
                                    <div className="btnwrap m-0">
                                        <input type="submit" className="revbtn" value="Search" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    {filteredOrders.length > 0 &&
                        <div className="orderlistmain">
                            {filteredOrders.map((result, index) => (
                                <div className="whitebox order_row" key={index}>
                                    <div className="topmetabox flxrow">
                                        <div className="titlebox flxflexi">{result.order_id ? result.first_name + " " + result.last_name : result.email}</div>
                                        <div className="actionbox">
                                            {result.order_id &&
                                                <>
                                                    <a href={`${orderUrl}${shopRecords.name}/orders/${result.order_id}`} target="_blank" className="revbtn lightbtn">
                                                        <i className="twenty-carticon"></i>
                                                        Go to order
                                                    </a>
                                                    {(result.request_status == "pending" || result.request_status == "cancel") &&
                                                        <>
                                                            <button href="#" onClick={(e) => sendReviewRequest(e, result._id, index)} disabled={sendNowLoading === index} className="revbtn lightbtn">
                                                                <i className="twenty-senticon"></i>
                                                                Send now
                                                            </button>
                                                        </>
                                                    }
                                                    {(result.request_status == "pending") &&
                                                        <a href="#" onClick={(e) => cancelReviewRequest(e, result._id, index)} className="revbtn lightbtn">
                                                            <i className="twenty-canceliconr"></i>
                                                            Cancel
                                                        </a>
                                                    }
                                                    {result.request_status == "cancel" && (
                                                        <span className="revbtn lightbtn">
                                                            <i className="twenty-canceliconr"></i>
                                                            Cancel
                                                        </span>
                                                    )}


                                                </>
                                            }
                                            <span className="revbtn lightbtn">
                                                <i className="twenty-timericon"></i>
                                                {formatTimeAgo(result.createdAt, shopRecords.timezone)}
                                            </span>
                                        </div>
                                    </div>
                                    {
                                        result.manualRequestProducts.length > 0 &&
                                        <div className="suborderwrap">
                                            {result.manualRequestProducts.map((products, PIx) => (
                                                <div className="suborderrow flxrow" key={PIx}>
                                                    <div className="ordername flxflexi">{productDetails[products.product_id]
                                                        ? productDetails[products.product_id].title
                                                        : ""}</div>
                                                    <div className="orderstatus flxfix">
                                                        {renderOrderStatus(result, products)}


                                                        {/* {products.status === "sent" && (
                                                            <span>Sent : {formatTimeAgo(products.updatedAt)}</span>
                                                        )}
                                                        {products.status === "fulfilled" && (
                                                            <span>Scheduled for {formatDate(products.createdAt)}</span>
                                                        )}

                                                        {products.status === "cancelled" && (
                                                            <span>Cancelled</span>
                                                        )}


                                                        {products.status === "received" && (
                                                            <span>Review received</span>
                                                        )} */}

                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    }
                                </div>
                            ))}
                        </div>
                    }
                    <div ref={lastElementRef}>
                        {loading && (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                                <Spinner size="large" />
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
                            {hasMore == 1 ? "" : <p>No more pages to load.</p>}
                        </div>

                    </div>
                </div>
            </Page >
        </>

    );
}
