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
import Dropdown from 'react-bootstrap/Dropdown';
import {
    Select,
} from '@shopify/polaris';
import ProductReviewWidgetModal from './ProductReviewWidgetModal';

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
    const [widgetColorStyles, setWidgetColorStyles] = useState({
        headerTextColor: '',
        buttonBorderColor: '',
        buttonTitleColor: '',
        buttonBackground: '',
        buttonBackgroundOnHover: '',
        buttonTextOnHover: '',
        starsBarBackground: '',
        starsBarFill: '',
        replyText: '',
        replyBackground: '',
        replyBackgroundOnHover: '',
        reviewsText: '',
        reviewsBackground: '',
        reviewsBackgroundOnHover: '',
    });
    const [selectedReviewShadowValue, setSelectedReviewShadowValue] = useState('');
    const [showPreviewModal, setShowPreviewModal] = useState(false);

    const handleClosePreviewModal = () => setShowPreviewModal(false);

    const handleShowPreviewModal = () => {
        setShowPreviewModal(true);
    }


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

                setInitialData(prevState => ({
                    ...(prevState || {}),
                    [e.target.name]: e.target.value
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


    useEffect(() => {
        let headerTextColor, buttonBorderColor, buttonTitleColor, buttonBackgroundOnHover, buttonTextOnHover, buttonBackground, starsBarBackground, starsBarFill, replyText, replyBackground, replyBackgroundOnHover, reviewsText, reviewsBackground, reviewsBackgroundOnHover = "";


        if (selectedWidgetColor == 'custom') {
            headerTextColor = documentObj.headerTextColor;
            buttonBorderColor = `1px solid ${documentObj.buttonBorderColor}`;
            buttonTitleColor = documentObj.buttonTitleColor;
            buttonBackground = documentObj.buttonBackground;

            buttonBackgroundOnHover = documentObj.buttonBackgroundOnHover;
            buttonTextOnHover = documentObj.buttonTextOnHover;
            starsBarBackground = documentObj.starsBarBackground;
            starsBarFill = documentObj.starsBarFill;

            replyText = documentObj.replyText;
            replyBackground = documentObj.replyBackground;
            replyBackgroundOnHover = documentObj.replyBackgroundOnHover;
            reviewsText = documentObj.reviewsText;
            reviewsBackground = documentObj.reviewsBackground;
            reviewsBackgroundOnHover = documentObj.reviewsBackgroundOnHover;
        } else if (selectedWidgetColor == 'white') {
            headerTextColor = '#ffffff';
            buttonBorderColor = `1px solid #ffffff`;
            buttonTitleColor = '#ffffff';
            buttonBackground = '#000000';
        }
        setWidgetColorStyles({
            headerTextColor,
            buttonBorderColor,
            buttonTitleColor,
            buttonBackground,
            buttonBackgroundOnHover,
            buttonTextOnHover,
            starsBarBackground,
            starsBarFill,
            replyText,
            replyBackground,
            replyBackgroundOnHover,
            reviewsText,
            reviewsBackground,
            reviewsBackgroundOnHover
        });

        let reviewShadow = '0px 0px 0px rgba(0, 0, 0, 0)';
        if (selectedReviewShadow == 'basic') {
            reviewShadow = '0 0 3px rgba(0, 0, 0, 0.2)';
        } else if (selectedReviewShadow == 'dark_offset') {
            reviewShadow = '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)';
        } else if (selectedReviewShadow == 'light_offset') {
            reviewShadow = '0px 6px 14px -4px rgba(0, 0, 0, 0.14)';
        }
        setSelectedReviewShadowValue(reviewShadow);

    }, [selectedWidgetColor, selectedReviewShadow, documentObj]);


    const getPreviewText = (type, lang) => {
        if (lang && type && documentObj[lang] && documentObj[lang][type] !== undefined && documentObj[lang][type] !== '') {
            return documentObj[lang][type];
        } else {
            return t(`productReviewConstomize.${type}`);
        }
    }
    // console.log(selectedHeaderLayout);

    const minimalHeader = selectedHeaderLayout === 'minimal';
    const compactHeader = selectedHeaderLayout === 'compact';
    const expandedHeader = selectedHeaderLayout === 'expanded';

    return (
        <>
            <div className="row">
                <div className="col-lg-5">
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
                                                <option value="0">Sharp</option>
                                                <option value="4">Slightly Rounded</option>
                                                <option value="8">Rounded</option>
                                                <option value="16">Extra Rounded</option>
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
                                            <div className="form-check form-switch">
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
                                            <div className="form-check form-switch">
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
                <div className="col-lg-7">
                    <div className='whitebox p-0'>
                        <div className="custwidtitle">
                            <h3>Preview</h3>
                            <div className='btnbox ms-auto'>
                                <a href="#" onClick={(e) => handleShowPreviewModal()} className='revbtn tinybtn'>Preview</a>
                            </div>
                            <ProductReviewWidgetModal
                                show={showPreviewModal}
                                handleClose={handleClosePreviewModal}
                            />
                        </div>
                        <style>
                            {`
								.lightbtn:hover {
									background-color: ${widgetColorStyles.buttonBackgroundOnHover} !important;
									color : ${widgetColorStyles.buttonTextOnHover} !important;
								}
								.review_top_actions .stardetaildd .stardetailrow .processbar .activebar {
									background-color: ${widgetColorStyles.starsBarFill} !important;
								}

								.review_top_actions .stardetaildd .stardetailrow .processbar {
									background-color: ${widgetColorStyles.starsBarBackground} !important;
								}
                                .reply-text:hover {
                                    background-color: ${widgetColorStyles.replyBackgroundOnHover} !important;
                                }
                                .custombg:hover {
                                    background-color: ${widgetColorStyles.reviewsBackgroundOnHover} !important;
                                }
                                .box-style {
                                    border-radius : ${selectedCornerRadius}px !important;
                                    box-shadow : ${selectedReviewShadowValue};
                                }
        					`}
                        </style>
                        <div className='insidewhitecard'>
                            <div className='reviewbox_wrap'>
                                <div className={`review_top_actions ${minimalHeader ? 'minimalheader' : 'otherheaderlayout'} ${compactHeader ? 'compactheader' : ''} ${expandedHeader ? 'expandedheader' : ''}`}>
                                    <div className={`left_actions flxfix ${minimalHeader ? '' : 'sidebyside'}`}>
                                        <div className="leftpart">
                                            <div className="section_title" style={{ color: widgetColorStyles.headerTextColor }} >{getPreviewText('reviewHeaderTitle', currentLanguage)}</div>
                                            {!minimalHeader &&
                                                <div className="bigcountavarage flxrow">
                                                    <i className='rating-star-rounded'></i>
                                                    <div className="averagetext">4.7</div>
                                                </div>
                                            }
                                            {!minimalHeader &&
                                                <div className="totalreviewcount" style={{ color: widgetColorStyles.headerTextColor }}>
                                                    <span>5</span> {getPreviewText('reviewPlural', currentLanguage)}
                                                </div>
                                            }
                                        </div>
                                        <div className="rightpart">
                                            {!minimalHeader &&
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
                                            }
                                            {minimalHeader &&
                                                <div className="star-rating">
                                                    <Dropdown>
                                                        <Dropdown.Toggle variant="" className='starbtn' id="dropdown-basic">
                                                            <div className={`ratingstars flxrow star-4`}>
                                                                <i className='rating-star-rounded'></i>
                                                                <i className='rating-star-rounded'></i>
                                                                <i className='rating-star-rounded'></i>
                                                                <i className='rating-star-rounded'></i>
                                                                <i className='rating-star-rounded'></i>
                                                            </div>
                                                            <div className='ratingcount' style={{ color: widgetColorStyles.headerTextColor }}>4 {t('out_of')} <span>5</span></div>
                                                            {selectedShowRatingsDistribution &&
                                                                <div className="arrowright" style={{ color: widgetColorStyles.headerTextColor }}>
                                                                    <i className='twenty-arrow-down'></i>
                                                                </div>
                                                            }
                                                        </Dropdown.Toggle>
                                                        {selectedShowRatingsDistribution &&
                                                            <Dropdown.Menu align={'start'}>
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
                                                                <input type="hidden" id="ratting_wise_filter" />
                                                            </Dropdown.Menu>
                                                        }
                                                    </Dropdown>

                                                </div>
                                            }
                                        </div>

                                        {minimalHeader &&
                                            <div className="totalreviewcount" style={{ color: widgetColorStyles.headerTextColor }}>
                                                <span>5</span> {getPreviewText('reviewPlural', currentLanguage)}
                                            </div>
                                        }
                                    </div>
                                    <div className="right_actions btnwrap flxflexi flxrow justify-content-end">
                                        {selectedShowSortingOptions &&
                                            <Dropdown>
                                                <Dropdown.Toggle variant="" className='revbtn lightbtn wbigbtn noafter' id="dropdown-basic" style={{ border: widgetColorStyles.buttonBorderColor, color: widgetColorStyles.buttonTitleColor, backgroundColor: widgetColorStyles.buttonBackground }}>
                                                    <i className='twenty-filtericon'></i>
                                                    {t('sort_by')}
                                                    <div className="arrowright">
                                                        <i className='twenty-arrow-down'></i>
                                                    </div>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu align={'end'}>
                                                    <li><a className="dropdown-item sort_by_filter" data-sort="tag_as_feature" href="#">Featured</a></li>
                                                    <li><a className="dropdown-item sort_by_filter" data-sort="newest" href="#">Newest</a></li>
                                                    <li><a className="dropdown-item sort_by_filter" data-sort="highest_ratings" href="#">Highest rating</a></li>
                                                    <li><a className="dropdown-item sort_by_filter" data-sort="lowest_ratings" href="#">Lowest rating</a></li>
                                                    <input type="hidden" id="sort_by_filter" />
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        }

                                        {selectedWriteReviewButton == "show" && <button className="revbtn wbigbtn" id="show_create_review_modal" style={{ border: widgetColorStyles.buttonBorderColor, color: widgetColorStyles.buttonTitleColor, backgroundColor: widgetColorStyles.buttonBackground }} >{getPreviewText('writeReviewButtonTitle', currentLanguage)}</button>}
                                    </div>
                                </div>
                                <div className='review-list-item frontreviewbox'>
                                    <div className='box-style custombg' style={{ backgroundColor: widgetColorStyles.reviewsBackground }}>
                                        <div className='review'>
                                            <div className='review_topbar flxrow'>
                                                <div className='mid_detail flxflexi' >
                                                    <h4 style={{ color: widgetColorStyles.reviewsText }}>John H</h4>
                                                    {selectedReviewDates == "show" && <div className='date' style={{ color: widgetColorStyles.reviewsText }}>08/03/2024</div>}
                                                </div>
                                                <div className='star_reviews flxfix'>
                                                    <div className='star-rating'>
                                                        <div className='ratingcount'>4.0</div>
                                                        <div className='ratingstars flxrow star-4'>
                                                            <i className="rating-star-rounded"></i>
                                                            <i className="rating-star-rounded"></i>
                                                            <i className="rating-star-rounded"></i>
                                                            <i className="rating-star-rounded"></i>
                                                            <i className="rating-star-rounded"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='text_content'>
                                                <p>I have been using these industry leading headphones by Sony, colour Midnight Blue, and trust me i find them worth every penny spent. Yes, i agree these headphones are highly expensive, some may say you can purchase Apple Airpods, Boss, Sennheiser, and other audio equipment options, but trust me nothing beats these bad boys.</p>
                                            </div>
                                            {selectedItemType == "show" &&
                                                <div className='text_content '>
                                                    <p><strong>{getPreviewText('itemTypeTitle', currentLanguage)}</strong> :  L / Blue</p>
                                                </div>
                                            }
                                            <div className='text_content reply-text' style={{ backgroundColor: widgetColorStyles.replyBackground }}>
                                                <p style={{ color: widgetColorStyles.replyText }}><strong>{shopRecords.name}</strong> {t('replied')}:</p>
                                                <p style={{ color: widgetColorStyles.replyText }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                            </div>
                                            <div className='review_bottomwrap'>
                                                <div className='product-container product-thumb-detail'>
                                                    <div className='image flxfix'>
                                                        <img src={`${settingsJson.host_url}/app/images/product-default.png`} alt="" />
                                                    </div>
                                                    <div className='text flxflexi'>
                                                        <p>Sample Product</p>
                                                    </div>
                                                </div>
                                                <div className='review_imageswrap flxrow'>
                                                    <div className='imagebox'>
                                                        <img src={`${settingsJson.host_url}/app/images/sample-review-images/1.png`} alt="" />
                                                    </div>
                                                    <div className='imagebox'>
                                                        <img src={`${settingsJson.host_url}/app/images/sample-review-images/2.png`} alt="" />
                                                    </div>

                                                    <div className='imagebox'>
                                                        <img src={`${settingsJson.host_url}/app/images/sample-review-images/3.png`} alt="" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default ProductReviewWidget;
