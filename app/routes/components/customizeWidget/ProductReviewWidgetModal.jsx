
import React, { useState, useEffect, useRef } from 'react';
import MasonryLayout from './ResponsiveMasonry';
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';
import settingsJson from './../../../utils/settings.json';

import {
    ChevronDownIcon,
    ChevronUpIcon
} from '@shopify/polaris-icons';

import {
    Button,
    ResourceList,
    ResourceItem,
    TextField,
    Link,
    Checkbox, Spinner, Box, Icon
} from '@shopify/polaris';
const ProductReviewWidgetModal = ({ show, handleClose, documentObj, shopRecords, getPreviewText, currentLanguage, translator, lightDarkModel, changeLightDarkModel }) => {
    const shopify = useAppBridge();
    let headerTextColor, buttonBorderColor, buttonTitleColor, buttonBackgroundOnHover, buttonTextOnHover, buttonBackground, starsBarBackground, starsBarFill = "";

    if (documentObj.widgetColor == 'custom') {
        headerTextColor = documentObj.headerTextColor;
        buttonBorderColor = `1px solid ${documentObj.buttonBorderColor}`;
        buttonTitleColor = documentObj.buttonTitleColor;
        buttonBackground = documentObj.buttonBackground;

        buttonBackgroundOnHover = documentObj.buttonBackgroundOnHover;
        buttonTextOnHover = documentObj.buttonTextOnHover;
        starsBarBackground = documentObj.starsBarBackground;
        starsBarFill = documentObj.starsBarFill;
    } else if (documentObj.widgetColor == 'white') {
        headerTextColor = '#ffffff';
        buttonBorderColor = `1px solid #ffffff`;
        // buttonTitleColor = '#ffffff';
        // buttonBackground = '#000000';
        buttonTextOnHover = '#000000';

    }
    let gridClassName = 'full-grid';
    if (documentObj.widgetLayout == 'grid') {
        gridClassName = 'grid-four-column';
    } else if (documentObj.widgetLayout == 'compact') {
        gridClassName = 'grid-two-column';
    }


    const minimalHeader = documentObj.headerLayout === 'minimal';
    const compactHeader = documentObj.headerLayout === 'compact';
    const expandedHeader = documentObj.headerLayout === 'expanded';


    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDisct, setIsOpenDisct] = useState(false);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };
    const toggleDropdownDisct = () => {
        setIsOpenDisct((prev) => !prev);
    };
    return (
        <>
            <style>
                {`
                    .custombtn:hover {
                        background-color: ${buttonBackgroundOnHover} !important;
                        color : ${buttonTextOnHover} !important;
                    }
					.review_top_actions .stardetaildd .stardetailrow .processbar .activebar {
						background-color: ${starsBarFill} !important;
					}

					.review_top_actions .stardetaildd .stardetailrow .processbar {
						background-color: ${starsBarBackground} !important;
					}


                    .dropdown {
                        position: relative;
                        display: inline-block;
                    }
                    .dropdown .twenty-filtericon {
                        font-size: 18px;
                    }
                    
                    .dropbtn {
                        background: #F8F9FB;
                        color: #222222;
                        padding: 10px 16px;
                        border: none;
                        cursor: pointer;
                        height: 48px;
                        display: inline-flex;
                        padding: 0 24px;
                        border-radius: 100px;
                        font-size: 14px;
                        font-weight: 400;
                        text-decoration: none;
                        outline: none;
                        box-shadow: none;
                        align-items: center;
                        column-gap: 6px;
                        column-gap: 6px;
                        line-height: 16px;
                        margin: 0;
                    }
            
                    .dropdown-content {
                        display: block; /* Changed to block */
                        position: absolute;
                        background-color: white;
                        min-width: 160px;
                        z-index: 1;
                        border-radius: 10px;
                        border : solid 1px #E3E4E5;
                        padding:6px;
                    }
            
                    .dropdown-content button {
                        color: black;
                        padding: 12px 16px;
                        text-decoration: none;
                        display: block;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        cursor: pointer;
                        background: none;
                        width: 100%;
                        border:none;
                    }
            
                    .dropdown-content button:hover {
                        background-color: #f1f1f1;
                    }

                    .dropdown-dist-btn {
                        background: none !important;
                        border: none !important;
                        outline: none !important;
                        box-shadow: none !important;
                        display: flex;
                        align-items: center;
                        color: #222222;
                        border: none;
                        cursor: pointer;
                        height: 48px;
                        display: inline-flex;
                        border-radius: 100px;
                        font-size: 14px;
                        font-weight: 400;
                        outline: none;
                        align-items: center;
                        column-gap: 6px;
                        line-height: 16px;
                    }
                                        
				`}
            </style>


            <Modal variant="max" id="product-review-modal" open={show} onHide={handleClose}>
                <TitleBar title={`${settingsJson.app_name} preview`}>
                </TitleBar>
                <div className='lightdarkwrap'>
                    <button className={`${lightDarkModel ? 'darkbg' : ''}`} onClick={changeLightDarkModel}><i></i></button>
                </div>

                <div style={{ background: lightDarkModel ? '#222222' : '' }}>
                    
                    <Box padding="500">

                        <div className={` review_top_actions ${minimalHeader ? 'minimalheader' : 'otherheaderlayout'} ${compactHeader ? 'compactheader' : ''} ${expandedHeader ? 'expandedheader' : ''}`} >
                            <div className={`left_actions flxfix ${minimalHeader ? '' : 'sidebyside'}`}>
                                <div className="leftpart">
                                    <div className="section_title" style={{ color: headerTextColor }}>{getPreviewText('reviewHeaderTitle', currentLanguage)}</div>
                                    {!minimalHeader &&
                                        <div className="bigcountavarage flxrow">
                                            <i className='rating-star-rounded'></i>
                                            <div className="averagetext" style={{ color: headerTextColor }}>4.7</div>
                                        </div>
                                    }
                                    {!minimalHeader &&
                                        <div className="totalreviewcount" style={{ color: headerTextColor }}>
                                            <span>5</span> {getPreviewText('reviewPlural', currentLanguage)}
                                        </div>
                                    }
                                </div>
                                <div className="rightpart">
                                    {!minimalHeader && (
                                        documentObj.showRatingsDistribution &&
                                        <div className="stardetaildd">
                                            <div className="stardetailrow flxrow">
                                                <div className="sratnumber">5</div>
                                                <div className="starsicons flxrow star-5">
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                </div>
                                                <div className="processbar"><div className="activebar" style={{ width: `40%` }}></div></div>
                                                <div className="reviewgiven">(2)</div>
                                            </div>
                                            <div className="stardetailrow flxrow">
                                                <div className="sratnumber">4</div>
                                                <div className="starsicons flxrow star-4">
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                </div>
                                                <div className="processbar"><div className="activebar" style={{ width: `20%` }}></div></div>
                                                <div className="reviewgiven">(1)</div>
                                            </div>
                                            <div className="stardetailrow flxrow">
                                                <div className="sratnumber">3</div>
                                                <div className="starsicons flxrow star-4">
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                </div>
                                                <div className="processbar"><div className="activebar" style={{ width: `20%` }}></div></div>
                                                <div className="reviewgiven">(2)</div>
                                            </div>
                                            <div className="stardetailrow flxrow">
                                                <div className="sratnumber">2</div>
                                                <div className="starsicons flxrow star-4">
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                </div>
                                                <div className="processbar"><div className="activebar" style={{ width: `0%` }}></div></div>
                                                <div className="reviewgiven">(0)</div>
                                            </div>
                                            <div className="stardetailrow flxrow">
                                                <div className="sratnumber">1</div>
                                                <div className="starsicons flxrow star-4">
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                </div>
                                                <div className="processbar"><div className="activebar" style={{ width: `0%` }}></div></div>
                                                <div className="reviewgiven">(0)</div>
                                            </div>
                                        </div>
                                    )

                                    }
                                    {minimalHeader &&
                                        <div className="star-rating">

                                            <div className="dropdown">

                                                <a className="dropdown-dist-btn" onClick={toggleDropdownDisct}>
                                                    <div className={`ratingstars flxrow star-4`}>
                                                        <i className='rating-star-rounded'></i>
                                                        <i className='rating-star-rounded'></i>
                                                        <i className='rating-star-rounded'></i>
                                                        <i className='rating-star-rounded'></i>
                                                        <i className='rating-star-rounded'></i>
                                                    </div>
                                                    <div className='ratingcount' style={{ color: headerTextColor }}>4 {translator('out_of')} <span>5</span></div>
                                                    {documentObj.showRatingsDistribution &&
                                                        <div className="arrowright" style={{ color: headerTextColor }}>
                                                            <i className='twenty-arrow-down'></i>
                                                        </div>
                                                    }

                                                </a>
                                                {isOpenDisct && (
                                                    <div className="dropdown-content">
                                                        <div className="stardetaildd">
                                                            <div className="stardetailrow flxrow">
                                                                <div className="starsicons flxrow star-5">
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                </div>
                                                                <div className="processbar"><div className="activebar" style={{ width: `40%` }}></div></div>
                                                                <div className="reviewgiven">(2)</div>
                                                            </div>
                                                            <div className="stardetailrow flxrow">
                                                                <div className="starsicons flxrow star-4">
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                </div>
                                                                <div className="processbar"><div className="activebar" style={{ width: `20%` }}></div></div>
                                                                <div className="reviewgiven">(1)</div>
                                                            </div>
                                                            <div className="stardetailrow flxrow">
                                                                <div className="starsicons flxrow star-4">
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                </div>
                                                                <div className="processbar"><div className="activebar" style={{ width: `20%` }}></div></div>
                                                                <div className="reviewgiven">(2)</div>
                                                            </div>
                                                            <div className="stardetailrow flxrow">
                                                                <div className="starsicons flxrow star-4">
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                </div>
                                                                <div className="processbar"><div className="activebar" style={{ width: `0%` }}></div></div>
                                                                <div className="reviewgiven">(0)</div>
                                                            </div>
                                                            <div className="stardetailrow flxrow">
                                                                <div className="starsicons flxrow star-4">
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                    <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                </div>
                                                                <div className="processbar"><div className="activebar" style={{ width: `0%` }}></div></div>
                                                                <div className="reviewgiven">(0)</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                        </div>
                                    }
                                </div>
                                {minimalHeader &&
                                    <div className="totalreviewcount" style={{ color: headerTextColor }}>
                                        <span>5</span> {getPreviewText('reviewPlural', currentLanguage)}
                                    </div>
                                }
                            </div>
                            <div className="right_actions btnwrap flxflexi flxrow justify-content-end">
                                {documentObj.showSortingOptions &&
                                    <div className="dropdown">
                                        

                                        <button className="dropbtn custombtn" onClick={toggleDropdown} style={{ border: buttonBorderColor, color: buttonTitleColor, backgroundColor: buttonBackground }}>
                                            <i className="twenty-filtericon"></i> {translator('sort_by')} {isOpen ? <Icon source={ChevronUpIcon} tone="base" /> : <Icon source={ChevronDownIcon} tone="base" />} {/* Up and Down arrows */}
                                        </button>
                                        {isOpen && (
                                            <div className="dropdown-content">
                                                <button>{translator('featured')}</button>
                                                <button>{translator('newest')}</button>
                                                <button>{translator('highest_rating')}</button>
                                                <button>{translator('lowest_rating')}</button>
                                            </div>
                                        )}
                                    </div>
                                }
                                {documentObj.writeReviewButton == "show" && <button className="revbtn wbigbtn custombtn" style={{ border: buttonBorderColor, color: buttonTitleColor, backgroundColor: buttonBackground }} id="show_create_review_modal">{getPreviewText('writeReviewButtonTitle', currentLanguage)}</button>}
                            </div>
                        </div>

                        <MasonryLayout documentObj={documentObj} shopRecords={shopRecords} gridClassName={gridClassName} getPreviewText={getPreviewText} currentLanguage={currentLanguage} translator={translator} />

                    </Box>
                </div>

            </Modal>
        </>

    );

}

export default ProductReviewWidgetModal;
