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
import popupModalWidgetCustomizes from "./models/popupModalWidgetCustomizes";
import { Image } from "react-bootstrap";
const widgetThumb01 = `/images/widget-thumbs/Product Reviews Widget.png`;
const widgetThumb02 = `/images/widget-thumbs/Rating Widget.png`;
const widgetThumb03 = `/images/widget-thumbs/Testimonials Carousel Widget.png`;
const widgetThumb04 = `/images/widget-thumbs/Reviews Sidebar Widget.png`;
const widgetThumb05 = `/images/widget-thumbs/Cart Reviews Widget.png`;
const widgetThumb06 = `/images/widget-thumbs/Trust Badge.png`;
const widgetThumb07 = `/images/widget-thumbs/Video Slider Widget.png`;
const widgetThumb08 = `/images/widget-thumbs/Gallery Carousel Widget.png`;
const widgetThumb09 = `/images/widget-thumbs/Cards Carousel Widget.png`;
const widgetThumb10 = `/images/widget-thumbs/Floating Product Reviews Widget.png`;
const widgetThumb11 = `/images/widget-thumbs/Pop-up Widget.png`;
const widgetThumb12 = `/images/widget-thumbs/Snippets Widget.png`;

import {
    Page
} from "@shopify/polaris";

export async function loader({ request }) {
    try {

        const shopRecords = await getShopDetails(request);

        const sidebarReviewWidgetCustomizesModel = await sidebarReviewWidgetCustomizes.findOne({ shop_id: shopRecords._id });
        const popupModalWidgetCustomizesModel = await popupModalWidgetCustomizes.findOne({ shop_id: shopRecords._id });

        const reviewExtensionId = process.env.SHOPIFY_ALL_REVIEW_EXTENSION_ID;

        const productWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/product-review-widget`);
        const ratingWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/rating-widget`);
        const allReviewWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/all-review-counter-widget`);
        const videoSliderWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/video-slider-widget`);
        const testimonialSliderWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/testimonials-carousel-widget`);
        const cartReviewWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/cart-review-widget`);
        const galleryCarouselWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/gallery-carousel-widget`);
        const cardCarouselWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/card-carousel-widget`);
        const snippetWidgetExtenstionId = encodeURIComponent(`${reviewExtensionId}/snippet-widget`);


        const shopifyProduct = await getShopifyLatestProducts(shopRecords.shop);
        const productName = (shopifyProduct.products.length > 0 ) ? encodeURIComponent(`/products/${shopifyProduct.products[0]['handle']}`) : "/products";
        const cartPreviewPath = encodeURIComponent("/cart");

        const productReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?previewPath=${productName}&addAppBlockId=${productWidgetExtenstionId}&target=sectionId`;
        const ratingReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?previewPath=${productName}&addAppBlockId=${ratingWidgetExtenstionId}&target=mainSection`;
        const allReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?addAppBlockId=${allReviewWidgetExtenstionId}&target=sectionId`;
        const videoSliderWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?addAppBlockId=${videoSliderWidgetExtenstionId}&target=sectionId`;
        const testimonialSliderWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?addAppBlockId=${testimonialSliderWidgetExtenstionId}&target=sectionId`;
        const cartReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?previewPath=${cartPreviewPath}&addAppBlockId=${cartReviewWidgetExtenstionId}&target=cart`;
        const galleryCarouselWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?addAppBlockId=${galleryCarouselWidgetExtenstionId}&target=sectionId`;
        const cardCarouselWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?addAppBlockId=${cardCarouselWidgetExtenstionId}&target=sectionId`;
        const snippetReviewWidgetUrl = `https://${shopRecords.shop}/admin/themes/current/editor?previewPath=${productName}&addAppBlockId=${snippetWidgetExtenstionId}&target=mainSection`;

        const extensionUrs = {
            productReviewWidgetUrl,
            ratingReviewWidgetUrl,
            allReviewWidgetUrl,
            videoSliderWidgetUrl,
            cartReviewWidgetUrl,
            testimonialSliderWidgetUrl,
            galleryCarouselWidgetUrl,
            cardCarouselWidgetUrl,
            snippetReviewWidgetUrl
        }

        return json({ shopRecords, sidebarReviewWidgetCustomizesModel, popupModalWidgetCustomizesModel, extensionUrs });

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
    const popupModalWidgetCustomizes = loaderData.popupModalWidgetCustomizesModel;
    const [isClient, setIsClient] = useState(false);
    const [isSidebarWidgetActivated, setIsSidebarWidgetActivated] = useState(sidebarReviewWidgetCustomizes?.isActive);
    const [isPopupWidgetActivated, setIsPopupWidgetActivated] = useState(popupModalWidgetCustomizes?.isActive);

    const navigate = useNavigate();

    useEffect(() => {
        setIsClient(true);
    }, []);



    const changeWidgetActivationStatus = async (widgetType) => {
        let value = "", field = "", actionType = "";

        if (widgetType == 'sidebar') {
            value = !isSidebarWidgetActivated;
            field = "isActive";
            actionType = "sidebarReviewCustomize";
        } else if (widgetType == 'popup') {
            value = !isPopupWidgetActivated;
            field = "isActive";
            actionType = "popupModalReviewCustomize";
        }

        const updateData = {
            field: field,
            value: value,
            shop: shopRecords.shop,
            actionType: actionType
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
        } else if (widgetType == 'popup') {
            setIsPopupWidgetActivated(!isPopupWidgetActivated);
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
        } else if (type == 'popupWidget') {
            navigate('/app/widget-customize/popup-widget');
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
                                        <Image src={widgetThumb11} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>Pop-up Widget</h3>
                                        <p>Spotlight relevant reviews and drive visitors to your product pages with a subtle social proof pop-up.</p>
                                        <div className="btnwrap">
                                            <a href="#" onClick={(e) => redirectToCustomizePage(e, "popupWidget")} className="simplelink">Customize</a>
                                            {isPopupWidgetActivated ? (
                                                <label className="revbtn smbtn blackbtn">Activated</label>
                                            ) : (
                                                <button onClick={() => changeWidgetActivationStatus('popup')} className="revbtn smbtn">Activate</button>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="widgetboxwrp">
                                <div className="widgetbox flxcol">
                                    <div className="imagebox flxfix">
                                        <Image src={widgetThumb12} alt="" />
                                    </div>
                                    <div className="detailbox flxflexi">
                                        <h3>Snippets Widget</h3>
                                        <p>Build instant trust by showing a glimpse of your best reviews at the top of your product pages, where purchase decisions are made.</p>
                                        <div className="btnwrap">
                                            <a href="#" className="simplelink"></a>
                                            <a href={extensionUrs.snippetReviewWidgetUrl} target="_blank" className="revbtn smbtn">Add to theme</a>
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
                                        <Image src={widgetThumb05} alt="" />
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
                                        <Image src={widgetThumb06} alt="" />
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
                                        <Image src={widgetThumb07} alt="" />
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
                                        <Image src={widgetThumb08} alt="" />
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
                                        <Image src={widgetThumb10} alt="" />
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
