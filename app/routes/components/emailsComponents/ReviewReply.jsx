import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
const ReviewRequest = ({ shopRecords, emailTemplateObj }) => {
    const { t, i18n } = useTranslation();

    const [emailTemplateObjState, setEmailTemplateObjState] = useState(emailTemplateObj);
    const [currentLanguage, setCurrentLanguage] = useState();
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [initialData, setInitialData] = useState({});
    const [placeHolderLanguageData, setPlaceHolderLanguageData] = useState({});


    useEffect(() => {
        const language = localStorage.getItem('i18nextLng');
        setCurrentLanguage(language);


        const { subject, body } = (emailTemplateObjState && emailTemplateObjState[currentLanguage]) ? emailTemplateObjState[currentLanguage] : {};
        setSubject(subject || '');
        setBody(body || '');

        setInitialData({
            subject: subject || '',
            body: body || ''
        });

        setPlaceHolderLanguageData({
            bannerPath: t('reviewRequestEmail.bannerPath'),
            subject: t('reviewRequestEmail.subject'),
            body: t('reviewRequestEmail.body'),
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


    return (
        <>
            <div className="filterandserchwrap">
                <form >
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="form-group">
                                <img src={placeHolderLanguageData.bannerPath} />
                            </div>
                        </div>

                        <div className="col-lg-6">
                            <div className="form-group">

                                <label htmlFor="">Subject </label>
                                <input type="text" onBlur={handleInputBlur} name="subject" value={subject} onChange={changeSubject} className="input_text" placeholder={placeHolderLanguageData.subject} />
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-lg-6">
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
                            </div>
                        </div>

                        <div className="col-lg-12">
                            <div className="btnbox">
                                <input type="submit" value="Search" className="revbtn" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ReviewRequest;
