import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import SingleImageUpload from '../settings/ImageUpload';
const ReviewRequest = ({ shopRecords, emailReviewRequest }) => {
    const { t, i18n } = useTranslation();

    const [emailRequestData, setEmailRequestData] = useState(emailReviewRequest);
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [initialData, setInitialData] = useState({});
    useEffect(() => {
        console.log('-------------here---------');
        const language = localStorage.getItem('i18nextLng');
        setCurrentLanguage(language);
    }, [i18n, i18n.language]);

    useEffect(() => {
        if (emailRequestData && emailRequestData[currentLanguage]) {
            const { subject, body, buttonText } = emailRequestData[currentLanguage];
            setSubject(subject || '');
            setBody(body || '');
            setButtonText(buttonText || '');
            setInitialData({
                subject: subject || '',
                body: body || '',
                buttonText: buttonText || ''
            });

        }
    }, [emailRequestData, currentLanguage]);

    console.log(emailRequestData);

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

                setEmailRequestData({
                    ...emailRequestData,
                    [currentLanguage]: {
                        ...emailRequestData[currentLanguage],
                        [e.target.name]: e.target.value
                    }
                });

            } else {
                toast.error(data.message);
            }
        }


    };


    return (
        <>
            <div className='graywrapbox mt-24 max1048'>
                <div className="reviewrequestdefault">
                    <form>
                        <div className="row">
                            <div className="col-lg-5">
                                <div className="form-group">
                                    <label htmlFor="">Banner</label>
                                    <SingleImageUpload className="emailbannerimage" hasEdit />
                                    {/* <img src={t('reviewRequestEmail.bannerPath')} /> */}
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="form-group">
                                    <label htmlFor="">Subject </label>
                                    <input type="text" onBlur={handleInputBlur} name="subject" value={subject} onChange={changeSubject} className="input_text" placeholder={t('reviewRequestEmail.subject')} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Body</label>
                                    <textarea
                                        onChange={changeBody}
                                        className="form-control"
                                        name="body"
                                        onBlur={handleInputBlur}
                                        placeholder={t('reviewRequestEmail.body')}
                                        value={body}
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="">Button Text</label>
                                    <input type="text" onBlur={handleInputBlur} name="buttonText" value={buttonText} onChange={changeButtonText} className="input_text" placeholder={t('reviewRequestEmail.buttonText')} />
                                </div>
                                <div className="btnbox">
                                    <input type="submit" value="Search" className="revbtn" />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ReviewRequest;
