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
import ColorPicker from "./../settings/ColorPicker";

const ProductReviewWidget = ({ shopRecords, customizeObj }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [documentObj, setDocumentObj] = useState(customizeObj);

    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
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
            <div className="row">
                <div className="col-lg-12">
                    <div className="whitebox flxcol">
                        <div className='custom-email-options'>
                            <div className="form-group m-0 horizontal-form">
                                <div className='sideinput mw300 flxflexi'>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Widget colors</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <div>
                                                <label>
                                                    <input
                                                        type="radio"
                                                        value="black"
                                                        checked={selectedOption === 'black'}
                                                        onChange={handleOptionChange}
                                                    />
                                                    Black text (best over light backgrounds)
                                                </label>

                                                <label>
                                                    <input
                                                        type="radio"
                                                        value="white"
                                                        checked={selectedOption === 'white'}
                                                        onChange={handleOptionChange}
                                                    />
                                                    White text (best over dark backgrounds)

                                                </label>

                                                <label>
                                                    <input
                                                        type="radio"
                                                        value="custom"
                                                        checked={selectedOption === 'custom'}
                                                        onChange={handleOptionChange}
                                                    />
                                                    Custom
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                    <div className='custom-widget-options'>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Header text color</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="headerTextColor" />

                                            </div>
                                        </div>
                                    </div>

                                    <div className='custom-widget-options'>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button border color</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonBorderColor" />

                                            </div>
                                        </div>
                                    </div>

                                    <div className='custom-widget-options'>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button title color</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default ProductReviewWidget;
