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
import GridLayoutIcon from '../icons/GridLayoutIcon';
import ListLayoutIcon from '../icons/ListLayoutIcon';
import CompactLayoutIcon from '../icons/CompactLayoutIcon';

const ProductReviewWidget = ({ shopRecords, customizeObj }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [documentObj, setDocumentObj] = useState(customizeObj);

    const [selectedOption, setSelectedOption] = useState('black');

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
                                            <input type='radio' value="gridlayout" name='layoutselection' id='gridlayout' />
                                            <label htmlFor="gridlayout">
                                                <div className='iconbox'><GridLayoutIcon /></div>
                                                <span>Grid</span>
                                            </label>
                                        </div>
                                        <div className='layoutbox'>
                                            <input type='radio' value="listlayout" name='layoutselection' id='listlayout' />
                                            <label htmlFor="listlayout">
                                                <div className='iconbox'><ListLayoutIcon /></div>
                                                <span>List</span>
                                            </label>
                                        </div>
                                        <div className='layoutbox'>
                                            <input type='radio' value="compactlayout" name='layoutselection' id='compactlayout' />
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
                                                    checked={selectedOption === 'black'}
                                                    onChange={handleOptionChange}
                                                    id='widcolorblacktext'
                                                />
                                                <label htmlFor='widcolorblacktext'>Black text (best over light backgrounds)</label>
                                            </div>
                                            <div className='radiobox'>
                                                <input
                                                    type="radio"
                                                    value="white"
                                                    checked={selectedOption === 'white'}
                                                    onChange={handleOptionChange}
                                                    id='widcolorwhitetext'
                                                />
                                                <label htmlFor='widcolorwhitetext'>White text (best over dark backgrounds)</label>
                                            </div>
                                            <div className='radiobox'>
                                                <input
                                                    type="radio"
                                                    value="custom"
                                                    checked={selectedOption === 'custom'}
                                                    onChange={handleOptionChange}
                                                    id='widcolorcustom'
                                                />
                                                <label htmlFor='widcolorcustom'>Custom</label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="whitebox p-0">
                            <div className='custwidtitle'>
                                <h3>Custom widget colors</h3>
                            </div>
                            <div className='insidewhitecard'>
                                <div className='widget-theme-options'>  
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Header text</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="headerTextColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Button border</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonBorderColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Button text</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Button background on hover</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Button text on hover</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Button background</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Reviews text</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Reviews background</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Reviews background on hover</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Reply text</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Reply background</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Reply background on hover</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Verified badge background color</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Stars bar fill</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form">
                                        <label htmlFor="">Stars bar background</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj}  pickerContent="productWidgetCustomize"  pickerType="buttonTitleColor" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="whitebox p-0">
                            <div className='custwidtitle'>
                                <h3>Black text (best over light backgrounds)</h3>
                            </div>
                            <div className='insidewhitecard'>
                                <div className='widget-theme-options'>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Review shadow</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="" id="" className='input_text'>
                                                <option>Basic</option>
                                                <option>Dark offset</option>
                                                <option>Light offset</option>
                                                <option>No shadow</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="">Corner Radius</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <select name="" id="" className='input_text'>
                                                <option value="">Default (Rounded)</option>
                                                <option value="">Sharp</option>
                                                <option value="">Slightly rounded</option>
                                                <option value="">Rounded</option>
                                                <option value="">Extra rounded</option>
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
