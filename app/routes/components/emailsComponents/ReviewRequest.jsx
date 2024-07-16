import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ImageUploadMultiLang from '../settings/ImageUploadMultiLang';
import AlertInfo from '../AlertInfo';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import settingsJson from './../../../utils/settings.json';
import { getDefaultProductImage, getUploadDocument } from './../../../utils/documentPath';
import SampleReviewRequestEmail from './../email/SampleReviewRequestEmail';

const ReviewRequest = ({ shopRecords, emailTemplateObj }) => {
    const { t, i18n } = useTranslation();
    const bannerType = "reviewRequest";
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
            subject: t('reviewRequestEmail.subject'),
            body: t('reviewRequestEmail.body'),
            buttonText: t('reviewRequestEmail.buttonText'),
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
                actionType: "reviewRequest"
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
                toast.success(data.message);

                setEmailTemplateObjState({
                    ...emailTemplateObjState,
                    [currentLanguage]: {
                        ...emailTemplateObjState[currentLanguage],
                        [e.target.name]: e.target.value
                    }
                });

            } else {
                toast.error(data.message);
            }
        }


    };

    const sendReviewRequestEmail = async (e) => {
        const language = localStorage.getItem('i18nextLng');
        const updateData = {
            shop: shopRecords.shop,
            language: language,
            actionType: "sendReviewRequestEmail"
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
            toast.success(data.message);

        } else {
            toast.error(data.message);
        }

    };

    const viewSample = (e) => {
        e.preventDefault();

        const dynamicBody = t('reviewRequestEmail.body').replace('[name]', settingsJson.defaultViewSampleEmailName);
        const sampleEmailData = {
            body: body ? body : dynamicBody,
            buttonText: buttonText ? buttonText : t('reviewRequestEmail.buttonText'),
            banner : getUploadDocument(languageWiseEmailTemplate.banner, 'banners'),
            getDefaultProductImage: getDefaultProductImage(),
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
                                        <div className='banneruploadimg'>
                                            <ImageUploadMultiLang className="emailbannerimage" bannerType={bannerType} shopRecords={shopRecords} currentLanguage={currentLanguage} languageWiseEmailTemplate={languageWiseEmailTemplate} emailTemplateObjState={emailTemplateObjState} setEmailTemplateObjState={setEmailTemplateObjState} hasEdit />
                                        </div>
                                        <AlertInfo colorTheme="primarybox" alertContent={alertContent} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7">
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
                                <div className='sentrowbanner flxrow'>
                                    <p>Send review request to your self</p>
                                    <button type='button' onClick={sendReviewRequestEmail} className='revbtn smbtn'>Sent</button>
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
                    <SampleReviewRequestEmail shopRecords={shopRecords} emailContents={emailContents} />

                </Modal.Body>
            </Modal>
        </>
    );
};

export default ReviewRequest;
