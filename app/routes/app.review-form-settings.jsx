import React, { useState, useEffect } from 'react';
import { json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import LanguageSelector from "./components/language-selector";
import { useNavigate } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import { getShopDetails } from './../utils/getShopDetails';
import reviewFormSettings from './models/reviewFormSettings';
import generalSettings from './models/generalSettings';
import { useTranslation } from "react-i18next";
import ColorPicker from "./../routes/components/settings/ColorPicker";
import settingsJson from "./../utils/settings.json";


import {
    Page,
} from '@shopify/polaris';

export const loader = async ({ request }) => {
    const shopRecords = await getShopDetails(request);
    var JsonData = { shopRecords };

    JsonData['customizeObj'] = await reviewFormSettings.findOne({
        shop_id: shopRecords._id,
    });
    JsonData['generalSettingsModel'] = await generalSettings.findOne({ shop_id: shopRecords._id });

    return json(JsonData);
};

export default function ReviewFormSettings() {
    const { shopRecords, generalSettingsModel, customizeObj } = useLoaderData();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [currentLanguage, setCurrentLanguage] = useState('en');

    const [documentObj, setDocumentObj] = useState(customizeObj);

    const [initialData, setInitialData] = useState({});
    const [placeHolderLanguageData, setPlaceHolderLanguageData] = useState({});

    const [ratingPageTitle, setRatingPageTitle] = useState('');
    const [ratingPageSubTitle, setRatingPageSubTitle] = useState('');
    const [fiveStarsRatingText, setFiveStarsRatingText] = useState('');
    const [fourStarsRatingText, setFourStarsRatingText] = useState('');
    const [threeStarsRatingText, setThreeStarsRatingText] = useState('');
    const [twoStarsRatingText, setTwoStarsRatingText] = useState('');
    const [oneStarsRatingText, setOneStarsRatingText] = useState('');
    const [photoVideoPageTitle, setPhotoVideoPageTitle] = useState('');
    const [photoVideoPageSubTitle, setPhotoVideoPageSubTitle] = useState('');
    const [dragDropPhotoVideoText, setDragDropPhotoVideoText] = useState('');
    const [addPhotoVideoButtonText, setAddPhotoVideoButtonText] = useState('');


    const [dragDropPhotoText, setDragDropPhotoText] = useState('');
    const [addPhotoButtonText, setAddPhotoButtonText] = useState('');


    const [addReviewSameDiscountText, setAddReviewSameDiscountText] = useState('');
    const [addReviewDifferentDiscountText, setAddReviewDifferentDiscountText] = useState('');
    const [reviewTextPageTitle, setReviewTextPageTitle] = useState('');
    const [reviewTextPageSubTitle, setReviewTextPageSubTitle] = useState('');
    const [reviewTextPagePlaceholder, setReviewTextPagePlaceholder] = useState('');
    const [questionTitle, setQuestionTitle] = useState('');
    const [questionSubTitle, setQuestionSubTitle] = useState('');

    const [reviewFormTitle, setReviewFormTitle] = useState('');
    const [reviewFormSubTitle, setReviewFormSubTitle] = useState('');


    const [thankyouTitle, setThankyouTitle] = useState('');
    const [thankyouSubTitle, setThankyouSubTitle] = useState('');
    const [thankyouDiscountText, setThankyouDiscountText] = useState('');

    const [submitButtonTitle, setSubmitButtonTitle] = useState('');
    const [continueButtonTitle, setContinueButtonTitle] = useState('');

    useEffect(() => {
        const defaultLanguage = (generalSettingsModel && generalSettingsModel.defaul_language) ? generalSettingsModel.defaul_language : "en";
        i18n.changeLanguage(defaultLanguage);

    }, []);

    useEffect(() => {
        const language = localStorage.getItem('i18nextLng');
        setCurrentLanguage(language);
        const documentObjInfo = (documentObj && documentObj[currentLanguage]) ? documentObj[currentLanguage] : {};
        const {
            ratingPageTitle,
            ratingPageSubTitle,
            fiveStarsRatingText,
            fourStarsRatingText,
            threeStarsRatingText,
            twoStarsRatingText,
            oneStarsRatingText,
            photoVideoPageTitle,
            photoVideoPageSubTitle,
            dragDropPhotoVideoText,
            addPhotoVideoButtonText,

            dragDropPhotoText,
            addPhotoButtonText,

            addReviewSameDiscountText,
            addReviewDifferentDiscountText,
            reviewTextPageTitle,
            reviewTextPageSubTitle,
            reviewTextPagePlaceholder,
            questionTitle,
            questionSubTitle,
            reviewFormTitle,
            reviewFormSubTitle,

            thankyouTitle,
            thankyouSubTitle,
            thankyouDiscountText,
            submitButtonTitle,
            continueButtonTitle,

        } = documentObjInfo;

        setRatingPageTitle(ratingPageTitle || '');
        setRatingPageSubTitle(ratingPageSubTitle || '');
        setFiveStarsRatingText(fiveStarsRatingText || '');
        setFourStarsRatingText(fourStarsRatingText || '');
        setThreeStarsRatingText(threeStarsRatingText || '');
        setTwoStarsRatingText(twoStarsRatingText || '');
        setOneStarsRatingText(oneStarsRatingText || '');
        setPhotoVideoPageTitle(photoVideoPageTitle || '');
        setPhotoVideoPageSubTitle(photoVideoPageSubTitle || '');
        setDragDropPhotoVideoText(dragDropPhotoVideoText || '');
        setAddPhotoVideoButtonText(addPhotoVideoButtonText || '');
        setDragDropPhotoText(dragDropPhotoText || '');
        setAddPhotoButtonText(addPhotoButtonText || '');
        setAddReviewSameDiscountText(addReviewSameDiscountText || '');
        setAddReviewDifferentDiscountText(addReviewDifferentDiscountText || '');
        setReviewTextPageTitle(reviewTextPageTitle || '');
        setReviewTextPageSubTitle(reviewTextPageSubTitle || '');
        setReviewTextPagePlaceholder(reviewTextPagePlaceholder || '');
        setQuestionTitle(questionTitle || '');
        setQuestionSubTitle(questionSubTitle || '');
        setReviewFormTitle(reviewFormTitle || '');
        setReviewFormSubTitle(reviewFormSubTitle || '');

        setThankyouTitle(thankyouTitle || '');
        setThankyouSubTitle(thankyouSubTitle || '');
        setThankyouDiscountText(thankyouDiscountText || '');

        setSubmitButtonTitle(submitButtonTitle || '');
        setContinueButtonTitle(continueButtonTitle || '');

        setInitialData({
            ratingPageTitle: ratingPageTitle || '',
            ratingPageSubTitle: ratingPageSubTitle || '',
            fiveStarsRatingText: fiveStarsRatingText || '',
            fourStarsRatingText: fourStarsRatingText || '',
            threeStarsRatingText: threeStarsRatingText || '',
            twoStarsRatingText: twoStarsRatingText || '',
            oneStarsRatingText: oneStarsRatingText || '',
            photoVideoPageTitle: photoVideoPageTitle || '',
            photoVideoPageSubTitle: photoVideoPageSubTitle || '',
            dragDropPhotoVideoText: dragDropPhotoVideoText || '',
            addPhotoVideoButtonText: addPhotoVideoButtonText || '',
            dragDropPhotoText: dragDropPhotoText || '',
            addPhotoButtonText: addPhotoButtonText || '',
            addReviewSameDiscountText: addReviewSameDiscountText || '',
            addReviewDifferentDiscountText: addReviewDifferentDiscountText || '',
            reviewTextPageTitle: reviewTextPageTitle || '',
            reviewTextPageSubTitle: reviewTextPageSubTitle || '',
            reviewTextPagePlaceholder: reviewTextPagePlaceholder || '',
            questionTitle: questionTitle || '',
            questionSubTitle: questionSubTitle || '',
            reviewFormTitle: reviewFormTitle || '',
            reviewFormSubTitle: reviewFormSubTitle || '',
            thankyouTitle: thankyouTitle || '',
            thankyouSubTitle: thankyouSubTitle || '',
            thankyouDiscountText: thankyouDiscountText || '',
            submitButtonTitle: submitButtonTitle || '',
            continueButtonTitle: continueButtonTitle || '',
        });

        setPlaceHolderLanguageData({
            ratingPageTitle: t('reviewFormSettings.ratingPageTitle'),
            ratingPageSubTitle: t('reviewFormSettings.ratingPageSubTitle'),
            fiveStarsRatingText: t('reviewFormSettings.fiveStarsRatingText'),
            fourStarsRatingText: t('reviewFormSettings.fourStarsRatingText'),
            threeStarsRatingText: t('reviewFormSettings.threeStarsRatingText'),
            twoStarsRatingText: t('reviewFormSettings.twoStarsRatingText'),
            oneStarsRatingText: t('reviewFormSettings.oneStarsRatingText'),
            photoVideoPageTitle: t('reviewFormSettings.photoVideoPageTitle'),
            photoVideoPageSubTitle: t('reviewFormSettings.photoVideoPageSubTitle'),
            dragDropPhotoVideoText: t('reviewFormSettings.dragDropPhotoVideoText'),
            addPhotoVideoButtonText: t('reviewFormSettings.addPhotoVideoButtonText'),
            dragDropPhotoText: t('reviewFormSettings.dragDropPhotoText'),
            addPhotoButtonText: t('reviewFormSettings.addPhotoButtonText'),
            addReviewSameDiscountText: t('reviewFormSettings.addReviewSameDiscountText'),
            addReviewDifferentDiscountText: t('reviewFormSettings.addReviewDifferentDiscountText'),
            reviewTextPageTitle: t('reviewFormSettings.reviewTextPageTitle'),
            reviewTextPageSubTitle: t('reviewFormSettings.reviewTextPageSubTitle'),
            reviewTextPagePlaceholder: t('reviewFormSettings.reviewTextPagePlaceholder'),
            questionTitle: t('reviewFormSettings.questionTitle'),
            questionSubTitle: t('reviewFormSettings.questionSubTitle'),
            reviewFormTitle: t('reviewFormSettings.reviewFormTitle'),
            reviewFormSubTitle: t('reviewFormSettings.reviewFormSubTitle'),

            thankyouTitle: t('reviewFormSettings.thankyouTitle'),
            thankyouSubTitle: t('reviewFormSettings.thankyouSubTitle'),
            thankyouDiscountText: t('reviewFormSettings.thankyouDiscountText'),

            submitButtonTitle: t('reviewFormSettings.submitButtonTitle'),
            continueButtonTitle: t('reviewFormSettings.continueButtonTitle'),
        });

    }, [i18n, i18n.language, currentLanguage]);


    const handleSelectChange = async (event) => {
        const eventKey = event.target.name;
        let eventVal = event.target.value;
        const updateData = {
            field: event.target.name,
            value: eventVal,
            shop: shopRecords.shop,
            actionType: "reviewFormSettings"
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
    };

    const handleInputBlur = async (e) => {
        const language = localStorage.getItem('i18nextLng');
        if (initialData[e.target.name] != e.target.value) {
            const updateData = {
                field: e.target.name,
                value: e.target.value,
                shop: shopRecords.shop,
                language: language,
                actionType: "reviewFormSettingsLanguageContent"
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

        if (eventKey == 'ratingPageTitle') {
            setRatingPageTitle(eventVal);
        } else if (eventKey == 'ratingPageSubTitle') {
            setRatingPageSubTitle(eventVal);
        } else if (eventKey == 'fiveStarsRatingText') {
            setFiveStarsRatingText(eventVal);
        } else if (eventKey == 'fourStarsRatingText') {
            setFourStarsRatingText(eventVal);
        } else if (eventKey == 'threeStarsRatingText') {
            setThreeStarsRatingText(eventVal);
        } else if (eventKey == 'twoStarsRatingText') {
            setTwoStarsRatingText(eventVal);
        } else if (eventKey == 'oneStarsRatingText') {
            setOneStarsRatingText(eventVal);
        } else if (eventKey == 'photoVideoPageTitle') {
            setPhotoVideoPageTitle(eventVal);
        } else if (eventKey == 'photoVideoPageSubTitle') {
            setPhotoVideoPageSubTitle(eventVal);
        } else if (eventKey == 'dragDropPhotoVideoText') {
            setDragDropPhotoVideoText(eventVal);
        } else if (eventKey == 'addPhotoVideoButtonText') {
            setAddPhotoVideoButtonText(eventVal);
        } else if (eventKey == 'dragDropPhotoText') {
            setDragDropPhotoText(eventVal);
        } else if (eventKey == 'addPhotoButtonText') {
            setAddPhotoButtonText(eventVal);
        } else if (eventKey == 'addReviewSameDiscountText') {
            setAddReviewSameDiscountText(eventVal);
        } else if (eventKey == 'addReviewDifferentDiscountText') {
            setAddReviewDifferentDiscountText(eventVal);
        } else if (eventKey == 'reviewTextPageTitle') {
            setReviewTextPageTitle(eventVal);
        } else if (eventKey == 'reviewTextPageSubTitle') {
            setReviewTextPageSubTitle(eventVal);
        } else if (eventKey == 'reviewTextPagePlaceholder') {
            setReviewTextPagePlaceholder(eventVal);
        } else if (eventKey == 'questionTitle') {
            setQuestionTitle(eventVal);
        } else if (eventKey == 'questionSubTitle') {
            setQuestionSubTitle(eventVal);
        } else if (eventKey == 'reviewFormTitle') {
            setReviewFormTitle(eventVal);
        } else if (eventKey == 'reviewFormSubTitle') {
            setReviewFormSubTitle(eventVal);
        } else if (eventKey == 'thankyouTitle') {
            setThankyouTitle(eventVal);
        } else if (eventKey == 'thankyouSubTitle') {
            setThankyouSubTitle(eventVal);
        } else if (eventKey == 'thankyouDiscountText') {
            setThankyouDiscountText(eventVal);
        } else if (eventKey == 'submitButtonTitle') {
            setSubmitButtonTitle(eventVal);
        } else if (eventKey == 'continueButtonTitle') {
            setContinueButtonTitle(eventVal);
        }

    };

    const backToReviewsPage = (e) => {
        e.preventDefault();
        navigate('/app/review');
    }

    const crumbs = [
        { title: "Review", "link": "./../review" },
        { title: "Collect review", "link": "./../review" },
        { title: "Review form", "link": "" },
    ];

    return (
        <>
            <Breadcrumb crumbs={crumbs} />
            <Page fullWidth>
                <div className='pagetitle'>
                    <div className='pagebackbtn flxflexi'>
                        <a href="#" onClick={backToReviewsPage}><i className='twenty-arrow-left'></i>Collect reviews</a>
                    </div>
                    <div className='flxfix'>
                        {generalSettingsModel && generalSettingsModel.multilingual_support &&
                            <LanguageSelector className="inlinerow m-0" />
                        }
                    </div>
                </div>

                <div className="pagebox">
                    <div className="graywrapbox gapy24 mt-24">
                        <div className="subtitlebox">
                            <h2>Review Widget</h2>
                            <p>Collect and display product reviews on your product pages.</p>
                        </div>
                        <div className='flxfix'>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className='customize_wrap'>
                                        <div className="whitebox p-0">
                                            <div className='custwidtitle'>
                                                <h3>Appearance</h3>
                                            </div>
                                            <div className='insidewhitecard'>
                                                <div className='widget-theme-options'>
                                                    <div className="form-group m-0 horizontal-form">
                                                        <label htmlFor="">Theme color</label>
                                                        <div className='sideinput mw300 flxflexi'>
                                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="reviewFormSettings" pickerType="themeColor" />
                                                        </div>
                                                    </div>

                                                    <div className="form-group m-0 horizontal-form">
                                                        <label htmlFor="">Theme text color</label>
                                                        <div className='sideinput mw300 flxflexi'>
                                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="reviewFormSettings" pickerType="themeTextColor" />
                                                        </div>
                                                    </div>

                                                    <div className="form-group m-0 horizontal-form alightop">
                                                        <label htmlFor="">Corner Radius</label>
                                                        <div className='sideinput mw300 flxflexi'>
                                                            <select name="cornerRadius" onChange={handleSelectChange} value={documentObj?.cornerRadius} className='input_text'>
                                                                <option value="0">Sharp</option>
                                                                <option value="4">Slightly Rounded</option>
                                                                <option value="8">Rounded</option>
                                                                <option value="16">Extra Rounded</option>
                                                            </select>
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
                                                    <label htmlFor="">Rating page title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="ratingPageTitle" value={ratingPageTitle} placeholder={placeHolderLanguageData.ratingPageTitle} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor="">Rating page sub title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="ratingPageSubTitle" value={ratingPageSubTitle} placeholder={placeHolderLanguageData.ratingPageSubTitle} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor="">1 star rating text </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="oneStarsRatingText" value={oneStarsRatingText} placeholder={placeHolderLanguageData.oneStarsRatingText} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor="">2 star rating text </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="twoStarsRatingText" value={twoStarsRatingText} placeholder={placeHolderLanguageData.twoStarsRatingText} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor="">3 star rating text </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="threeStarsRatingText" value={threeStarsRatingText} placeholder={placeHolderLanguageData.threeStarsRatingText} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor="">4 star rating text </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="fourStarsRatingText" value={fourStarsRatingText} placeholder={placeHolderLanguageData.fourStarsRatingText} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor="">5 star rating text </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="fiveStarsRatingText" value={fiveStarsRatingText} placeholder={placeHolderLanguageData.fiveStarsRatingText} />
                                                    </div>
                                                </div>
                                            </div>


                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor="">Photo/video page title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="photoVideoPageTitle" value={photoVideoPageTitle} placeholder={placeHolderLanguageData.photoVideoPageTitle} />
                                                    </div>
                                                </div>
                                            </div>


                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor="">Photo/video page sub title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="photoVideoPageSubTitle" value={photoVideoPageSubTitle} placeholder={placeHolderLanguageData.photoVideoPageSubTitle} />
                                                    </div>
                                                </div>
                                            </div>

                                            {generalSettingsModel.is_enabled_video_review == true ?
                                                <>
                                                    <div className='insidewhitecard flxcol gapy18'>
                                                        <div className="form-group m-0">
                                                            <label htmlFor="">Drag & Drop photos/videos text (Plural)</label>
                                                            <div className='sideinput flxflexi'>
                                                                <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="dragDropPhotoVideoText" value={dragDropPhotoVideoText} placeholder={placeHolderLanguageData.dragDropPhotoVideoText} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className='insidewhitecard flxcol gapy18'>
                                                        <div className="form-group m-0">
                                                            <label htmlFor="">Add photos/videos button text (Plural) </label>
                                                            <div className='sideinput flxflexi'>
                                                                <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="addPhotoVideoButtonText" value={addPhotoVideoButtonText} placeholder={placeHolderLanguageData.addPhotoVideoButtonText} />
                                                            </div>
                                                        </div>
                                                    </div></>
                                                :
                                                <>
                                                    <div className='insidewhitecard flxcol gapy18'>
                                                        <div className="form-group m-0">
                                                            <label htmlFor="">Drag & Drop photos (Plural)</label>
                                                            <div className='sideinput flxflexi'>
                                                                <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="dragDropPhotoText" value={dragDropPhotoText} placeholder={placeHolderLanguageData.dragDropPhotoText} />
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className='insidewhitecard flxcol gapy18'>
                                                        <div className="form-group m-0">
                                                            <label htmlFor="">Add photos button text (Plural)                                                    </label>
                                                            <div className='sideinput flxflexi'>
                                                                <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="addPhotoButtonText" value={addPhotoButtonText} placeholder={placeHolderLanguageData.addPhotoButtonText} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>

                                            }


                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Same discount text </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="addReviewSameDiscountText" value={addReviewSameDiscountText} placeholder={placeHolderLanguageData.addReviewSameDiscountText} />
                                                    </div>
                                                    <div className='inputnote'>Note: Use [discount] for discount amount</div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Different discount text </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="addReviewDifferentDiscountText" value={addReviewDifferentDiscountText} placeholder={placeHolderLanguageData.addReviewDifferentDiscountText} />
                                                    </div>
                                                    <div className='inputnote'>Note: Use [photo_discount] & [video_discount] for photo and video review discount amount</div>

                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Question page title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="questionTitle" value={questionTitle} placeholder={placeHolderLanguageData.questionTitle} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Question page sub title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="questionSubTitle" value={questionSubTitle} placeholder={placeHolderLanguageData.questionSubTitle} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Review text page title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="reviewTextPageTitle" value={reviewTextPageTitle} placeholder={placeHolderLanguageData.reviewTextPageTitle} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Review text page sub title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="reviewTextPageSubTitle" value={reviewTextPageSubTitle} placeholder={placeHolderLanguageData.reviewTextPageSubTitle} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Review text page placeholder </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="reviewTextPagePlaceholder" value={reviewTextPagePlaceholder} placeholder={placeHolderLanguageData.reviewTextPagePlaceholder} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Review form title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="reviewFormTitle" value={reviewFormTitle} placeholder={placeHolderLanguageData.reviewFormTitle} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Review form sub title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="reviewFormSubTitle" value={reviewFormSubTitle} placeholder={placeHolderLanguageData.reviewFormSubTitle} />
                                                    </div>
                                                </div>
                                            </div>


                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Thank you page title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="thankyouTitle" value={thankyouTitle} placeholder={placeHolderLanguageData.thankyouTitle} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Thank you page sub title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="thankyouSubTitle" value={thankyouSubTitle} placeholder={placeHolderLanguageData.thankyouSubTitle} />
                                                    </div>
                                                </div>
                                            </div>


                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Thank you page discount text</label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="thankyouDiscountText" value={thankyouDiscountText} placeholder={placeHolderLanguageData.thankyouDiscountText} />
                                                    </div>
                                                    <div className='inputnote'>Note: Use [discount] for discount amount</div>

                                                </div>
                                            </div>


                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Submit button title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="submitButtonTitle" value={submitButtonTitle} placeholder={placeHolderLanguageData.submitButtonTitle} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='insidewhitecard flxcol gapy18'>
                                                <div className="form-group m-0">
                                                    <label htmlFor=""> Continue button title </label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="continueButtonTitle" value={continueButtonTitle} placeholder={placeHolderLanguageData.continueButtonTitle} />
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

            </Page>

        </>

    );
}