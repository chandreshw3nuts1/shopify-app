import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import SingleImageUpload from '../settings/ImageUpload';
import AlertInfo from '../AlertInfo';

const ReviewRequest = ({ shopRecords, emailTemplateObj }) => {
    const { t, i18n } = useTranslation();

    const [emailTemplateObjState, setEmailTemplateObjState] = useState(emailTemplateObj);
    const [currentLanguage, setCurrentLanguage] = useState();
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [buttonText, setButtonText] = useState('');
    const [initialData, setInitialData] = useState({});
    const [placeHolderLanguageData, setPlaceHolderLanguageData] = useState({});


    useEffect(() => {
        const language = localStorage.getItem('i18nextLng');
        setCurrentLanguage(language);


        const { subject, body, buttonText } = (emailTemplateObjState && emailTemplateObjState[currentLanguage]) ? emailTemplateObjState[currentLanguage] : {};
        setSubject(subject || '');
        setBody(body || '');
        setButtonText(buttonText || '');
        setInitialData({
            subject: subject || '',
            body: body || '',
            buttonText: buttonText || ''
        });

        setPlaceHolderLanguageData({
            bannerPath: t('reviewRequestEmail.bannerPath'),
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


    const alertContent = `You can upload a default banner to all emails in the <a href="#">Branding Setting</a>`


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
                                            <SingleImageUpload className="emailbannerimage" hasEdit />
                                            {/* <img src={t('reviewRequestEmail.bannerPath')} /> */}
                                            <div className='inputnote'>You can upload an image in JPG, PNG, or GIF format up to 5 MB. Email banner will be displayed in 500px width, for best results, upload an image between 500-1200px wide</div>
                                        </div>
                                        <AlertInfo colorTheme="primarybox" alertContent={`${alertContent}`}  />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="form-group">
                                    <label htmlFor="">Subject </label>
                                    <input type="text" onBlur={handleInputBlur} name="subject" value={subject} onChange={changeSubject} className="input_text" placeholder={t('reviewRequestEmail.subject')} />
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
                                    <input type="text" onBlur={handleInputBlur} name="buttonText" value={buttonText} onChange={changeButtonText} className="input_text" placeholder={t('reviewRequestEmail.buttonText')} />
                                </div>
                                <div className='sentrowbanner flxrow'>
                                    <p>Send review request to your self</p>
                                    <button type='button' className='revbtn smbtn'>Sent</button>
                                </div>
                                <div className="btnwrap">
                                    <a href="#" className='revbtn'>View sample</a>
                                    <a href="#" className='revbtn outline'>Customize email appearance</a>
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
