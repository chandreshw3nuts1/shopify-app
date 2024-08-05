import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ImageUploadMultiLang from '../settings/ImageUploadMultiLang';
import AlertInfo from '../AlertInfo';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import settingsJson from './../../../utils/settings.json';
import { getDefaultProductImage, getUploadDocument } from './../../../utils/documentPath';
import ColorPicker from "./../settings/ColorPicker";
import GridLayoutIcon from '../icons/GridLayoutIcon';
import ListLayoutIcon from '../icons/ListLayoutIcon';
import CompactLayoutIcon from '../icons/CompactLayoutIcon';
import {
    Select,
} from '@shopify/polaris';

const ProductReviewWidget = ({ shopRecords, customizeObj }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [documentObj, setDocumentObj] = useState(customizeObj);
    const [selectedLayout, setSelectedLayout] = useState(customizeObj?.widgetLayout);
    const [selectedWidgetColor, setSelectedWidgetColor] = useState(customizeObj?.widgetColor);
    const [selectedReviewShadow, setSelectedReviewShadow] = useState(customizeObj?.reviewShadow);
    const [selectedCornerRadius, setSelectedCornerRadius] = useState(customizeObj?.cornerRadius);
    const [selectedItemType, setSelectedItemType] = useState(customizeObj?.itemType);


    const [selectedHeaderLayout, setSelectedHeaderLayout] = useState(customizeObj?.headerLayout);
    const [selectedProductReviewsWidget, setSelectedProductReviewsWidget] = useState(customizeObj?.productReviewsWidget);
    const [selectedWriteReviewButton, setSelectedWriteReviewButton] = useState(customizeObj?.writeReviewButton);
    const [selectedReviewDates, setSelectedReviewDates] = useState(customizeObj?.reviewDates);
    const [selectedDefaultSorting, setSelectedDefaultSorting] = useState(customizeObj?.defaultSorting);
    const [selectedShowSortingOptions, setSelectedShowSortingOptions] = useState(customizeObj?.showSortingOptions);
    const [selectedShowRatingsDistribution, setSelectedShowRatingsDistribution] = useState(customizeObj?.showRatingsDistribution);

    const [initialData, setInitialData] = useState({});

    const [placeHolderLanguageData, setPlaceHolderLanguageData] = useState({});
    
    const [reviewHeaderTitle, setReviewHeaderTitle] = useState('');
    const [reviewSingular, setReviewSingular] = useState('');
    const [reviewPlural, setReviewPlural] = useState('');
    const [writeReviewButtonTitle, setWriteReviewButtonTitle] = useState('');
    const [noReviewsTitleFirstPart, setNoReviewsTitleFirstPart] = useState('');
    const [noReviewsTitleLastPart, setNoReviewsTitleLastPart] = useState('');
    const [showMoreReviewsTitle, setShowMoreReviewsTitle] = useState('');
    const [productPageLinkTitle, setProductPageLinkTitle] = useState('');
    const [itemTypeTitle, setItemTypeTitle] = useState('');

    useEffect(() => {
        const language = localStorage.getItem('i18nextLng');
        setCurrentLanguage(language);


        const documentObjInfo = (documentObj && documentObj[currentLanguage]) ? documentObj[currentLanguage] : {};
        const {
            reviewHeaderTitle,
            reviewSingular,
            reviewPlural,
            writeReviewButtonTitle,
            noReviewsTitleFirstPart,
            noReviewsTitleLastPart,
            showMoreReviewsTitle,
            productPageLinkTitle,
            itemTypeTitle
        } = documentObjInfo;

        
        setReviewHeaderTitle(reviewHeaderTitle || '');
        setReviewSingular(reviewSingular || '');
        setReviewPlural(reviewPlural || '');
        setWriteReviewButtonTitle(writeReviewButtonTitle || '');
        setNoReviewsTitleFirstPart(noReviewsTitleFirstPart || '');
        setNoReviewsTitleLastPart(noReviewsTitleLastPart || '');
        setShowMoreReviewsTitle(showMoreReviewsTitle || '');
        setProductPageLinkTitle(productPageLinkTitle || '');
        setItemTypeTitle(itemTypeTitle || '');


        setInitialData({
            reviewHeaderTitle: reviewHeaderTitle || '',
            reviewSingular: reviewSingular || '',
            reviewPlural: reviewPlural || '',
            writeReviewButtonTitle: writeReviewButtonTitle || '',
            noReviewsTitleFirstPart: noReviewsTitleFirstPart || '',
            noReviewsTitleLastPart: noReviewsTitleLastPart || '',
            showMoreReviewsTitle: showMoreReviewsTitle || '',
            productPageLinkTitle: productPageLinkTitle || '',
            itemTypeTitle: itemTypeTitle || ''
        });

        setPlaceHolderLanguageData({
            reviewHeaderTitle: t('productReviewConstomize.reviewHeaderTitle'),
            reviewSingular: t('productReviewConstomize.reviewSingular'),
            reviewPlural: t('productReviewConstomize.reviewPlural'),
            writeReviewButtonTitle: t('productReviewConstomize.writeReviewButtonTitle'),
            noReviewsTitleFirstPart: t('productReviewConstomize.noReviewsTitleFirstPart'),
            noReviewsTitleLastPart: t('productReviewConstomize.noReviewsTitleLastPart'),
            showMoreReviewsTitle: t('productReviewConstomize.showMoreReviewsTitle'),
            productPageLinkTitle: t('productReviewConstomize.productPageLinkTitle'),
            itemTypeTitle: t('productReviewConstomize.itemTypeTitle')
        });




    }, [i18n, i18n.language, currentLanguage]);


    const handleSelectChange = async (event) => {
        const eventKey = event.target.name;
        let eventVal = event.target.value;
        if (eventKey == 'showSortingOptions') {
            eventVal = !selectedShowSortingOptions;
        } else if (eventKey == 'showRatingsDistribution') {
            eventVal = !selectedShowRatingsDistribution;
        }
        const updateData = {
            field: event.target.name,
            value: eventVal,
            shop: shopRecords.shop,
            actionType: "productReviewCustomize"
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
        if (eventKey == 'widgetLayout') {
            setSelectedLayout(eventVal);
        } else if (eventKey == 'widgetColor') {
            setSelectedWidgetColor(eventVal);
        } else if (eventKey == 'reviewShadow') {
            setSelectedReviewShadow(eventVal);
        } else if (eventKey == 'cornerRadius') {
            setSelectedCornerRadius(eventVal);
        } else if (eventKey == 'headerLayout') {
            setSelectedHeaderLayout(eventVal);
        } else if (eventKey == 'productReviewsWidget') {
            setSelectedProductReviewsWidget(eventVal);
        } else if (eventKey == 'writeReviewButton') {
            setSelectedWriteReviewButton(eventVal);
        } else if (eventKey == 'reviewDates') {
            setSelectedReviewDates(eventVal);
        } else if (eventKey == 'defaultSorting') {
            setSelectedDefaultSorting(eventVal);
        } else if (eventKey == 'showSortingOptions') {
            setSelectedShowSortingOptions(!selectedShowSortingOptions);
        } else if (eventKey == 'showRatingsDistribution') {
            setSelectedShowRatingsDistribution(!selectedShowRatingsDistribution);
        } else if (eventKey == 'itemType') {
            setSelectedItemType(eventVal);
        }


    };

    const handleInputBlur = async (e) => {
        const language = localStorage.getItem('i18nextLng');
        if (initialData[e.target.name] != e.target.value) {
            const updateData = {
                field: e.target.name,
                value: e.target.value,
                shop: shopRecords.shop,
                language: language,
                actionType: "productReviewCustomizeLanguageContent"
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

                setDocumentObj(prevState => ({
                    ...(prevState || {}),  // Ensure prevState is an object
                    [currentLanguage]: {
                        ...(prevState ? prevState[currentLanguage] : {}),  // Ensure nested object is an object
                        [e.target.name]: e.target.value
                    }
                }));

            } else {
                shopify.toast.show(data.message, {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
            }
        }
    };

    const changeLanguageInput = (event) => {
        const eventKey = event.target.name;
        const eventVal = event.target.value;

        if (eventKey == 'reviewHeaderTitle') {
            setReviewHeaderTitle(eventVal);
        } else if (eventKey == 'reviewSingular') {
            setReviewSingular(eventVal);
        } else if (eventKey == 'reviewPlural') {
            setReviewPlural(eventVal);
        } else if (eventKey == 'writeReviewButtonTitle') {
            setWriteReviewButtonTitle(eventVal);
        } else if (eventKey == 'noReviewsTitleFirstPart') {
            setNoReviewsTitleFirstPart(eventVal);
        } else if (eventKey == 'noReviewsTitleLastPart') {
            setNoReviewsTitleLastPart(eventVal);
        } else if (eventKey == 'showMoreReviewsTitle') {
            setShowMoreReviewsTitle(eventVal);
        } else if (eventKey == 'productPageLinkTitle') {
            setProductPageLinkTitle(eventVal);
        } else if (eventKey == 'itemTypeTitle') {
            setItemTypeTitle(eventVal);
        }

    };
    return (
        <>
            <div className="row">
                <div className="col-lg-6">
                    <div className='customize_wrap'>
                        <div className="whitebox p-0">
                            <div className='custwidtitle'>
                                <h3>Widget layout</h3>
                            </div>
                            <div className='insidewhitecard'>
                                <div className="form-group m-0">
                                    <div className='layoutstr'>
                                        <div className='layoutbox'>
                                            <input
                                                type='radio'
                                                value="grid"
                                                name='widgetLayout'
                                                id='gridlayout'
                                                onChange={handleSelectChange}
                                                checked={selectedLayout === 'grid'}

                                            />
                                            <label htmlFor="gridlayout">
                                                <div className='iconbox'><GridLayoutIcon /></div>
                                                <span>Grid</span>
                                            </label>
                                        </div>
                                        <div className='layoutbox'>
                                            <input
                                                type='radio'
                                                value="list"
                                                name='widgetLayout'
                                                id='listlayout'
                                                onChange={handleSelectChange}
                                                checked={selectedLayout === 'list'}
                                            />
                                            <label htmlFor="listlayout">
                                                <div className='iconbox'><ListLayoutIcon /></div>
                                                <span>List</span>
                                            </label>
                                        </div>
                                        <div className='layoutbox'>
                                            <input
                                                type='radio'
                                                value="compact"
                                                name='widgetLayout'
                                                id='compactlayout'
                                                onChange={handleSelectChange}
                                                checked={selectedLayout === 'compact'}

                                            />
                                            <label htmlFor="compactlayout">
                                                <div className='iconbox'><CompactLayoutIcon /></div>
                                                <span>List(compact)</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="whitebox p-0">
                            <div className='custwidtitle'>
                                <h3>Widget colors</h3>
                            </div>
                            <div className='insidewhitecard'>
                                <div className="form-group m-0 horizontal-form">
                                    <div className='sideinput flxflexi'>
                                        <div className='radiogroup vertical'>
                                            <div className='radiobox'>
                                                <input
                                                    type="radio"
                                                    value="black"
                                                    name='widgetColor'
                                                    checked={selectedWidgetColor === 'black'}
                                                    onChange={handleSelectChange}
                                                    id='widcolorblacktext'
                                                />
                                                <label htmlFor='widcolorblacktext'>Black text (best over light backgrounds)</label>
                                            </div>
                                            <div className='radiobox'>
                                                <input
                                                    type="radio"
                                                    value="white"
                                                    name='widgetColor'
                                                    checked={selectedWidgetColor === 'white'}
                                                    onChange={handleSelectChange}
                                                    id='widcolorwhitetext'
                                                />
                                                <label htmlFor='widcolorwhitetext'>White text (best over dark backgrounds)</label>
                                            </div>
                                            <div className='radiobox'>
                                                <input
                                                    type="radio"
                                                    value="custom"
                                                    name='widgetColor'
                                                    checked={selectedWidgetColor === 'custom'}
                                                    onChange={handleSelectChange}
                                                    id='widcolorcustom'
                                                />
                                                <label htmlFor='widcolorcustom'>Custom</label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {selectedWidgetColor == "custom" &&
                            <div className="whitebox p-0">
                                <div className='custwidtitle'>
                                    <h3>Custom widget colors</h3>
                                </div>
                                <div className='insidewhitecard'>
                                    <div className='widget-theme-options'>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Header text</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="headerTextColor" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button border</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonBorderColor" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button text</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonTitleColor" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button background on hover</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonBackgroundOnHover" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button text on hover</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonTextOnHover" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button background</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonBackground" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reviews text</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="reviewsText" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reviews background</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="reviewsBackground" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reviews background on hover</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="reviewsBackgroundOnHover" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reply text</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="replyText" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reply background</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="replyBackground" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reply background on hover</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="replyBackgroundOnHover" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Verified badge background color</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="verifiedBadgeBackgroundColor" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Stars bar fill</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="starsBarFill" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Stars bar background</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="starsBarBackground" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="whitebox p-0">
                            <div className='custwidtitle'>
                                <h3>Widget settings</h3>
                            </div>
                            <div className='insidewhitecard'>
                                <div className='widget-theme-options'>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Review shadow</label>
                                        <div className='sideinput mw300 flxflexi'>

                                            <select name="reviewShadow" onChange={handleSelectChange} value={selectedReviewShadow} className='input_text'>
                                                <option value="basic">Basic</option>
                                                <option value="dark_offset">Dark offset</option>
                                                <option value="light_offset">Light offset</option>
                                                <option value="no">No shadow</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Corner Radius</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="cornerRadius" onChange={handleSelectChange} value={selectedCornerRadius} className='input_text'>
                                                <option value="sharp">Sharp</option>
                                                <option value="slightly_rounded">Slightly Rounded</option>
                                                <option value="rounded">Rounded</option>
                                                <option value="extra_rounded">Extra Rounded</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Header layout</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="headerLayout" onChange={handleSelectChange} value={selectedHeaderLayout} className='input_text'>
                                                <option value="minimal">Minimal</option>
                                                <option value="compact">Compact</option>
                                                <option value="expanded">Expanded</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Product Reviews Widget</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="productReviewsWidget" onChange={handleSelectChange} value={selectedProductReviewsWidget} className='input_text'>
                                                <option value="always_shown">Always shown</option>
                                                <option value="hidden_when_empty">Hidden when empty</option>
                                                <option value="always_hidden">Always hidden</option>
                                                <option value="all_reviews_when_empty">All reviews when empty</option>
                                                <option value="all_reviews_always">All reviews always</option>
                                            </select>
                                            <div className='inputnote'>Note: Hiding the widget will also hide the "Write a review" button</div>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">"Write a review" button</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="writeReviewButton" onChange={handleSelectChange} value={selectedWriteReviewButton} className='input_text'>
                                                <option value="show">Always shown</option>
                                                <option value="hide">Always hidden</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Reviews per page</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="cornerRadius" onChange={handleSelectChange} value={selectedCornerRadius} className='input_text'>
                                                <option value="">1</option>
                                                <option value="">2</option>
                                            </select>
                                            <div className='inputnote'>Number of reviews displayed before "Show more" on product pages</div>
                                        </div>
                                    </div> */}
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Review dates</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="reviewDates" onChange={handleSelectChange} value={selectedReviewDates} className='input_text'>
                                                <option value="show">Shown</option>
                                                <option value="hide">Hidden</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Item type</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="itemType" onChange={handleSelectChange} value={selectedItemType} className='input_text'>
                                                <option value="show">Shown</option>
                                                <option value="hide">Hidden</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Default sorting</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="defaultSorting" onChange={handleSelectChange} value={selectedDefaultSorting} className='input_text'>
                                                <option value="featured">Featured</option>
                                                <option value="newest">Newest</option>
                                                <option value="highest_ratings">Highest Ratings</option>
                                                <option value="lowest_ratings">Lowest Ratings</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="" className='p-0'>Show sorting options</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <div class="form-check form-switch">
                                                <input
                                                    checked={
                                                        selectedShowSortingOptions
                                                    }
                                                    onChange={
                                                        handleSelectChange
                                                    }
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    name="showSortingOptions"
                                                />

                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="" className='p-0'>Show ratings distribution</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <div class="form-check form-switch">
                                                <input
                                                    checked={
                                                        selectedShowRatingsDistribution
                                                    }
                                                    onChange={
                                                        handleSelectChange
                                                    }
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    role="switch"
                                                    name="showRatingsDistribution"
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="whitebox p-0">
                            <div className='custwidtitle'>
                                <h3>Content</h3>
                            </div>
                            <div className='insidewhitecard flxcol gapy18'>
                            <div className="form-group m-0">
                                    <label htmlFor="">Review Header Title</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="reviewHeaderTitle" value={reviewHeaderTitle} placeholder={placeHolderLanguageData.reviewHeaderTitle} />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Review (Singular)</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="reviewSingular" value={reviewSingular} placeholder={placeHolderLanguageData.reviewSingular} />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Reviews (Plural)</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="reviewPlural" value={reviewPlural} placeholder={placeHolderLanguageData.reviewPlural} />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Write a review button title</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="writeReviewButtonTitle" value={writeReviewButtonTitle} placeholder={placeHolderLanguageData.writeReviewButtonTitle} />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">No reviews title - first part</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="noReviewsTitleFirstPart" value={noReviewsTitleFirstPart} placeholder={placeHolderLanguageData.noReviewsTitleFirstPart} />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">No reviews title - last part (underlined)</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="noReviewsTitleLastPart" value={noReviewsTitleLastPart} placeholder={placeHolderLanguageData.noReviewsTitleLastPart} />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Show more reviews title</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="showMoreReviewsTitle" value={showMoreReviewsTitle} placeholder={placeHolderLanguageData.showMoreReviewsTitle} />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Link to product page button title</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="productPageLinkTitle" value={productPageLinkTitle} placeholder={placeHolderLanguageData.productPageLinkTitle} />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Item type title</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="itemTypeTitle" value={itemTypeTitle} placeholder={placeHolderLanguageData.itemTypeTitle} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className='whitebox p-0'>
                        <div class="custwidtitle">
                            <h3>Preview</h3>
                        </div>
                        <div className='insidewhitecard'>
                            <div className='reviewbox_wrap'></div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default ProductReviewWidget;
