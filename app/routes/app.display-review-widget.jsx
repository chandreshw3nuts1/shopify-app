import { useEffect, useState, useCallback } from "react";
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import ReviewPageSidebar from "./components/headerMenu/ReviewPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import GeneralAppearance from "./components/settings/general-appearance";
import { findOneRecord, getShopifyLatestProducts } from './../utils/common';
import { json } from "@remix-run/node";
import { useNavigate } from 'react-router-dom';
import settingsJson from './../utils/settings.json';

import { Image } from "react-bootstrap";
import widgetThumb01 from './../images/widget-thumbs/Review-Widget-image.jpg'
import widgetThumb02 from './../images/widget-thumbs/Star-Rating-Badge-image.jpg'
import widgetThumb03 from './../images/widget-thumbs/Questions-and-Answers-image.jpg'
import widgetThumb04 from './../images/widget-thumbs/Reviews-Carousel-image.jpg'
import widgetThumb05 from './../images/widget-thumbs/All-Reviews-Page-image.jpg'
import widgetThumb06 from './../images/widget-thumbs/Floating-Reviews-Tab-image.jpg'
import widgetThumb07 from './../images/widget-thumbs/W3-Reviews-Medals-image.jpg'
import widgetThumb08 from './../images/widget-thumbs/Verified-Reviews-Counter-image.jpg'
import widgetThumb09 from './../images/widget-thumbs/All-Reviews-Counter-image.jpg'

import {
    Page
} from "@shopify/polaris";

export async function loader({ request }) {
    try {

        const shopRecords = await getShopDetails(request);
        const generalAppearances = await findOneRecord('general_appearances', {
            shop_id: shopRecords._id,
        });

        const reviewExtensionId = process.env.SHOPIFY_ALL_REVIEW_EXTENSION_ID;

        const productWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/product-review-widget`);
        const ratingWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/rating-widget`);

        const shopifyProduct = await getShopifyLatestProducts(shopRecords.shop);
        const productName = (shopifyProduct.products) ? encodeURIComponent(`/products/${shopifyProduct.products[0]['handle']}`) : "/products";

        const productReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?previewPath=${productName}&addAppBlockId=${productWidgetExtenstionId}&target=sectionId`;
        const ratingReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?previewPath=${productName}&addAppBlockId=${ratingWidgetExtenstionId}&target=mainSection`;
        const extensionUrs = {
            productReviewWidgetUrl,
            ratingReviewWidgetUrl
        }

        return json({ shopRecords, generalAppearances, extensionUrs });

    } catch (error) {
        console.error('Error fetching records:', error);
        return json({ error: 'Error fetching records' }, { status: 500 });
    }

}

export default function DisplayReviewWidget() {
    const loaderData = useLoaderData();
    const shopRecords = loaderData.shopRecords;
    const extensionUrs = loaderData.extensionUrs;
    const generalAppearances = loaderData.generalAppearances;
    const [isClient, setIsClient] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsClient(true);
    }, []);

    const redirectToCustomizePage = (e, type = "") => {
        e.preventDefault();
        if (type == 'productWidget') {
            navigate('/app/widget-customize/product-review-widget');
        } else if (type == 'sidebarWidget') {
            navigate('/app/widget-customize/sidebar-review-widget');
        }

    }
    const crumbs = [
        { title: "Review", "link": "./../review" },
        { title: "Reviews widgets", "link": "" },
    ];
    return (
        <>
            <Breadcrumb crumbs={crumbs} />
            <Page fullWidth>
                <ReviewPageSidebar />
                <div className="pagebox">
                    <div className="widget_main_wrap">
                        <div className="widgetrow">
                            <div className="widgetboxwrp">
                                <div className="widgetbox flxcol">
                                    <div className="imagebox flxfix">
                                        <Image src={widgetThumb01} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>Product Review Widget</h3>
                                        <p>Collect and display product reviews on your product pages.</p>
                                        <div className="btnwrap">
                                            <a href="#" onClick={(e) => redirectToCustomizePage(e, "productWidget")} className="simplelink">Customize</a>
                                            <a href={extensionUrs.productReviewWidgetUrl} target="_blank" className="revbtn smbtn">Add to theme</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widgetboxwrp">
                                <div className="widgetbox flxcol">
                                    <div className="imagebox flxfix">
                                        <Image src={widgetThumb02} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>Star Rating Badge</h3>
                                        <p>Show the average rating of your products and how many reviews they've received.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink"></a>
                                            <a href={extensionUrs.ratingReviewWidgetUrl} target="_blank" className="revbtn smbtn">Add to theme</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widgetboxwrp">
                                <div className="widgetbox flxcol">
                                    <div className="imagebox flxfix">
                                        <Image src={widgetThumb03} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>Questions and Answers</h3>
                                        <p>Let potential customers ask questions about your products.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink">Customize</a>
                                            <a href="#" className="revbtn smbtn">Add to theme</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widgetboxwrp">
                                <div className="widgetbox flxcol">
                                    <div className="imagebox flxfix">
                                        <Image src={widgetThumb04} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>Reviews Carousel</h3>
                                        <p>Showcase your best reviews in a carousel on a page of your choice.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink">Customize</a>
                                            <a href="#" className="revbtn smbtn">Add to theme</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widgetboxwrp">
                                <div className="widgetbox flxcol">
                                    <div className="imagebox flxfix">
                                        <Image src={widgetThumb05} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>All Reviews Page</h3>
                                        <p>Show all your reviews and collect shop-level reviews on a dedicated page.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink">Customize</a>
                                            <a href="#" className="revbtn smbtn">Add to theme</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widgetboxwrp">
                                <div className="widgetbox flxcol">
                                    <div className="imagebox flxfix">
                                        <Image src={widgetThumb06} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>Sidebar Reviews Widget
                                        </h3>
                                        <p>Floating Reviews Tab Access all your reviews and collect store reviews through a floating tab at the side of the page.</p>
                                        <div className="btnwrap">
                                            <a href="#" onClick={(e) => redirectToCustomizePage(e, "sidebarWidget")} className="simplelink">Customize</a>
                                            <a href="#" className="revbtn smbtn">Activate</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widgetboxwrp">
                                <div className="widgetbox flxcol">
                                    <div className="imagebox flxfix">
                                        <Image src={widgetThumb07} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>W3 Reviews Medals</h3>
                                        <p>Display your W3 Reviews Medals as a badge. Manage.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink">Customize</a>
                                            <a href="#" className="revbtn smbtn">Add to theme</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widgetboxwrp">
                                <div className="widgetbox flxcol">
                                    <div className="imagebox flxfix">
                                        <Image src={widgetThumb08} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>Verified Reviews Counter</h3>
                                        <p>Display the number of verified reviews your products have received.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink">Customize</a>
                                            <a href="#" className="revbtn smbtn">Add to theme</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="widgetboxwrp">
                                <div className="widgetbox flxcol">
                                    <div className="imagebox flxfix">
                                        <Image src={widgetThumb09} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>All Reviews Counter</h3>
                                        <p>Shows the total number of published reviews you've received and their average rating.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink">Customize</a>
                                            <a href="#" className="revbtn smbtn">Add to theme</a>
                                        </div>
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
