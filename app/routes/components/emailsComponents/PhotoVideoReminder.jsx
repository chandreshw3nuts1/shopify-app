import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ImageUploadMultiLang from '../settings/ImageUploadMultiLang';
import InformationAlert from './../common/information-alert';

import { useNavigate } from 'react-router-dom';
import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { Box } from "@shopify/polaris";
import settingsJson from './../../../utils/settings.json';
import { getDefaultProductImage, getUploadDocument } from './../../../utils/documentPath';
import SampleReviewRequestEmail from './../email/SampleReviewRequestEmail';

const PhotoVideoReminder = ({ shopRecords, emailTemplateObj, generalAppearances, generalSettingsModel }) => {
    const { t, i18n } = useTranslation();
    const bannerType = "photoVideoReminder";
    const [emailTemplateObjState, setEmailTemplateObjState] = useState(emailTemplateObj);
    const [languageWiseEmailTemplate, setLanguageWiseEmailTemplate] = useState({});
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [discountText, setDiscountText] = useState('');

    const [initialData, setInitialData] = useState({});
    const [placeHolderLanguageData, setPlaceHolderLanguageData] = useState({});
    const [emailContents, setEmailContents] = useState({});
    const [sendReminderTo, setSendReminderTo] = useState(emailTemplateObj?.sendReminderTo);

    const [showViewSampleModal, setShowViewSampleModal] = useState(false);
    const handleCloseViewSampleModal = () => setShowViewSampleModal(false);

    const navigate = useNavigate();


    useEffect(() => {
        const language = localStorage.getItem('i18nextLng');
        setCurrentLanguage(language);

        const emailTemplateInfo = (emailTemplateObjState && emailTemplateObjState[currentLanguage]) ? emailTemplateObjState[currentLanguage] : {};
        const { subject, body, discountText, buttonText } = emailTemplateInfo;
        setLanguageWiseEmailTemplate(emailTemplateInfo);

        setSubject(subject || '');
        setBody(body || '');
        setButtonText(buttonText || '');
        setDiscountText(discountText || '');


        setInitialData({
            subject: subject || '',
            body: body || '',
            buttonText: buttonText || '',
            discountText: discountText || ''
        });

        setPlaceHolderLanguageData({
            subject: t('photoVideoReminderEmail.subject'),
            body: t('photoVideoReminderEmail.body'),
            discountText: t('photoVideoReminderEmail.discountText'),
            buttonText: t('photoVideoReminderEmail.buttonText'),
        });

    }, [i18n, i18n.language, emailTemplateObjState, currentLanguage]);


    const changeSubject = (e) => {
        setSubject(e.target.value);
    };

    const changeBody = (event) => {
        setBody(event.target.value);
    };
    const changeDiscountText = (event) => {
        setDiscountText(event.target.value);
    };
    const changeButtonText = (event) => {
        setButtonText(event.target.value);
    };

    const handleInputBlur = async (e) => {
        const language = localStorage.getItem('i18nextLng');
        console.log(initialData);
        console.log(e.target.value);
        if (initialData[e.target.name] != e.target.value) {
            const updateData = {
                field: e.target.name,
                value: e.target.value,
                shop: shopRecords.shop,
                language: language,
                actionType: "photoVideoReminder"
            };
            const response = await fetch('/api/email-settings', {
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
                setEmailTemplateObjState(prevState => ({
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

    const viewSample = (e) => {
        e.preventDefault();
        var footerContent = "";
        if (generalSettingsModel.email_footer_enabled) {
            footerContent = generalSettingsModel[currentLanguage] ? generalSettingsModel[currentLanguage].footerText : "";
        }
        const sampleEmailData = {
            logo: getUploadDocument(generalAppearances?.logo, shopRecords.shop_id, 'logo'),
            body: body ? body : t('photoVideoReminderEmail.body'),
            buttonText: buttonText ? buttonText : t('photoVideoReminderEmail.buttonText'),
            discountText: discountText ? discountText : t('photoVideoReminderEmail.discountText'),
            banner: getUploadDocument(languageWiseEmailTemplate.banner, shopRecords.shop_id, 'banners'),
            getDefaultProductImage: getDefaultProductImage(),
            footerContent: footerContent,
            email_footer_enabled: generalSettingsModel.email_footer_enabled
        }
        setEmailContents(sampleEmailData);
        setShowViewSampleModal(true);
    }


    const handleSelectChange = async (event) => {
        const eventKey = event.target.name;
        let eventVal = event.target.value;

        const updateData = {
            field: event.target.name,
            value: eventVal,
            shop: shopRecords.shop,
            actionType: "photoVideoReminder"
        };
        const response = await fetch('/api/email-settings', {
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
        if (eventKey == 'sendReminderTo') {
            setSendReminderTo(eventVal);
        }
    };

    const showBrandingPage = (e) => {
        e.preventDefault();
        navigate('/app/branding');
    }

    return (
        <>
            <div className='graywrapbox mt-24 max1048'>
                <div className="reviewrequestdefault">
                    <form>
                        <div className="row">
                            <div className="col-lg-5">
                                <div className="form-group">
                                    <label htmlFor="">Banner</label>
                                    <div className='bannerverticalwrap'>
                                        {generalAppearances.enabledEmailBanner == true ? (
                                            <div className='banneruploadimg'>
                                                <ImageUploadMultiLang className="emailbannerimage" bannerType={bannerType} shopRecords={shopRecords} currentLanguage={currentLanguage} languageWiseEmailTemplate={languageWiseEmailTemplate} emailTemplateObjState={emailTemplateObjState} setEmailTemplateObjState={setEmailTemplateObjState} hasEdit />
                                            </div>
                                        ) : (
                                            <InformationAlert alertType="email_appearance_banner" pageSlug="/app/branding" alertKey="email_photo_video_customize" alertClose />

                                        )}

                                        <InformationAlert alertType="email_appearance" pageSlug="/app/branding" alertKey="" />

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="form-group">
                                    <label htmlFor="">Send photo/video reminder </label>
                                    <select name="sendReminderTo" onChange={handleSelectChange} value={sendReminderTo} className='input_text'>
                                        <option value="all">For all reviews </option>
                                        <option value="star_2">For reviews with 2 stars and up</option>
                                        <option value="star_3">For reviews with 3 stars and up</option>
                                        <option value="star_4">For reviews with 4 stars and up</option>
                                        <option value="star_5">For 5-star reviews only</option>
                                        <option value="never">Never</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="">Subject </label>
                                    <input type="text" onBlur={handleInputBlur} name="subject" value={subject} onChange={changeSubject} className="input_text" placeholder={placeHolderLanguageData.subject} />
                                    <div className='inputnote'>
                                        <div><strong>Notes:</strong></div>
                                        <div>Use [product] for the product name</div>
                                        <div>Use [name] or [last_name] as a placeholder for the user's first or last name</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Body</label>
                                    <textarea
                                        onChange={changeBody}
                                        className="form-control"
                                        name="body"
                                        onBlur={handleInputBlur}
                                        placeholder={placeHolderLanguageData.body}
                                        value={body}
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Discount text</label>
                                    <input type="text" onBlur={handleInputBlur} name="discountText" value={discountText} onChange={changeDiscountText} className="input_text" placeholder={placeHolderLanguageData.discountText} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Button Text</label>
                                    <input type="text" onBlur={handleInputBlur} name="buttonText" value={buttonText} onChange={changeButtonText} className="input_text" placeholder={placeHolderLanguageData.buttonText} />
                                </div>

                                <div className="btnwrap">
                                    <a href="#" onClick={viewSample} className='revbtn'>View sample</a>
                                    <a href="#" onClick={showBrandingPage} className='revbtn outline'>Customize email appearance</a>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {showViewSampleModal && (
                <Modal
                    variant="large"
                    open={showViewSampleModal}
                    onHide={handleCloseViewSampleModal}
                >
                    <TitleBar title="Sample email">
                        <button onClick={handleCloseViewSampleModal}>Close</button>
                    </TitleBar>
                    <Box padding="500">
                        <SampleReviewRequestEmail emailContents={emailContents} generalAppearancesObj={generalAppearances} />
                    </Box>
                </Modal>
            )}
        </>
    );
};

export default PhotoVideoReminder;
