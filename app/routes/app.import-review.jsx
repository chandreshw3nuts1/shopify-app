import { useEffect, useState, useCallback } from "react";
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from "./components/Breadcrumb";
import ReviewPageSidebar from "./components/headerMenu/ReviewPageSidebar";
import { getShopDetails } from './../utils/getShopDetails';
import GeneralAppearance from "./components/settings/general-appearance";
import { findOneRecord } from './../utils/common';
import { json } from "@remix-run/node";
import aliExpressImage from './../images/ali-express-bg.png';
import InformationAlert from "./components/common/information-alert";
import AlertInfo from "./components/AlertInfo";
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

export default function DisplayReviewWidget() {
    const loaderData = useLoaderData();
    const shopRecords = loaderData.shopRecords;
    const generalAppearances = loaderData.generalAppearances;
    const [isClient, setIsClient] = useState(false);

    const [oneClickImport, setOneClickImport] = useState(false);
    const [importFromApp, setImportFromApp] = useState(false);
    const [importFromSpreadsheet, setImportFromSpreadsheet] = useState(false);
    const handleToggleOneClickImport = useCallback(() => setOneClickImport(oneClickImport => !oneClickImport), []);
    const handleToggleImportFromApp = useCallback(() => setImportFromApp(importFromApp => !importFromApp), []);
    const handleToggleImportFromSpreadsheet = useCallback(() => setImportFromSpreadsheet(importFromSpreadsheet => !importFromSpreadsheet), []);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [crumbs, setCrumbs] = useState([
        { title: "Review", "link": "./../review" },
        { title: "Import reviews", "link": "" }
    ]);
    return (
        <>
            <Breadcrumb crumbs={crumbs} />

            <Page fullWidth>
                <ReviewPageSidebar />
                <div className="pagebox">
                    <div className='accordian_rowmain'>
                        <Layout.Section>
                            <LegacyCard sectioned>
                                <div
                                    onClick={handleToggleOneClickImport}
                                    aria-expanded={oneClickImport}
                                    aria-controls="basic-collapsible"
                                    className={oneClickImport ? 'open' : ''}
                                >
                                    <div className='flxrow acctitle'>
                                        <div className='flxfix iconbox'>
                                            <i className='twenty-import-aliexpress'></i>
                                        </div>
                                        <div className='flxflexi titledetail'>
                                            <Text as="h1" variant="headingMd">
                                                One-click import from AliExpress
                                            </Text>
                                            <Text>
                                                Follow the instructions below to import product reviews directly from AliExpress
                                            </Text>
                                        </div>
                                        <div class="flxfix btnwrap m-0">
                                            <a href="#" class="revbtn">Learn More</a>
                                        </div>
                                        <div className='flxfix arrowicon'>
                                            <i className='twenty-arrow-down'></i>
                                        </div>
                                    </div>
                                </div>
                                <LegacyStack vertical>
                                    <Collapsible
                                        open={oneClickImport}
                                        id="basic-collapsible"
                                        transition={{
                                            duration: '300ms',
                                            timingFunction: 'ease-in-out',
                                        }}
                                        expandOnPrint
                                    >
                                        <div className="aliexpress_wrap">
                                            <div className="imagebox flxfix">
                                                <img src={aliExpressImage} alt="" />
                                                <div className="dragbtnbox">
                                                    <div className="btndrag">
                                                        <div className="graglabel"><DragIcon />Drag</div>
                                                        Import to W3Reviews
                                                        <div className="handicon"><HandIcon /></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="detailbox flxflexi">
                                                <ul>
                                                    <li>
                                                        <div className="numberbox flxfix">01</div>
                                                        <div className="textbox flxflexi">Drag the <strong>"Import to W3Reviews"</strong> button to your bookmarks bar</div>
                                                    </li>
                                                    <li>
                                                        <div className="numberbox flxfix">02</div>
                                                        <div className="textbox flxflexi">Go to the AliExpress product page you want to import the reviews from.</div>
                                                    </li>
                                                    <li>
                                                        <div className="numberbox flxfix">03</div>
                                                        <div className="textbox flxflexi">Click the <strong>“Import to W3Reviews”</strong> button on the bookmarks bar.</div>
                                                    </li>
                                                </ul>
                                                <AlertInfo colorTheme="primarybox mt-24" iconClass="twenty-Info_icon" alertContent="The button is unique for your store. You only need to drag it once." alertClose />
                                            </div>
                                        </div>
                                    </Collapsible>
                                </LegacyStack>
                            </LegacyCard>
                        </Layout.Section>
                    </div>
                    <div className='accordian_rowmain'>
                        <Layout.Section>
                            <LegacyCard sectioned>
                                <div
                                    onClick={handleToggleImportFromApp}
                                    aria-expanded={importFromApp}
                                    aria-controls="basic-collapsible"
                                    className={importFromApp ? 'open' : ''}
                                >
                                    <div className='flxrow acctitle'>
                                        <div className='flxfix iconbox'>
                                            <i className='twenty-import-apps'></i>
                                        </div>
                                        <div className='flxflexi titledetail'>
                                            <Text as="h1" variant="headingMd">
                                                Import from supported apps
                                            </Text>
                                            <Text>
                                                Import reviews from Shopify Product Reviews, Yotpo, Junip, Okendo or Judge.me
                                            </Text>
                                        </div>
                                        <div class="flxfix btnwrap m-0">
                                            <a href="#" class="revbtn">Learn More</a>
                                        </div>
                                        <div className='flxfix arrowicon'>
                                            <i className='twenty-arrow-down'></i>
                                        </div>
                                    </div>
                                </div>
                                <LegacyStack vertical>
                                    <Collapsible
                                        open={importFromApp}
                                        id="basic-collapsible"
                                        transition={{
                                            duration: '300ms',
                                            timingFunction: 'ease-in-out',
                                        }}
                                        expandOnPrint
                                    >
                                        <div className="importappwrap">
                                            <div className="detailbox">
                                                <ul>
                                                    <li>
                                                        <div className="numberbox flxfix">01</div>
                                                        <div className="textbox flxflexi">Select which app you want to migrate your reviews</div>
                                                    </li>
                                                    <li>
                                                        <div className="numberbox flxfix">02</div>
                                                        <div className="textbox flxflexi">Upload the .CSV export file as-is</div>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="importappformrow flxrow">
                                                <div className="formcontent flxflexi" >
                                                    <Select
                                                        name="reviewPublishMode"
                                                        id="reviewPublishMode"
                                                        // options={options}
                                                        // onChange={
                                                        //     handleSelectChange
                                                        // }
                                                        // value={selected}
                                                    />
                                                </div>
                                                <div className="btnbox m-0 flxfix">
                                                    <a href="#" className="revbtn regularbtn">Upload CSV file</a>
                                                </div>
                                            </div>
                                            <AlertInfo colorTheme="primarybox mt-24" iconClass="twenty-Info_icon" alertContent="Need help migrating from other apps? You can always contact support" alertClose />
                                        </div>
                                    </Collapsible>
                                </LegacyStack>
                            </LegacyCard>
                        </Layout.Section>
                    </div>
                    <div className='accordian_rowmain'>
                        <Layout.Section>
                            <LegacyCard sectioned>
                                <div
                                    onClick={handleToggleImportFromSpreadsheet}
                                    aria-expanded={importFromSpreadsheet}
                                    aria-controls="basic-collapsible"
                                    className={importFromSpreadsheet ? 'open' : ''}
                                >
                                    <div className='flxrow acctitle'>
                                        <div className='flxfix iconbox'>
                                            <i className='twenty-import-spreadsheet'></i>
                                        </div>
                                        <div className='flxflexi titledetail'>
                                            <Text as="h1" variant="headingMd">
                                                Import from a spreadsheet
                                            </Text>
                                            <Text>
                                                Follow these instructions to import reviews from a spreadsheet
                                            </Text>
                                        </div>
                                        <div class="flxfix btnwrap m-0">
                                            <a href="#" class="revbtn">Learn More</a>
                                        </div>
                                        <div className='flxfix arrowicon'>
                                            <i className='twenty-arrow-down'></i>
                                        </div>
                                    </div>
                                </div>
                                <LegacyStack vertical>
                                    <Collapsible
                                        open={importFromSpreadsheet}
                                        id="basic-collapsible"
                                        transition={{
                                            duration: '300ms',
                                            timingFunction: 'ease-in-out',
                                        }}
                                        expandOnPrint
                                    >
                                        <div className="importspreadsheed_wrap">
                                            <div className="btnbox m-0">
                                                <a href="#" className="revbtn regularbtn lightbtn"><span>1</span>Copy template file</a>
                                                <a href="#" className="revbtn regularbtn"><span>2</span>Upload template file</a>
                                            </div>
                                            <AlertInfo colorTheme="primarybox mt-24" iconClass="twenty-Info_icon" alertContent="Carefully review the Import Template Instructions and make sure that your file meets all requirements." alertClose />
                                        </div>
                                    </Collapsible>
                                </LegacyStack>
                            </LegacyCard>
                        </Layout.Section>
                    </div>

                </div>

            </Page>
        </>


    );
}
