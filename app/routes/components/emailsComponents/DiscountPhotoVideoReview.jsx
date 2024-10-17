import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ImageUploadMultiLang from '../settings/ImageUploadMultiLang';
import InformationAlert from './../common/information-alert';
import { useNavigate } from 'react-router-dom';
import { Modal, TitleBar } from '@shopify/app-bridge-react';
import { Box } from "@shopify/polaris";
import settingsJson from './../../../utils/settings.json';
import { getUploadDocument } from './../../../utils/documentPath';
import SampleDiscountPhotoVideoReviewEmail from './../email/SampleDiscountPhotoVideoReviewEmail';

const DiscountPhotoVideoReview = ({ shopRecords, emailTemplateObj, generalAppearances, generalSettingsModel }) => {
    const { t, i18n } = useTranslation();
    const bannerType = "discountPhotoVideoReview";
    const [emailTemplateObjState, setEmailTemplateObjState] = useState(emailTemplateObj);
    const [languageWiseEmailTemplate, setLanguageWiseEmailTemplate] = useState({});
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [initialData, setInitialData] = useState({});
    const [placeHolderLanguageData, setPlaceHolderLanguageData] = useState({});
    const [emailContents, setEmailContents] = useState({});

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
            subject: t('dicountPhotoVideoReviewEmail.subject'),
            body: t('dicountPhotoVideoReviewEmail.body'),
            buttonText: t('dicountPhotoVideoReviewEmail.buttonText'),
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
                actionType: "discountPhotoVideoReview"
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
            body: body ? body : t('dicountPhotoVideoReviewEmail.body'),
            buttonText: buttonText ? buttonText : t('dicountPhotoVideoReviewEmail.buttonText'),
            banner: getUploadDocument(languageWiseEmailTemplate.banner, shopRecords.shop_id, 'banners'),
            footerContent: footerContent,
            email_footer_enabled: generalSettingsModel.email_footer_enabled
        }
        setEmailContents(sampleEmailData);
        setShowViewSampleModal(true);
    }


    const showBrandingPage = (e) => {
        e.preventDefault();
        navigate('/app/branding');
    }
    const alertContent = (
        <>
            You can upload a default banner to all emails in the <a href="#" onClick={showBrandingPage}>Branding Setting</a>
        </>
    );

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
                                            <InformationAlert alertType="email_appearance_banner" pageSlug="/app/branding" alertKey="email_review_discount_customize" alertClose />

                                        )}

                                        <InformationAlert alertType="email_appearance" pageSlug="/app/branding" alertKey="" />

                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="form-group">
                                    <label htmlFor="">Subject </label>
                                    <input type="text" onBlur={handleInputBlur} name="subject" value={subject} onChange={changeSubject} className="input_text" placeholder={placeHolderLanguageData.subject} />
                                    <div className='inputnote'>
                                        <div><strong>Note:</strong></div>
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
                                    <div className='inputnote'>
                                        <div><strong>Notes:</strong></div>
                                        <div>Use [store] for your store name</div>
                                        <div>Use [discount] for the discount amount</div>
                                    </div>
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
                        <SampleDiscountPhotoVideoReviewEmail emailContents={emailContents} generalAppearancesObj={generalAppearances} />
                    </Box>
                </Modal>
            )}
        </>
    );
};

export default DiscountPhotoVideoReview;
