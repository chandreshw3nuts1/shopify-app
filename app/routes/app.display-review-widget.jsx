import { useEffect, useState, useCallback } from "react";
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import ReviewPageSidebar from "./components/headerMenu/ReviewPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import { getShopifyLatestProducts } from './../utils/common';
import { json } from "@remix-run/node";
import { useNavigate } from 'react-router-dom';
import settingsJson from './../utils/settings.json';

import sidebarReviewWidgetCustomizes from "./models/sidebarReviewWidgetCustomizes";
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

        const sidebarReviewWidgetCustomizesModel = await sidebarReviewWidgetCustomizes.findOne({ shop_id: shopRecords._id });

        const reviewExtensionId = process.env.SHOPIFY_ALL_REVIEW_EXTENSION_ID;

        const productWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/product-review-widget`);
        const ratingWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/rating-widget`);
        const allReviewWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/all-review-counter-widget`);
        const videoSliderWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/video-slider-widget`);
        const testimonialSliderWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/testimonials-carousel-widget`);
        const cartReviewWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/cart-review-widget`);
        const galleryCarouselWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/gallery-carousel-widget`);
        const cardCarouselWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/card-carousel-widget`);
        
        

        const shopifyProduct = await getShopifyLatestProducts(shopRecords.shop);
        const productName = (shopifyProduct.products) ? encodeURIComponent(`/products/${shopifyProduct.products[0]['handle']}`) : "/products";
        const cartPreviewPath = encodeURIComponent("/cart");

        const productReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?previewPath=${productName}&addAppBlockId=${productWidgetExtenstionId}&target=sectionId`;
        const ratingReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?previewPath=${productName}&addAppBlockId=${ratingWidgetExtenstionId}&target=mainSection`;
        const allReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?addAppBlockId=${allReviewWidgetExtenstionId}&target=sectionId`;
        const videoSliderWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?addAppBlockId=${videoSliderWidgetExtenstionId}&target=sectionId`;
        const testimonialSliderWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?addAppBlockId=${testimonialSliderWidgetExtenstionId}&target=sectionId`;
        const cartReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?previewPath=${cartPreviewPath}&addAppBlockId=${cartReviewWidgetExtenstionId}&target=cart`;
        const galleryCarouselWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?addAppBlockId=${galleryCarouselWidgetExtenstionId}&target=sectionId`;
        const cardCarouselWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?addAppBlockId=${cardCarouselWidgetExtenstionId}&target=sectionId`;
        
        const extensionUrs = {
            productReviewWidgetUrl,
            ratingReviewWidgetUrl,
            allReviewWidgetUrl,
            videoSliderWidgetUrl,
            cartReviewWidgetUrl,
            testimonialSliderWidgetUrl,
            galleryCarouselWidgetUrl,
            cardCarouselWidgetUrl
        }

        return json({ shopRecords, sidebarReviewWidgetCustomizesModel, extensionUrs });

    } catch (error) {
        console.error('Error fetching records:', error);
        return json({ error: 'Error fetching records' }, { status: 500 });
    }

}

export default function DisplayReviewWidget() {
    const loaderData = useLoaderData();
    const shopRecords = loaderData.shopRecords;
    const extensionUrs = loaderData.extensionUrs;
    const sidebarReviewWidgetCustomizes = loaderData.sidebarReviewWidgetCustomizesModel;
    const [isClient, setIsClient] = useState(false);
    const [isSidebarWidgetActivated, setIsSidebarWidgetActivated] = useState(sidebarReviewWidgetCustomizes?.isActive);

    const navigate = useNavigate();

    useEffect(() => {
        setIsClient(true);
    }, []);



    const changeWidgetActivationStatus = async (widgetType) => {
        let value = "", field = "";

        if (widgetType == 'sidebar') {
            value = !isSidebarWidgetActivated;
            field = "isActive";
        }

        const updateData = {
            field: field,
            value: value,
            shop: shopRecords.shop,
            actionType: "sidebarReviewCustomize"
        };
        const response = await fetch('/api/customize-widget', {
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
        if (widgetType == 'sidebar') {
            setIsSidebarWidgetActivated(!isSidebarWidgetActivated);
        }
    };


    const redirectToCustomizePage = (e, type = "") => {
        e.preventDefault();
        if (type == 'productWidget') {
            navigate('/app/widget-customize/product-review-widget');
        } else if (type == 'sidebarWidget') {
            navigate('/app/widget-customize/sidebar-review-widget');
        } else if (type == 'floatingWidget') {
            navigate('/app/widget-customize/floating-widget');
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
                                        <h3>Testimonials Carousel Widget</h3>
                                        <p>Showcase the text of your best reviews in an eye-catching, dynamic display.</p>
                                        <div className="btnwrap">
                                        <a href="#" className="simplelink"></a>
                                        <a href={extensionUrs.testimonialSliderWidgetUrl} target="_blank" className="revbtn smbtn">Add to theme</a>
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
                                            {isSidebarWidgetActivated ? (
                                                <label className="revbtn smbtn blackbtn">Activated</label>
                                            ) : (
                                                <button onClick={() => changeWidgetActivationStatus('sidebar')} className="revbtn smbtn">Activate</button>
                                            )}
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
                                        <h3>Cart Reviews Widget</h3>
                                        <p>Reduce cart abandonment by showing ratings and reviews on the cart page, securing the trust needed to make the sale.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink"></a>
                                            <a href={extensionUrs.cartReviewWidgetUrl} target="_blank" className="revbtn smbtn">Add to theme</a>
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
                                        <h3>Trust Badge Rating Widget</h3>
                                        <p>Shows the total number of published reviews you've received and their average rating.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink"></a>
                                            <a href={extensionUrs.allReviewWidgetUrl} target="_blank" className="revbtn smbtn">Add to theme</a>
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
                                        <h3>Video Slider Widget</h3>
                                        <p>Display powerful photo and video reviews so store visitors can see your products in action.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink"></a>
                                            <a href={extensionUrs.videoSliderWidgetUrl} target="_blank" className="revbtn smbtn">Add to theme</a>
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
                                        <h3>Gallery Carousel Widget</h3>
                                        <p>Highlight your customers' user-generated photos in this dynamic carousel so visitors can see your products in action.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink"></a>
                                            <a href={extensionUrs.galleryCarouselWidgetUrl} target="_blank" className="revbtn smbtn">Add to theme</a>
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
                                        <h3>Cards Carousel Widget</h3>
                                        <p>Combine visual reviews, text, and star ratings in this stylish and engaging carousel.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink"></a>
                                            <a href={extensionUrs.cardCarouselWidgetUrl} target="_blank" className="revbtn smbtn">Add to theme</a>
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
                                        <h3>Floating Product Reviews Widget
                                        </h3>
                                        <p>Present your reviews on a floating display so users can browse through reviews without leaving the page they are currently on.</p>
                                        <div className="btnwrap">
                                            <a href="#" onClick={(e) => redirectToCustomizePage(e, "floatingWidget")} className="simplelink">Customize</a>
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
