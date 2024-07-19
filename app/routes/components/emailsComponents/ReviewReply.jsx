import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ImageUploadMultiLang from '../settings/ImageUploadMultiLang';
import AlertInfo from '../AlertInfo';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import settingsJson from './../../../utils/settings.json';
import { getDefaultProductImage, getUploadDocument } from './../../../utils/documentPath';
import SampleReviewReplyEmail from './../email/SampleReviewReplyEmail';

const ReviewReply = ({ shopRecords, emailTemplateObj }) => {
    const { t, i18n } = useTranslation();
    const bannerType = "reviewReply";
    const [emailTemplateObjState, setEmailTemplateObjState] = useState(emailTemplateObj);
    const [languageWiseEmailTemplate, setLanguageWiseEmailTemplate] = useState({});
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
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
        console.log(emailTemplateInfo);
        const { subject, body } = emailTemplateInfo;
        setLanguageWiseEmailTemplate(emailTemplateInfo);

        setSubject(subject || '');
        setBody(body || '');


        setInitialData({
            subject: subject || '',
            body: body || '',
        });

        setPlaceHolderLanguageData({
            subject: t('reviewReplyEmail.subject'),
            body: t('reviewReplyEmail.body'),
        });

    }, [i18n, i18n.language, emailTemplateObjState, currentLanguage]);


    const changeSubject = (e) => {
        setSubject(e.target.value);
    };

    const changeBody = (event) => {
        setBody(event.target.value);
    };

    const handleInputBlur = async (e) => {
        const language = localStorage.getItem('i18nextLng');
        if (initialData[e.target.name] != e.target.value) {
            const updateData = {
                field: e.target.name,
                value: e.target.value,
                shop: shopRecords.shop,
                language: language,
                actionType: "reviewReply"
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
                toast.success(data.message, { autoClose: settingsJson.toasterCloseTime });

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


    const viewSample = (e) => {
        e.preventDefault();
        // var dynamicBody = t('reviewReplyEmail.body').replace('[name]', settingsJson.defaultViewSampleEmailName);

        const sampleEmailData = {
            body: body ? body : t('reviewReplyEmail.body'),
            banner: getUploadDocument(languageWiseEmailTemplate.banner, 'banners'),
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
                                        <div><strong>Note:</strong> Use [product] for the product name</div>
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
                                <div className='inputnote'>
                                    <div><strong>Note:</strong> Use [reply_content] for your reply text</div>
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
                    <SampleReviewReplyEmail shopRecords={shopRecords} emailContents={emailContents} />

                </Modal.Body>
            </Modal>
        </>
    );
};

export default ReviewReply;
