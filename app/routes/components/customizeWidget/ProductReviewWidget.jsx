import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import settingsJson from './../../../utils/settings.json';
import ColorPicker from "./../settings/ColorPicker";
import GridLayoutIcon from '../icons/GridLayoutIcon';
import ListLayoutIcon from '../icons/ListLayoutIcon';
import CompactLayoutIcon from '../icons/CompactLayoutIcon';
import ReviewVerifyIcon from '../icons/ReviewVerifyIcon';

import {
    Select, Button, Icon, Card, Box, Text, Grid, RadioButton, BlockStack, InlineGrid, Checkbox, TextField
} from '@shopify/polaris';
import {
    ViewIcon, ChevronUpIcon, ChevronDownIcon
} from '@shopify/polaris-icons';
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
    const [lightDarkModel, setLightDarkModel] = useState(false);


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

    const handleRadioChange = useCallback(async (value, fieldValue, fieldName) => {

        const eventKey = fieldName;
        const eventVal = fieldValue;

        const updateData = {
            field: eventKey,
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


            setDocumentObj(prevState => ({
                ...(prevState || {}),  // Ensure prevState is an object
                [eventKey]: eventVal
            }));


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
        }
    });

    const handleSelectChange = useCallback(async (fieldValue, fieldName) => {
        console.log(fieldValue, fieldName);
        const eventKey = fieldName;
        let eventVal = fieldValue;
        if (eventKey == 'showSortingOptions') {
            eventVal = !selectedShowSortingOptions;
        } else if (eventKey == 'showRatingsDistribution') {
            eventVal = !selectedShowRatingsDistribution;
        }
        const updateData = {
            field: eventKey,
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


            setDocumentObj(prevState => ({
                ...(prevState || {}),  // Ensure prevState is an object
                [eventKey]: eventVal
            }));


        } else {
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime,
                isError: true
            });
        }
        if (eventKey == 'reviewShadow') {
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
    });

    const handleInputBlur = useCallback(async (name, value) => {
        const fieldName = name;
        const fieldValue = value;

        const language = localStorage.getItem('i18nextLng');

        if (initialData[fieldName] != fieldValue) {
            const updateData = {
                field: fieldName,
                value: fieldValue,
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
                        [fieldName]: fieldValue
                    }
                }));

                setInitialData(prevState => ({
                    ...(prevState || {}),
                    [fieldName]: fieldValue
                }));


            } else {
                shopify.toast.show(data.message, {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
            }
        }
    }, [initialData]);


    const changeLanguageInput = useCallback((value, name) => {
        const eventVal = value;
        const eventKey = name;
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
    });


    useEffect(() => {
        let headerTextColor, buttonBorderColor, buttonTitleColor, buttonBackgroundOnHover, buttonTextOnHover, buttonBackground, starsBarBackground, starsBarFill, replyText, replyBackground, replyBackgroundOnHover, reviewsText, reviewsBackground, reviewsBackgroundOnHover = "";

        let verifiedBadgeBackgroundColor = "#282828";
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
            verifiedBadgeBackgroundColor = documentObj.verifiedBadgeBackgroundColor;
        } else if (selectedWidgetColor == 'white') {
            headerTextColor = '#ffffff';
            buttonBorderColor = `1px solid #ffffff`;
            // buttonTitleColor = '#ffffff';
            // buttonBackground = '#ffffff';
            buttonTextOnHover = '#000000';

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
            reviewsBackgroundOnHover,
            verifiedBadgeBackgroundColor
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


    const changeLightDarkModel = (e) => {
        e.preventDefault();
        setLightDarkModel(!lightDarkModel);

    }

    const getPreviewText = (type, lang) => {
        if (lang && type && documentObj[lang] && documentObj[lang][type] !== undefined && documentObj[lang][type] !== '') {
            return documentObj[lang][type];
        } else {
            return t(`productReviewConstomize.${type}`);
        }
    }

    const minimalHeader = selectedHeaderLayout === 'minimal';
    const compactHeader = selectedHeaderLayout === 'compact';
    const expandedHeader = selectedHeaderLayout === 'expanded';
    const gridFormat = selectedLayout === 'grid';
    const listFormat = selectedLayout === 'list';
    const compactFormat = selectedLayout === 'compact';

    let reviewWidgetLayoutWidth = "100%";
    let gridClassName = 'full-grid';
    if (gridFormat) {
        reviewWidgetLayoutWidth = "33.33%";
        gridClassName = 'grid-four-column';
    } else if (compactFormat) {
        reviewWidgetLayoutWidth = "50%";
        gridClassName = 'grid-two-column';
    }

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
            <div className="subtitlebox">
                <h2>Review Widget</h2>
                <p>Collect and display product reviews on your product pages.</p>
            </div>
            <div className='flxfix'>
                <Grid>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <Card roundedAbove="sm">
                            <Box paddingBlock="200">
                                <Text variant="headingMd" as="h6">
                                    Widget layout
                                </Text>

                            </Box>
                            <Box paddingBlock="200">
                                <div className='insidewhitecard'>
                                    <div className="form-group m-0">
                                        <div className='layoutstr'>
                                            <div className='layoutbox'>
                                                <input
                                                    type='radio'
                                                    value="grid"
                                                    name='widgetLayout'
                                                    id='gridlayout'
                                                    onChange={() => handleRadioChange("", "grid", "widgetLayout")}
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
                                                    onChange={() => handleRadioChange("", "list", "widgetLayout")}
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
                                                    onChange={() => handleRadioChange("", "compact", "widgetLayout")}
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
                            </Box>
                        </Card>
                        <Box paddingBlockStart="400" />

                        <Card roundedAbove="sm">
                            <Box paddingBlock="200">
                                <Text variant="headingMd" as="h6">
                                    Widget colors
                                </Text>

                            </Box>
                            <Box paddingBlock="200">
                                <BlockStack >
                                    <RadioButton
                                        label="Black text (best over light backgrounds)"
                                        checked={selectedWidgetColor === 'black'}
                                        id="black"
                                        name="widgetColor"
                                        onChange={(value, name) => handleRadioChange(value, name, "widgetColor")}
                                    />

                                    <RadioButton
                                        label="White text (best over dark backgrounds)"
                                        checked={selectedWidgetColor === 'white'}
                                        id="white"
                                        name="widgetColor"
                                        onChange={(value, name) => handleRadioChange(value, name, "widgetColor")}
                                    />

                                    <RadioButton
                                        label="Custom"
                                        checked={selectedWidgetColor === 'custom'}
                                        id="custom"
                                        name="widgetColor"
                                        onChange={(value, name) => handleRadioChange(value, name, "widgetColor")}
                                    />
                                </BlockStack>


                            </Box>
                        </Card>

                        {selectedWidgetColor == "custom" &&
                            <>
                                <Box paddingBlockStart="400" />

                                <Card roundedAbove="sm">
                                    <Box paddingBlock="200">
                                        <Text variant="headingMd" as="h6">
                                            Custom widget colors
                                        </Text>

                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Header text</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="headerTextColor" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Button border</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonBorderColor" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Button text</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonTitleColor" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Button background on hover</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonBackgroundOnHover" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Button text on hover</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonTextOnHover" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Button background</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonBackground" />
                                        </InlineGrid>
                                    </Box>


                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Reviews text</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="reviewsText" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Reviews background</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="reviewsBackground" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Reviews background on hover</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="reviewsBackgroundOnHover" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Reply text</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="replyText" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Reply background</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="replyBackground" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Reply background on hover</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="replyBackgroundOnHover" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Verified badge icon color</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="verifiedBadgeBackgroundColor" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Stars bar fill</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="starsBarFill" />
                                        </InlineGrid>
                                    </Box>

                                    <Box paddingBlock="200">
                                        <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                            <Text>Stars bar background</Text>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="starsBarBackground" />
                                        </InlineGrid>
                                    </Box>
                                </Card>

                            </>
                        }

                        <Box paddingBlockStart="400" />

                        <Card roundedAbove="sm">
                            <Box paddingBlock="200">
                                <Text variant="headingMd" as="h6">
                                    Widget settings
                                </Text>
                            </Box>

                            <Box paddingBlock="200">
                                <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                    <Text>Review shadow</Text>
                                    <Select
                                        options={settingsJson.reviewShadowOptions}
                                        onChange={(value) => handleSelectChange(value, 'reviewShadow')}
                                        value={selectedReviewShadow}
                                    />
                                </InlineGrid>
                            </Box>


                            <Box paddingBlock="200">
                                <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                    <Text>Corner Radius</Text>
                                    <Select
                                        options={settingsJson.cornerOptions}
                                        onChange={(value) => handleSelectChange(value, 'cornerRadius')}
                                        value={selectedCornerRadius}
                                    />
                                </InlineGrid>
                            </Box>

                            <Box paddingBlock="200">
                                <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                    <Text>Header layout</Text>
                                    <Select
                                        options={settingsJson.headerLayoutOptions}
                                        onChange={(value) => handleSelectChange(value, 'headerLayout')}
                                        value={selectedHeaderLayout}
                                    />
                                </InlineGrid>
                            </Box>



                            <Box paddingBlock="200">
                                <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                    <Text>"Write a review" button</Text>
                                    <Select
                                        options={settingsJson.writeReviewButtonOptions}
                                        onChange={(value) => handleSelectChange(value, 'writeReviewButton')}
                                        value={selectedWriteReviewButton}
                                    />
                                </InlineGrid>
                            </Box>

                            <Box paddingBlock="200">
                                <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                    <Text>Review dates</Text>
                                    <Select
                                        options={settingsJson.hideShowOptions}
                                        onChange={(value) => handleSelectChange(value, 'reviewDates')}
                                        value={selectedReviewDates}
                                    />
                                </InlineGrid>
                            </Box>

                            <Box paddingBlock="200">
                                <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                    <Text>Item type</Text>
                                    <Select
                                        options={settingsJson.hideShowOptions}
                                        onChange={(value) => handleSelectChange(value, 'itemType')}
                                        value={selectedItemType}
                                    />
                                </InlineGrid>
                            </Box>

                            <Box paddingBlock="200">
                                <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                    <Text>Default sorting</Text>
                                    <Select
                                        options={settingsJson.sortingOptions}
                                        onChange={(value) => handleSelectChange(value, 'defaultSorting')}
                                        value={selectedDefaultSorting}
                                    />
                                </InlineGrid>
                            </Box>


                            <Box paddingBlock="200">
                                <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                    <Text>Show sorting options</Text>
                                    <Checkbox
                                        checked={selectedShowSortingOptions}
                                        onChange={(value) => handleSelectChange(value, 'showSortingOptions')}
                                    />
                                </InlineGrid>
                            </Box>

                            <Box paddingBlock="200">
                                <InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">
                                    <Text>Show ratings distribution</Text>
                                    <Checkbox
                                        checked={selectedShowRatingsDistribution}
                                        onChange={(value) => handleSelectChange(value, 'showRatingsDistribution')}
                                    />
                                </InlineGrid>
                            </Box>

                        </Card>

                        <Box paddingBlockStart="400" />

                        <Card roundedAbove="sm">
                            <Box paddingBlock="200">
                                <Text variant="headingMd" as="h6">
                                    Content
                                </Text>

                            </Box>

                            <Box paddingBlock="200">

                                <TextField
                                    label="Review Header Title"
                                    value={reviewHeaderTitle}
                                    onChange={(value) => changeLanguageInput(value, 'reviewHeaderTitle')} // Update value on change
                                    onBlur={() => handleInputBlur('reviewHeaderTitle', reviewHeaderTitle)}
                                    autoComplete="off"
                                    placeholder={placeHolderLanguageData.reviewHeaderTitle}
                                />
                            </Box>

                            <Box paddingBlock="200">
                                <TextField
                                    label="Review (Singular)"
                                    value={reviewSingular}
                                    onChange={(value) => changeLanguageInput(value, 'reviewSingular')}
                                    onBlur={() => handleInputBlur('reviewSingular', reviewSingular)}
                                    autoComplete="off"
                                    placeholder={placeHolderLanguageData.reviewSingular}
                                />
                            </Box>

                            <Box paddingBlock="200">
                                <TextField
                                    label="Reviews (Plural)"
                                    value={reviewPlural}
                                    onChange={(value) => changeLanguageInput(value, 'reviewPlural')}
                                    onBlur={() => handleInputBlur('reviewPlural', reviewPlural)}
                                    autoComplete="off"
                                    placeholder={placeHolderLanguageData.reviewPlural}
                                />
                            </Box>

                            <Box paddingBlock="200">
                                <TextField
                                    label="Write a review button title"
                                    value={writeReviewButtonTitle}
                                    onChange={(value) => changeLanguageInput(value, 'writeReviewButtonTitle')}
                                    onBlur={() => handleInputBlur('writeReviewButtonTitle', writeReviewButtonTitle)}
                                    autoComplete="off"
                                    placeholder={placeHolderLanguageData.writeReviewButtonTitle}
                                />
                            </Box>


                            <Box paddingBlock="200">
                                <TextField
                                    label="No reviews title - first part"
                                    value={noReviewsTitleFirstPart}
                                    onChange={(value) => changeLanguageInput(value, 'noReviewsTitleFirstPart')}
                                    onBlur={() => handleInputBlur('noReviewsTitleFirstPart', noReviewsTitleFirstPart)}
                                    autoComplete="off"
                                    placeholder={placeHolderLanguageData.noReviewsTitleFirstPart}
                                />
                            </Box>

                            <Box paddingBlock="200">
                                <TextField
                                    label="No reviews title - last part (underlined)"
                                    value={noReviewsTitleLastPart}
                                    onChange={(value) => changeLanguageInput(value, 'noReviewsTitleLastPart')}
                                    onBlur={() => handleInputBlur('noReviewsTitleLastPart', noReviewsTitleLastPart)}
                                    autoComplete="off"
                                    placeholder={placeHolderLanguageData.noReviewsTitleLastPart}
                                />
                            </Box>

                            <Box paddingBlock="200">
                                <TextField
                                    label="Show more reviews title"
                                    value={showMoreReviewsTitle}
                                    onChange={(value) => changeLanguageInput(value, 'showMoreReviewsTitle')}
                                    onBlur={() => handleInputBlur('showMoreReviewsTitle', showMoreReviewsTitle)}
                                    autoComplete="off"
                                    placeholder={placeHolderLanguageData.showMoreReviewsTitle}
                                />
                            </Box>

                            <Box paddingBlock="200">
                                <TextField
                                    label="Link to product page button title"
                                    value={productPageLinkTitle}
                                    onChange={(value) => changeLanguageInput(value, 'productPageLinkTitle')}
                                    onBlur={() => handleInputBlur('productPageLinkTitle', productPageLinkTitle)}
                                    autoComplete="off"
                                    placeholder={placeHolderLanguageData.productPageLinkTitle}
                                />
                            </Box>


                            <Box paddingBlock="200">
                                <TextField
                                    label="Item type title"
                                    value={itemTypeTitle}
                                    onChange={(value) => changeLanguageInput(value, 'itemTypeTitle')}
                                    onBlur={() => handleInputBlur('itemTypeTitle', itemTypeTitle)}
                                    autoComplete="off"
                                    placeholder={placeHolderLanguageData.itemTypeTitle}
                                />
                            </Box>
                        </Card>
                    </Grid.Cell>
                    <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 6, xl: 6 }}>
                        <Card roundedAbove="sm">
                            <Box paddingBlock="200">
                                <InlineGrid columns={['oneThird', 'oneThird', 'oneThird']} >
                                    <Box padding="100" >
                                        <Text variant="headingMd" as="h6">
                                            Widget Preview
                                        </Text>
                                    </Box>
                                    <Box>
                                        <div className='lightdarkwrap'>
                                            <button href='#' onClick={changeLightDarkModel} className={`${lightDarkModel ? 'darkbg' : ''}`}><i></i></button>
                                        </div>
                                    </Box>

                                    <Box>
                                        <Button icon={ViewIcon} onClick={(e) => handleShowPreviewModal()}>Preview</Button>
                                    </Box>

                                </InlineGrid>
                            </Box>


                            <Box paddingBlock="200">
                                <style>
                                    {`
                                        .custombtn:hover {
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

                                <div className={`insidewhitecard ${lightDarkModel ? 'darkpreview' : ''}`}>
                                    <div className='reviewbox_wrap'>

                                        <div className={`review_top_actions ${minimalHeader ? 'minimalheader' : 'otherheaderlayout'} ${compactHeader ? 'compactheader' : ''} ${expandedHeader ? 'expandedheader' : ''}`}>
                                            <div className={`left_actions flxfix ${minimalHeader ? '' : 'sidebyside'}`}>
                                                <div className="leftpart">
                                                    <div className="section_title" style={{ color: widgetColorStyles.headerTextColor }} >{getPreviewText('reviewHeaderTitle', currentLanguage)}</div>
                                                    {!minimalHeader &&
                                                        <div className="bigcountavarage flxrow">
                                                            <i className='rating-star-rounded'></i>
                                                            <div className="averagetext" style={{ color: widgetColorStyles.headerTextColor }}>4.7</div>
                                                        </div>
                                                    }
                                                    {!minimalHeader &&
                                                        <div className="totalreviewcount" style={{ color: widgetColorStyles.headerTextColor }}>
                                                            <span>5</span> {getPreviewText('reviewPlural', currentLanguage)}
                                                        </div>
                                                    }
                                                </div>
                                                <div className="rightpart">
                                                    {!minimalHeader && (
                                                        selectedShowRatingsDistribution &&
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
                                                                    <div className='ratingcount' style={{ color: widgetColorStyles.headerTextColor }}>4 {t('out_of')} <span>5</span></div>
                                                                    {selectedShowRatingsDistribution &&
                                                                        <div className="arrowright" style={{ color: widgetColorStyles.headerTextColor }}>
                                                                            <i className='twenty-arrow-down'></i>
                                                                        </div>
                                                                    }

                                                                </a>
                                                                {(selectedShowRatingsDistribution && isOpenDisct) && (
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
                                                    <div className="totalreviewcount" style={{ color: widgetColorStyles.headerTextColor }}>
                                                        <span>5</span> {getPreviewText('reviewPlural', currentLanguage)}
                                                    </div>
                                                }
                                            </div>
                                            <div className="right_actions btnwrap flxflexi flxrow justify-content-end">
                                                {selectedShowSortingOptions &&

                                                    <div className="dropdown">

                                                        <button className="dropbtn custombtn" onClick={toggleDropdown} style={{ border: widgetColorStyles.buttonBorderColor, color: widgetColorStyles.buttonTitleColor, backgroundColor: widgetColorStyles.buttonBackground }}>
                                                            <i className="twenty-filtericon"></i> {t('sort_by')} {isOpen ? <Icon source={ChevronUpIcon} tone="base" /> : <Icon source={ChevronDownIcon} tone="base" />} {/* Up and Down arrows */}
                                                        </button>
                                                        {isOpen && (
                                                            <div className="dropdown-content">
                                                                <button>{t('featured')}</button>
                                                                <button>{t('newest')}</button>
                                                                <button>{t('highest_rating')}</button>
                                                                <button>{t('lowest_rating')}</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                }

                                                {selectedWriteReviewButton == "show" && <button className="revbtn wbigbtn custombtn " id="show_create_review_modal" style={{ border: widgetColorStyles.buttonBorderColor, color: widgetColorStyles.buttonTitleColor, backgroundColor: widgetColorStyles.buttonBackground }} >{getPreviewText('writeReviewButtonTitle', currentLanguage)}</button>}
                                            </div>
                                        </div>
                                        <div className={`review-list-item frontreviewbox ${gridClassName}`}>
                                            <div className='box-style custombg' style={{ backgroundColor: widgetColorStyles.reviewsBackground }}>
                                                <div className='review'>
                                                    {gridFormat &&
                                                        <div className='review_imageswrap flxrow'>
                                                            <div className='imagebox'>
                                                                <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className='review_topbar flxrow'>
                                                        {!gridFormat &&
                                                            <div className={`mid_detail  ${compactFormat ? 'flxrow' : 'flxflexi'}`} >
                                                                <h4 style={{ color: widgetColorStyles.reviewsText }}>John H</h4>
                                                                <div className='nametitle flxrow align-items-center'>
                                                                    <div className='verifiedreview'>
                                                                        <ReviewVerifyIcon color={widgetColorStyles.verifiedBadgeBackgroundColor} /> {t('verifiedPurchase')}
                                                                    </div>
                                                                </div>

                                                                {selectedReviewDates == "show" && <div className='date' style={{ color: widgetColorStyles.reviewsText }}>08/03/2024</div>}
                                                            </div>
                                                        }


                                                        {(listFormat || gridFormat) &&
                                                            <div className='star_reviews flxfix'>
                                                                <div className='star-rating'>
                                                                    {listFormat &&
                                                                        <>
                                                                            <div className='ratingstars flxrow star-4'>
                                                                                <div className='ratingcount'>4.0</div>
                                                                                <i className="rating-star-rounded"></i>
                                                                                <i className="rating-star-rounded"></i>
                                                                                <i className="rating-star-rounded"></i>
                                                                                <i className="rating-star-rounded"></i>
                                                                                <i className="rating-star-rounded"></i>
                                                                            </div>
                                                                        </>
                                                                    }
                                                                    {gridFormat &&
                                                                        <>
                                                                            <div className='ratingstars flxrow star-4'>
                                                                                <i className="rating-star-rounded"></i>
                                                                                <i className="rating-star-rounded"></i>
                                                                                <i className="rating-star-rounded"></i>
                                                                                <i className="rating-star-rounded"></i>
                                                                                <i className="rating-star-rounded"></i>
                                                                            </div>
                                                                            <div className='ratingcount'>4.0</div>
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        }
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
                                                    {gridFormat &&
                                                        <div className='mid_detail flxflexi' >

                                                            <div className='nametitle flxrow align-items-center'>
                                                                <h4 style={{ color: widgetColorStyles.reviewsText }}>
                                                                    John H.
                                                                </h4>
                                                                <div className='verifiedreview'>
                                                                    <ReviewVerifyIcon color={widgetColorStyles.verifiedBadgeBackgroundColor} /> {t('verifiedPurchase')}
                                                                </div>
                                                            </div>

                                                            {selectedReviewDates == "show" && <div className='date' style={{ color: widgetColorStyles.reviewsText }}>08/03/2024</div>}
                                                        </div>
                                                    }
                                                    {compactFormat &&
                                                        <div className='star_reviews flxfix'>
                                                            <div className='star-rating'>
                                                                <div className='ratingstars flxrow star-4'>
                                                                    <i className="rating-star-rounded"></i>
                                                                    <i className="rating-star-rounded"></i>
                                                                    <i className="rating-star-rounded"></i>
                                                                    <i className="rating-star-rounded"></i>
                                                                    <i className="rating-star-rounded"></i>
                                                                </div>
                                                                <div className='ratingcount'>4.0</div>
                                                            </div>
                                                        </div>
                                                    }
                                                    <div className='review_bottomwrap'>
                                                        <div className='product-container product-thumb-detail'>
                                                            <div className='image flxfix'>
                                                                <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                            </div>
                                                            <div className='text flxflexi'>
                                                                <p>Sample Product</p>
                                                            </div>
                                                        </div>
                                                        {!gridFormat &&
                                                            <div className='review_imageswrap flxrow'>
                                                                <div className='imagebox'>
                                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                                </div>
                                                                <div className='imagebox'>
                                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                                </div>
                                                                <div className='imagebox'>
                                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                                                </div>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Box>
                        </Card>
                    </Grid.Cell>
                </Grid>

            </div>

            {showPreviewModal &&
                <ProductReviewWidgetModal
                    show={showPreviewModal}
                    handleClose={handleClosePreviewModal}
                    documentObj={documentObj}
                    shopRecords={shopRecords}
                    getPreviewText={getPreviewText}
                    currentLanguage={currentLanguage}
                    translator={t}
                    lightDarkModel={lightDarkModel}
                    changeLightDarkModel={changeLightDarkModel}

                />}


        </>
    );
};

export default ProductReviewWidget;
