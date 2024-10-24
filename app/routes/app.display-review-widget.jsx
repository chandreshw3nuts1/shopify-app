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

import {
	Button, 
	Icon,
	Page,
	Layout,
	Text,
	Collapsible,
	Card,
	Box,
	Grid, 
	Bleed,
	Divider,
	InlineStack,
	BlockStack,
	InlineGrid,
	Banner,
	Link,
    Badge
} from '@shopify/polaris';

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


        const shopifyProduct = await getShopifyLatestProducts(shopRecords.myshopify_domain);
        const productName = (shopifyProduct.length > 0 ) ? encodeURIComponent(`/products/${shopifyProduct[0]['handle']}`) : "/products";
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
            <InlineStack align='center'>
                <Box maxWidth='1048px' width='100%'>
                    <Breadcrumb crumbs={crumbs} />
                </Box>
            </InlineStack>
            <Page fullWidth>
                <InlineStack align='center'>
                    <Box maxWidth='1048px' width='100%'>
                        <ReviewPageSidebar />
                        <InlineGrid columns={{xs: 2, sm: 2, md: 2, lg: 2, xl: 3}} gap='500'>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb01} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Product Review Widget</Text>
                                            <Text tone="subdued">Collect and display product reviews on your product pages.</Text>
                                        </BlockStack>
                                        <InlineStack align="space-between">
                                            <Button size="large" onClick={(e) => redirectToCustomizePage(e, "productWidget")}>Customize</Button>
                                            <Button size="large" variant="primary" url={extensionUrs.productReviewWidgetUrl}>Add to theme</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb02} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Star Rating Badge</Text>
                                            <Text tone="subdued">Show the average rating of your products and how many reviews they've received.</Text>
                                        </BlockStack>
                                        <InlineStack align="end">
                                            <Button size="large" variant="primary" url={extensionUrs.ratingReviewWidgetUrl}>Add to theme</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb03} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Testimonials Carousel Widget</Text>
                                            <Text tone="subdued">Showcase the text of your best reviews in an eye-catching, dynamic display.</Text>
                                        </BlockStack>
                                        <InlineStack align="end">
                                            <Button size="large" variant="primary" url={extensionUrs.testimonialSliderWidgetUrl}>Add to theme</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb11} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Pop-up Widget</Text>
                                            <Text tone="subdued">Spotlight relevant reviews and drive visitors to your product pages with a subtle social proof pop-up.</Text>
                                        </BlockStack>
                                        <InlineStack align="space-between">
                                            <Button size="large" onClick={(e) => redirectToCustomizePage(e, "popupWidget")}>Customize</Button>
                                            {isPopupWidgetActivated ? (
                                                // <label className="revbtn smbtn blackbtn">Activated</label>
                                                // <Badge size="large" tone="success">Activated</Badge>
                                                <Button size="large" variant="primary" tone="success">Activated</Button>
                                            ) : (
                                                <Button size="large" onClick={() => changeWidgetActivationStatus('popup')}>Activate</Button>
                                            )}
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb12} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Snippets Widget</Text>
                                            <Text tone="subdued">Build instant trust by showing a glimpse of your best reviews at the top of your product pages, where purchase decisions are made.</Text>
                                        </BlockStack>
                                        <InlineStack align="end">
                                            <Button size="large" variant="primary" url={extensionUrs.snippetReviewWidgetUrl}>Add to theme</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb04} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Sidebar Reviews Widget</Text>
                                            <Text tone="subdued">Floating Reviews Tab Access all your reviews and collect store reviews through a floating tab at the side of the page.</Text>
                                        </BlockStack>
                                        <InlineStack align="space-between">
                                            <Button size="large" onClick={(e) => redirectToCustomizePage(e, "sidebarWidget")}>Customize</Button>
                                            {isPopupWidgetActivated ? (
                                                // <label className="revbtn smbtn blackbtn">Activated</label>
                                                // <Badge size="large" tone="success">Activated</Badge>
                                                <Button size="large" variant="primary" tone="success">Activated</Button>
                                            ) : (
                                                <Button size="large" onClick={() => changeWidgetActivationStatus('sidebar')}>Activate</Button>
                                            )}
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb05} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Cart Reviews Widget</Text>
                                            <Text tone="subdued">Reduce cart abandonment by showing ratings and reviews on the cart page, securing the trust needed to make the sale.</Text>
                                        </BlockStack>
                                        <InlineStack align="end">
                                            <Button size="large" variant="primary" url={extensionUrs.cartReviewWidgetUrl}>Add to theme</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb06} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Trust Badge Rating Widget</Text>
                                            <Text tone="subdued">Shows the total number of published reviews you've received and their average rating.</Text>
                                        </BlockStack>
                                        <InlineStack align="end">
                                            <Button size="large" variant="primary" url={extensionUrs.allReviewWidgetUrl}>Add to theme</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb07} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Video Slider Widget</Text>
                                            <Text tone="subdued">Display powerful photo and video reviews so store visitors can see your products in action.</Text>
                                        </BlockStack>
                                        <InlineStack align="end">
                                            <Button target="_blank" size="large" variant="primary" url={extensionUrs.videoSliderWidgetUrl}>Add to theme</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb08} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Gallery Carousel Widget</Text>
                                            <Text tone="subdued">Highlight your customers' user-generated photos in this dynamic carousel so visitors can see your products in action.</Text>
                                        </BlockStack>
                                        <InlineStack align="end">
                                            <Button target="_blank" size="large" variant="primary" url={extensionUrs.galleryCarouselWidgetUrl}>Add to theme</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb09} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Cards Carousel Widget</Text>
                                            <Text tone="subdued">Combine visual reviews, text, and star ratings in this stylish and engaging carousel.</Text>
                                        </BlockStack>
                                        <InlineStack align="end">
                                            <Button target="_blank" size="large" variant="primary" url={extensionUrs.cardCarouselWidgetUrl}>Add to theme</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                            <Box background="bg-surface" borderColor="bg-surface-secondary-active" borderWidth="0165" borderRadius="300" shadow="100">
                                <div className="thumbimagebox flxfix">
                                    <Image src={widgetThumb10} alt="" />
                                </div>
                                <Box padding={400}>
                                    <BlockStack gap={400}>
                                        <BlockStack gap={200}>
                                            <Text as="h3" variant="headingMd">Floating Product Reviews Widget</Text>
                                            <Text tone="subdued">Present your reviews on a floating display so users can browse through reviews without leaving the page they are currently on.</Text>
                                        </BlockStack>
                                        <InlineStack align="start">
                                            <Button size="large" onClick={(e) => redirectToCustomizePage(e, "floatingWidget")}>Customize</Button>
                                        </InlineStack>
                                    </BlockStack>
                                </Box>
                            </Box>
                        </InlineGrid>
                    </Box>
                </InlineStack>

            </Page>
        </>


    );
}
