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
import Dropdown from 'react-bootstrap/Dropdown';
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
                <div className="col-lg-5">
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
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch" name="enabledEmailBanner" id="enabledEmailBanner" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group m-0 horizontal-form alightop">
                                        <label htmlFor="" className='p-0'>Show ratings distribution</label>
                                        <div className='sideinput mw300 flxflexi'>
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" role="switch" name="enabledEmailBanner" id="enabledEmailBanner" />
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
                <div className="col-lg-7">
                    <div className='whitebox p-0'>
                        <div className="custwidtitle">
                            <h3>Preview</h3>
                        </div>
                        <div className='insidewhitecard'>
                            <div className='reviewbox_wrap'>
                                <div className="review_top_actions">
                                    <div className="left_actions flxfix">
                                        <div className="section_title">Customer Review</div>
                                        <div className="star-rating">
                                            <Dropdown>
                                                <Dropdown.Toggle variant="" className='starbtn' id="dropdown-basic">
                                                    <div className={`ratingstars flxrow star-4`}>
                                                        <i className='rating-star-rounded'></i>
                                                        <i className='rating-star-rounded'></i>
                                                        <i className='rating-star-rounded'></i>
                                                        <i className='rating-star-rounded'></i>
                                                        <i className='rating-star-rounded'></i>
                                                    </div>
                                                    <div className='ratingcount'>4 out of <span>5</span></div>
                                                    <div className="arrowright">
                                                        <i className='twenty-arrow-down'></i>
                                                    </div>
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu align={'start'}>
                                                    <div className="stardetaildd">
                                                        <div className="stardetailrow flxrow">
                                                            <div className="sratnumber">5</div>
                                                            <div className="starsicons flxrow star-5">
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            </div>
                                                            <div className="processbar"><div className="activebar" style={{ width: `40%` }}></div></div>
                                                            <div className="reviewgiven">(2)</div>
                                                        </div>
                                                        <div className="stardetailrow flxrow">
                                                            <div className="sratnumber">4</div>
                                                            <div className="starsicons flxrow star-4">
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            </div>
                                                            <div className="processbar"><div className="activebar" style={{ width: `20%` }}></div></div>
                                                            <div className="reviewgiven">(1)</div>
                                                        </div>
                                                        <div className="stardetailrow flxrow">
                                                            <div className="sratnumber">3</div>
                                                            <div className="starsicons flxrow star-4">
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            </div>
                                                            <div className="processbar"><div className="activebar" style={{ width: `20%` }}></div></div>
                                                            <div className="reviewgiven">(2)</div>
                                                        </div>
                                                        <div className="stardetailrow flxrow">
                                                            <div className="sratnumber">2</div>
                                                            <div className="starsicons flxrow star-4">
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            </div>
                                                            <div className="processbar"><div className="activebar" style={{ width: `0%` }}></div></div>
                                                            <div className="reviewgiven">(0)</div>
                                                        </div>
                                                        <div className="stardetailrow flxrow">
                                                            <div className="sratnumber">1</div>
                                                            <div className="starsicons flxrow star-4">
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                                <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            </div>
                                                            <div className="processbar"><div className="activebar" style={{ width: `0%` }}></div></div>
                                                            <div className="reviewgiven">(0)</div>
                                                        </div>
                                                    </div>
                                                    <input type="hidden" id="ratting_wise_filter" />
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                        <div className="totalreviewcount">
                                            <span>5</span> global ratings
                                        </div>
                                        
                                    </div>
                                    <div className="right_actions btnwrap flxflexi flxrow justify-content-end">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="" className='revbtn lightbtn wbigbtn noafter' id="dropdown-basic">
                                                <i className='twenty-filtericon'></i>
                                                sort by
                                                <div className="arrowright">
                                                    <i className='twenty-arrow-down'></i>
                                                </div>
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu align={'end'}>
                                                <li><a className="dropdown-item sort_by_filter" data-sort="tag_as_feature" href="#">Featured</a></li>
                                                <li><a className="dropdown-item sort_by_filter" data-sort="newest" href="#">Newest</a></li>
                                                <li><a className="dropdown-item sort_by_filter" data-sort="highest_ratings" href="#">Highest rating</a></li>
                                                <li><a className="dropdown-item sort_by_filter" data-sort="lowest_ratings" href="#">Lowest rating</a></li>
                                                <input type="hidden" id="sort_by_filter" />
                                            </Dropdown.Menu>
                                        </Dropdown>
                                        <button className="revbtn wbigbtn" id="show_create_review_modal" >Create Review</button>
                                    </div>
                                </div>
                                <div className='review-list-item frontreviewbox'>
                                    <div className='box-style'>
                                        <div className='review'>
                                            <div className='review_topbar flxrow'>
                                                <div className='mid_detail flxflexi'>
                                                    <h4>Chintan Amrutia</h4>
                                                    <div className='date'>8/2/2024</div>
                                                </div>
                                                <div className='star_reviews flxfix'>
                                                    <div className='star-rating'>
                                                        <div className='ratingcount'>3.0</div>
                                                        <div className='ratingstars flxrow star-3'>
                                                            <i class="rating-star-rounded"></i>
                                                            <i class="rating-star-rounded"></i>
                                                            <i class="rating-star-rounded"></i>
                                                            <i class="rating-star-rounded"></i>
                                                            <i class="rating-star-rounded"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='text_content'>
                                                <p>I have been using these industry leading headphones by Sony, colour Midnight Blue, and trust me i find them worth every penny spent. Yes, i agree these headphones are highly expensive, some may say you can purchase Apple Airpods, Boss, Sennheiser, and other audio equipment options, but trust me nothing beats these bad boys.</p>
                                            </div>
                                            <div className='text_content'>
                                                <p><strong>chintan-dev-store</strong> Replied:</p>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                            </div>
                                            <div className='review_bottomwrap'>
                                                <div className='product-container product-thumb-detail'>
                                                    <div className='image flxfix'>
                                                        <img src="https://cdn.shopify.com/s/files/1/0657/6183/7233/files/customer-image_60x60.jpg?v=1718273134" alt="" />
                                                    </div>
                                                    <div className='text flxflexi'>
                                                        <p>T shirt</p>
                                                    </div>
                                                </div>
                                                <div className='review_imageswrap flxrow'>
                                                    <div className='imagebox'>
                                                        <img src="https://plain-tasks-terror-approximately.trycloudflare.com/uploads/1719552895753-assasas.jpg" alt="" />
                                                    </div>
                                                    <div className='imagebox'>
                                                        <img src="https://plain-tasks-terror-approximately.trycloudflare.com/uploads/1719552911407-Challenge-Course.jpg" alt="" />
                                                    </div>
                                                    <div className='imagebox'>
                                                        <img src="https://plain-tasks-terror-approximately.trycloudflare.com/uploads/1719552913768-client-image-1.jpg" alt="" />
                                                    </div>
                                                </div>
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
