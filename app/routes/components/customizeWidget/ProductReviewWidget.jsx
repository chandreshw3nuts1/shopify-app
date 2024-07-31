import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ImageUploadMultiLang from '../settings/ImageUploadMultiLang';
import AlertInfo from '../AlertInfo';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import settingsJson from './../../../utils/settings.json';
import { getDefaultProductImage, getUploadDocument } from './../../../utils/documentPath';
import ColorPicker from "./../settings/ColorPicker";
import GridLayoutIcon from '../icons/GridLayoutIcon';
import ListLayoutIcon from '../icons/ListLayoutIcon';
import CompactLayoutIcon from '../icons/CompactLayoutIcon';
import {
    Select,
} from '@shopify/polaris';

const ProductReviewWidget = ({ shopRecords, customizeObj }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [documentObj, setDocumentObj] = useState(customizeObj);
    const [selectedLayout, setSelectedLayout] = useState(customizeObj?.widgetLayout || "list");
    const [selectedWidgetColor, setSelectedWidgetColor] = useState(customizeObj?.widgetColor || "black");
    const [selectedReviewShadow, setSelectedReviewShadow] = useState('dark');

    const showBrandingPage = (e) => {
        e.preventDefault();
        navigate('/app/branding');
    }
    useEffect(() => {
        const language = localStorage.getItem('i18nextLng');
        setCurrentLanguage(language);
    });
    

    const handleSelectChange = async (event) => {
        const eventKey = event.target.name;
        const eventVal = event.target.value;

        const updateData = {
            field: event.target.name,
            value: eventVal,
            shop: shopRecords.shop,
            actionType: "productReviewCustomize"
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
            toast.success(data.message, { autoClose: settingsJson.toasterCloseTime });
        } else {
            toast.error(data.message);
        }
        if (eventKey == 'widgetLayout') {
            setSelectedLayout(eventVal);
        } else if (eventKey == 'widgetColor') {
            setSelectedWidgetColor(eventVal);
        } else if (eventKey == 'reviewShadow') {
            setSelectedReviewShadow(eventVal);
        }
    };


    return (
        <>
            <div className="row">
                <div className="col-lg-6">
                    <div className='customize_wrap'>
                        <div className="whitebox p-0">
                            <div className='custwidtitle'>
                                <h3>Widget layout</h3>
                            </div>
                            <div className='insidewhitecard'>
                                <div className="form-group m-0">
                                    <div className='layoutstr'>
                                        <div className='layoutbox'>
                                            <input
                                                type='radio'
                                                value="grid"
                                                name='widgetLayout'
                                                id='gridlayout'
                                                onChange={handleSelectChange}
                                                checked={selectedLayout === 'grid'}

                                            />
                                            <label htmlFor="gridlayout">
                                                <div className='iconbox'><GridLayoutIcon /></div>
                                                <span>Grid</span>
                                            </label>
                                        </div>
                                        <div className='layoutbox'>
                                            <input
                                                type='radio'
                                                value="list"
                                                name='widgetLayout'
                                                id='listlayout'
                                                onChange={handleSelectChange}
                                                checked={selectedLayout === 'list'}
                                            />
                                            <label htmlFor="listlayout">
                                                <div className='iconbox'><ListLayoutIcon /></div>
                                                <span>List</span>
                                            </label>
                                        </div>
                                        <div className='layoutbox'>
                                            <input
                                                type='radio'
                                                value="compact"
                                                name='widgetLayout'
                                                id='compactlayout'
                                                onChange={handleSelectChange}
                                                checked={selectedLayout === 'compact'}

                                            />
                                            <label htmlFor="compactlayout">
                                                <div className='iconbox'><CompactLayoutIcon /></div>
                                                <span>List(compact)</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="whitebox p-0">
                            <div className='custwidtitle'>
                                <h3>Widget colors</h3>
                            </div>
                            <div className='insidewhitecard'>
                                <div className="form-group m-0 horizontal-form">
                                    <div className='sideinput flxflexi'>
                                        <div className='radiogroup vertical'>
                                            <div className='radiobox'>
                                                <input
                                                    type="radio"
                                                    value="black"
                                                    name='widgetColor'
                                                    checked={selectedWidgetColor === 'black'}
                                                    onChange={handleSelectChange}
                                                    id='widcolorblacktext'
                                                />
                                                <label htmlFor='widcolorblacktext'>Black text (best over light backgrounds)</label>
                                            </div>
                                            <div className='radiobox'>
                                                <input
                                                    type="radio"
                                                    value="white"
                                                    name='widgetColor'
                                                    checked={selectedWidgetColor === 'white'}
                                                    onChange={handleSelectChange}
                                                    id='widcolorwhitetext'
                                                />
                                                <label htmlFor='widcolorwhitetext'>White text (best over dark backgrounds)</label>
                                            </div>
                                            <div className='radiobox'>
                                                <input
                                                    type="radio"
                                                    value="custom"
                                                    name='widgetColor'
                                                    checked={selectedWidgetColor === 'custom'}
                                                    onChange={handleSelectChange}
                                                    id='widcolorcustom'
                                                />
                                                <label htmlFor='widcolorcustom'>Custom</label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {selectedWidgetColor == "custom" &&
                            <div className="whitebox p-0">
                                <div className='custwidtitle'>
                                    <h3>Custom widget colors</h3>
                                </div>
                                <div className='insidewhitecard'>
                                    <div className='widget-theme-options'>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Header text</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="headerTextColor" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button border</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonBorderColor" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button text</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonTitleColor" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button background on hover</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonBackgroundOnHover" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button text on hover</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonTextOnHover" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Button background</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="buttonBackground" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reviews text</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="reviewsText" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reviews background</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="reviewsBackground" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reviews background on hover</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="reviewsBackgroundOnHover" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reply text</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="replyText" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reply background</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="replyBackground" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Reply background on hover</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="replyBackgroundOnHover" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Verified badge background color</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="verifiedBadgeBackgroundColor" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Stars bar fill</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="starsBarFill" />
                                            </div>
                                        </div>
                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Stars bar background</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="productWidgetCustomize" pickerType="starsBarBackground" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="whitebox p-0">
                            <div className='custwidtitle'>
                                <h3>Widget settings</h3>
                            </div>
                            <div className='insidewhitecard'>
                                <div className='widget-theme-options'>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Review shadow</label>
                                        <div className='sideinput mw300 flxflexi'>

                                            <select name="reviewShadow" onChange={handleSelectChange} value={selectedReviewShadow} className='input_text'>
                                                <option value="basic">Basic</option>
                                                <option value="dark_offset">Dark offset</option>
                                                <option value="light_offset">Light offset</option>
                                                <option value="no">No shadow</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Corner Radius</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="reviewShadow" onChange={handleSelectChange} value={selectedReviewShadow} className='input_text'>
                                                <option value="sharp">Sharp</option>
                                                <option value="slightly-rounded">Slightly Rounded</option>
                                                <option value="rounded">Rounded</option>
                                                <option value="extra-rounded">Extra Rounded</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Header layout</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="" id="" className='input_text'>
                                                <option value="">Minimal</option>
                                                <option value="">Compact</option>
                                                <option value="">Expanded</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Product Reviews Widget</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="" id="" className='input_text'>
                                                <option value="">Hidden when empty</option>
                                                <option value="">Always hidden</option>
                                                <option value="">All reviews when empty</option>
                                                <option value="">All reviews always</option>
                                            </select>
                                            <div className='inputnote'>Note: Hiding the widget will also hide the "Write a review" button</div>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">"Write a review" button</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="" id="" className='input_text'>
                                                <option value="">Always shown</option>
                                                <option value="">Always hidden</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Reviews per page</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="" id="" className='input_text'>
                                                <option value="">1</option>
                                                <option value="">2</option>
                                            </select>
                                            <div className='inputnote'>Number of reviews displayed before "Show more" on product pages</div>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Review dates</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="" id="" className='input_text'>
                                                <option value="">Shown</option>
                                                <option value="">Hidden</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Item type</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="" id="" className='input_text'>
                                                <option value="">Shown</option>
                                                <option value="">Hidden</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Default sorting</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="" id="" className='input_text'>
                                                <option value="">Featured</option>
                                                <option value="">Newest</option>
                                                <option value="">Highest Ratings</option>
                                                <option value="">Lowest Ratings</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="" className='p-0'>Show sorting options</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" role="switch" name="enabledEmailBanner" id="enabledEmailBanner" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="" className='p-0'>Show ratings distribution</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <div class="form-check form-switch">
                                                <input class="form-check-input" type="checkbox" role="switch" name="enabledEmailBanner" id="enabledEmailBanner" />
                                            </div>
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
                                    <label htmlFor="">Review (Singular)</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' placeholder='Review' />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Reviews (Plural)</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' placeholder='Review' />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Write a review button title</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' placeholder='Write a review' />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">No reviews title - first part</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' placeholder='Be the first to' />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">No reviews title - last part (underlined)</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' placeholder='Write a review' />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Show more reviews title</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' placeholder='Show more reviews' />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Link to product page button title</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' placeholder='View product' />
                                    </div>
                                </div>
                                <div className="form-group m-0">
                                    <label htmlFor="">Item type title</label>
                                    <div className='sideinput flxflexi'>
                                        <input type='text' className='form-control' placeholder='my items whats this' />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className='whitebox p-0'>
                        <div class="custwidtitle">
                            <h3>Preview</h3>
                        </div>
                        <div className='insidewhitecard'>
                            <div className='reviewbox_wrap'></div>
                        </div>
                    </div>
                </div>
            </div>


        </>
    );
};

export default ProductReviewWidget;
