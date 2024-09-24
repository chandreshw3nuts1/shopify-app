import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ImageUploadMultiLang from '../settings/ImageUploadMultiLang';
import InformationAlert from './../common/information-alert';

import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import settingsJson from './../../../utils/settings.json';
import { getDefaultProductImage, getUploadDocument } from './../../../utils/documentPath';
import SampleReviewRequestEmail from './../email/SampleReviewRequestEmail';

const ReviewRequestReminder = ({ shopRecords, emailTemplateObj, generalAppearances, generalSettingsModel }) => {
    const { t, i18n } = useTranslation();
    const bannerType = "reviewRequestReminder";
    const [emailTemplateObjState, setEmailTemplateObjState] = useState(emailTemplateObj);
    const [languageWiseEmailTemplate, setLanguageWiseEmailTemplate] = useState({});
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [initialData, setInitialData] = useState({});
    const [placeHolderLanguageData, setPlaceHolderLanguageData] = useState({});
    const [emailContents, setEmailContents] = useState({});
    const [isEnabled, setIsEnabled] = useState(emailTemplateObj?.isEnabled);

    const [showViewSampleModal, setShowViewSampleModal] = useState(false);
    const handleCloseViewSampleModal = () => setShowViewSampleModal(false);

    const navigate = useNavigate();


    useEffect(() => {
        const language = localStorage.getItem('i18nextLng');
        setCurrentLanguage(language);

        const emailTemplateInfo = (emailTemplateObjState && emailTemplateObjState[currentLanguage]) ? emailTemplateObjState[currentLanguage] : {};
        const { subject, body, buttonText } = emailTemplateInfo;
        setLanguageWiseEmailTemplate(emailTemplateInfo);

        setSubject(subject || '');
        setBody(body || '');
        setButtonText(buttonText || '');


        setInitialData({
            subject: subject || '',
            body: body || '',
            buttonText: buttonText || ''
        });

        setPlaceHolderLanguageData({
            subject: t('reviewRequestReminderEmail.subject'),
            body: t('reviewRequestReminderEmail.body'),
            buttonText: t('reviewRequestReminderEmail.buttonText'),
        });

    }, [i18n, i18n.language, emailTemplateObjState, currentLanguage]);

    // useEffect(() => {

    // }, [emailTemplateObjState, currentLanguage]);


    const changeSubject = (e) => {
        setSubject(e.target.value);
    };

    const changeBody = (event) => {
        setBody(event.target.value);
    };

    const changeButtonText = (event) => {
        setButtonText(event.target.value);
    };

    const handleInputBlur = async (e) => {
        const language = localStorage.getItem('i18nextLng');
        if (initialData[e.target.name] != e.target.value) {
            const updateData = {
                field: e.target.name,
                value: e.target.value,
                shop: shopRecords.shop,
                language: language,
                actionType: "reviewRequestReminder"
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
            body: body ? body : t('reviewRequestReminderEmail.body'),
            buttonText: buttonText ? buttonText : t('reviewRequestReminderEmail.buttonText'),
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
        if (eventKey == 'isEnabled') {
            eventVal = !isEnabled;
        }

        const updateData = {
            field: event.target.name,
            value: eventVal,
            shop: shopRecords.shop,
            actionType: "reviewRequestReminder"
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
        if (eventKey == 'isEnabled') {
            setIsEnabled(!isEnabled);
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
                                            <InformationAlert alertType="email_appearance_banner" pageSlug="/app/branding" alertKey="email_review_request_reminder_customize" alertClose />

                                        )}

                                        <InformationAlert alertType="email_appearance" pageSlug="/app/branding" alertKey="" />

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7">

                                <div className="form-group  horizontal-form">
                                    <div className='sideinput mw300 flxflexi'>
                                        <div className="form-check form-switch">
                                            <input
                                                checked={
                                                    isEnabled
                                                }
                                                onChange={
                                                    handleSelectChange
                                                }
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                name="isEnabled"
                                            />
                                            <label htmlFor="" className='p-0'>Send reminders</label>

                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="">Subject </label>
                                    <input type="text" onBlur={handleInputBlur} name="subject" value={subject} onChange={changeSubject} className="input_text" placeholder={placeHolderLanguageData.subject} />
                                    <div className='inputnote'>
                                        <div><strong>Notes:</strong></div>
                                        <div>Use [order_number] for the customer's order number</div>
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
            <Modal show={showViewSampleModal} className='reviewimagepopup' onHide={handleCloseViewSampleModal} size="lg" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Sample email</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SampleReviewRequestEmail emailContents={emailContents} generalAppearancesObj={generalAppearances} />

                </Modal.Body>
            </Modal>
        </>
    );
};

export default ReviewRequestReminder;
