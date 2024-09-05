import React, { useState, useEffect } from 'react';
import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import LanguageSelector from "./components/language-selector";
import ProductReviewWidget from './components/customizeWidget/ProductReviewWidget';
import SidebarReviewWidget from './components/customizeWidget/SidebarReviewWidget';
import FloatingWidget from './components/customizeWidget/FloatingWidget';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import { getShopDetails } from './../utils/getShopDetails';
import productReviewWidgetCustomizes from './models/productReviewWidgetCustomizes';
import sidebarReviewWidgetCustomizes from './models/sidebarReviewWidgetCustomizes';
import floatingWidgetCustomizes from './models/floatingWidgetCustomizes';
import generalSettings from './models/generalSettings';
import { useTranslation } from "react-i18next";


import {
    Page,
} from '@shopify/polaris';

export const loader = async ({ request, params }) => {
    const shopRecords = await getShopDetails(request);
    var JsonData = { params, shopRecords };

    switch (params.type) {
        case 'product-review-widget':
            JsonData['customizeObj'] = await productReviewWidgetCustomizes.findOne({
                shop_id: shopRecords._id,
            });
            break;
        case 'sidebar-review-widget':
            JsonData['customizeObj'] = await sidebarReviewWidgetCustomizes.findOne({
                shop_id: shopRecords._id,
            });
            break;
        case 'floating-widget':
            JsonData['customizeObj'] = await floatingWidgetCustomizes.findOne({
                shop_id: shopRecords._id,
            });
            break;
        default:
            break;
    }
    JsonData['generalSettingsModel'] = await generalSettings.findOne({ shop_id: shopRecords._id });

    return json(JsonData);
};

export default function WidgetCustomize() {
    const { params, shopRecords, generalSettingsModel, customizeObj } = useLoaderData();
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const type = params.type;
    let content;
    let customizeTemplateName;
    let hideLanguageSelector = false;

    switch (type) {
        case 'product-review-widget':
            content = <ProductReviewWidget shopRecords={shopRecords} customizeObj={customizeObj} />;
            customizeTemplateName = "Product review widget";
            break;
        case 'sidebar-review-widget':
            content = <SidebarReviewWidget shopRecords={shopRecords} customizeObj={customizeObj} />;
            customizeTemplateName = "Sidebar review widget";
            hideLanguageSelector = true;
            break;
        case 'floating-widget':
            content = <FloatingWidget shopRecords={shopRecords} customizeObj={customizeObj} />;
            customizeTemplateName = "Floating Product Reviews Widget";
            hideLanguageSelector = true;
            break;
        default:
            return <h5>404 - Page Not Found</h5>;
            break;
    }

    useEffect(() => {
        const defaultLanguage = (generalSettingsModel && generalSettingsModel.defaul_language) ? generalSettingsModel.defaul_language : "en";
        i18n.changeLanguage(defaultLanguage);

    }, []);



    const backToWidgetPage = (e) => {
        e.preventDefault();
        navigate('/app/display-review-widget');
    }

    const crumbs = [
        { title: "Review", "link": "./../../review" },
        { title: "Reviews widget", "link": "./../../display-review-widget" },
        { title: customizeTemplateName, "link": "" },
    ];

    return (
        <>
            <Breadcrumb crumbs={crumbs} />
            <Page fullWidth>
                <div className='pagetitle'>
                    <div className='pagebackbtn flxflexi'>
                        <a href="#" onClick={backToWidgetPage}><i className='twenty-arrow-left'></i>Reviews widgets</a>
                    </div>
                    <div className='flxfix'>
                        {!hideLanguageSelector && generalSettingsModel && generalSettingsModel.multilingual_support &&
                            <LanguageSelector className="inlinerow m-0" />
                        }
                    </div>
                </div>

                <div className="pagebox">
                    <div className="graywrapbox gapy24 mt-24">
                        {content}
                    </div>

                </div>

            </Page>

        </>

    );
}