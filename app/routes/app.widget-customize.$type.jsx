import React, { useState, useEffect } from 'react';
import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import LanguageSelector from "./components/language-selector";
import ProductReviewWidget from './components/customizeWidget/ProductReviewWidget';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import { getShopDetails } from './../utils/getShopDetails';
import productReviewWidgetCustomizes from './models/productReviewWidgetCustomizes';
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
		default:
			content = <h4>404 - Page Not Found</h4>;
			break;
	}
    JsonData['generalSettingsModel'] = await generalSettings.findOne({ shop_id: shopRecords._id });
    return json(JsonData);
};

export default function WidgetCustomize() {
    const { params, shopRecords, generalSettingsModel, customizeObj } = useLoaderData();
    const { i18n } = useTranslation();

    const type = params.type;
    const navigate = useNavigate();

    useEffect(() => {
        const defaultLanguage = (generalSettingsModel && generalSettingsModel.defaul_language) ? generalSettingsModel.defaul_language : "en";
        i18n.changeLanguage(defaultLanguage);

    }, []);



    const backToWidgetPage = (e) => {
        console.log('dsadsd');
        e.preventDefault();
        navigate('/app/display-review-widget');
    }

    let content;
    let customizeTemplateName;
    switch (type) {
        case 'product-review-widget':
            content = <ProductReviewWidget shopRecords={shopRecords} customizeObj={customizeObj} />;
            customizeTemplateName = "Product review widget"
            break;
        default:
            content = <h4>404 - Page Not Found</h4>;
            break;
    }


    const [crumbs, setCrumbs] = useState([
        { title: "Review", "link": "./../../review" },
        { title: "Reviews widget", "link": "./../../display-review-widget" },
        { title: customizeTemplateName, "link": "" },

    ]);

    return (
        <>
            <Breadcrumb crumbs={crumbs} />
            <Page fullWidth>
                <div className='pagetitle'>
                    <div className='pagebackbtn flxflexi'>
                        <a href="#" onClick={backToWidgetPage}><i className='twenty-arrow-left'></i>Collect reviews</a>
                    </div>
                    <div className='flxfix'>
                        {generalSettingsModel && generalSettingsModel.multilingual_support &&
                            <LanguageSelector className="inlinerow m-0" />
                        }
                    </div>
                </div>

                <div className="pagebox">
                    <div className="graywrapbox gapy24">
                        <div className="subtitlebox">
                            <h2>Product Reviews Widget  - Learn more </h2>
                            <p>Convert visitors into buyers with an eye-catching gallery showcasing your reviews. Choose from multiple layouts.
                            </p>
                        </div>
                        <div className='flxfix'>
                            {content}
                        </div>
                    </div>

                </div>

            </Page>

        </>

    );
}