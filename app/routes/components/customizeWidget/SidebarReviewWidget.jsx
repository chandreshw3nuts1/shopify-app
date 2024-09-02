import React, { useState, useEffect } from 'react';
import settingsJson from './../../../utils/settings.json';
import ColorPicker from "./../settings/ColorPicker";
import GridLayoutIcon from '../icons/GridLayoutIcon';
import ListLayoutIcon from '../icons/ListLayoutIcon';


const SidebarProductReviewWidget = ({ shopRecords, customizeObj }) => {
    const [documentObj, setDocumentObj] = useState(customizeObj);
    const [selectedWidgetPosition, setSelectedWidgetPosition] = useState(customizeObj?.widgetPosition);
    const [selectedwidgetOrientation, setSelectedwidgetOrientation] = useState(customizeObj?.widgetOrientation);
    const [buttonText, setButtonText] = useState('');
    const [isActive, setIsActive] = useState(customizeObj?.isActive);

    const [isHomePage, setIsHomePage] = useState(customizeObj?.isHomePage);
    const [isProductPage, setIsProductPage] = useState(customizeObj?.isProductPage);
    const [isCartPage, setIsCartPage] = useState(customizeObj?.isCartPage);
    const [isOtherPages, setIsOtherPages] = useState(customizeObj?.isOtherPages);
    const [hideOnMobile, setHideOnMobile] = useState(customizeObj?.hideOnMobile);

    const [initialData, setInitialData] = useState({});


    useEffect(() => {

        const documentObjInfo = (documentObj) ? documentObj : {};
        const {
            buttonText,
        } = documentObjInfo;
        setButtonText(buttonText || '');

        setInitialData({
            buttonText: buttonText || '',
        });

    }, []);



    const handleSelectChange = async (event) => {
        const eventKey = event.target.name;
        let eventVal = event.target.value;
        if (eventKey == 'isActive') {
            eventVal = !isActive;
        } else if (eventKey == 'isHomePage') {
            eventVal = !isHomePage;
        } else if (eventKey == 'isProductPage') {
            eventVal = !isProductPage;
        } else if (eventKey == 'isCartPage') {
            eventVal = !isCartPage;
        } else if (eventKey == 'isOtherPages') {
            eventVal = !isOtherPages;
        } else if (eventKey == 'hideOnMobile') {
            eventVal = !hideOnMobile;
        }
        
        const updateData = {
            field: event.target.name,
            value: eventVal,
            shop: shopRecords.shop,
            actionType: "sidebarReviewCustomize"
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
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime
            });

            setDocumentObj(prevState => ({
                ...(prevState || {}),  // Ensure prevState is an object
                [eventKey]: eventVal
            }));


        } else {
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime,
                isError: true
            });
        }
        if (eventKey == 'widgetPosition') {
            setSelectedWidgetPosition(eventVal);
        } else if (eventKey == 'widgetOrientation') {
            setSelectedwidgetOrientation(eventVal);
        } else if (eventKey == 'isActive') {
            setIsActive(!isActive);
        } else if (eventKey == 'isHomePage') {
            setIsHomePage(!isHomePage);
        } else if (eventKey == 'isProductPage') {
            setIsProductPage(!isProductPage);
        } else if (eventKey == 'isCartPage') {
            setIsCartPage(!isCartPage);
        } else if (eventKey == 'isOtherPages') {
            setIsOtherPages(!isOtherPages);
        }else if (eventKey == 'hideOnMobile') {
            setHideOnMobile(!hideOnMobile);
        }
    };


    const changeLanguageInput = (event) => {
        const eventKey = event.target.name;
        const eventVal = event.target.value;
        if (eventKey == 'buttonText') {
            setButtonText(eventVal);
        }
    };

    const handleInputBlur = async (e) => {
        if (initialData[e.target.name] != e.target.value) {
            const updateData = {
                field: e.target.name,
                value: e.target.value,
                shop: shopRecords.shop,
                actionType: "sidebarReviewCustomize"
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
                shopify.toast.show(data.message, {
                    duration: settingsJson.toasterCloseTime
                });

                setDocumentObj(prevState => ({
                    ...(prevState || {}),  // Ensure prevState is an object
                    [e.target.name]: e.target.value
                }));

                setInitialData(prevState => ({
                    ...(prevState || {}),
                    [e.target.name]: e.target.value
                }));


            } else {
                shopify.toast.show(data.message, {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
            }
        }
    };



    return (
        <>
            <div className="subtitlebox">
                <h2>Sidebar Review Widget</h2>
                <p>Give your visitors easy access to all of your store's reviews by clicking a tab on the side of their screen.
                </p>
            </div>
            <div className='flxfix'>
                <div className="row">
                    <div className="col-lg-12">
                        <div className='customize_wrap'>
                            <div className="whitebox p-0">
                                <div className='custwidtitle'>
                                    <h3>Widget settings</h3>
                                </div>
                                <div className='insidewhitecard'>
                                    <div className='widget-theme-options'>

                                        <div className="form-group m-0 horizontal-form alightop">
                                            <label htmlFor="" className='p-0'>Activate widget</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <div className="form-check form-switch">
                                                    <input
                                                        checked={
                                                            isActive
                                                        }
                                                        onChange={
                                                            handleSelectChange
                                                        }
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        role="switch"
                                                        name="isActive"
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                        {isActive &&
                                            <>
                                                <div className="form-group m-0 horizontal-form alightop">
                                                    <label htmlFor="">Position</label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <select name="widgetPosition" onChange={handleSelectChange} value={selectedWidgetPosition} className='input_text'>
                                                            <option value="left">Left</option>
                                                            <option value="right">Right</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form alightop">
                                                    <label htmlFor="">Orientation</label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <div className="form-group m-0">
                                                            <div className='layoutstr'>
                                                                <div className='layoutbox'>
                                                                    <input
                                                                        type='radio'
                                                                        value="ttb"
                                                                        name='widgetOrientation'
                                                                        id='gridlayout'
                                                                        onChange={handleSelectChange}
                                                                        checked={selectedwidgetOrientation === 'ttb'}

                                                                    />
                                                                    <label htmlFor="gridlayout">
                                                                        <div className='iconbox'><GridLayoutIcon /></div>
                                                                        <span>Top to bottom</span>
                                                                    </label>
                                                                </div>
                                                                <div className='layoutbox'>
                                                                    <input
                                                                        type='radio'
                                                                        value="btt"
                                                                        name='widgetOrientation'
                                                                        id='listlayout'
                                                                        onChange={handleSelectChange}
                                                                        checked={selectedwidgetOrientation === 'btt'}
                                                                    />
                                                                    <label htmlFor="listlayout">
                                                                        <div className='iconbox'><ListLayoutIcon /></div>
                                                                        <span>Bottom to top
                                                                        </span>
                                                                    </label>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="">Button text</label>
                                                    <div className='sideinput flxflexi'>
                                                        <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="buttonText" value={buttonText} placeholder="Reviews" />
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="">Button background color </label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="sidebarRatingWidgetCustomize" pickerType="buttonBackgroundColor" />
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="">Button text color</label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="sidebarRatingWidgetCustomize" pickerType="buttonTextColor" />
                                                    </div>
                                                </div>


                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="" className='p-0'>Hide on mobile</label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                checked={
                                                                    hideOnMobile
                                                                }
                                                                onChange={
                                                                    handleSelectChange
                                                                }
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                role="switch"
                                                                name="hideOnMobile"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="" className='p-0'>Display widget on</label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                checked={
                                                                    isHomePage
                                                                }
                                                                onChange={
                                                                    handleSelectChange
                                                                }
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                role="switch"
                                                                name="isHomePage"
                                                            /> &nbsp; Home page
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="" className='p-0'></label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                checked={
                                                                    isProductPage
                                                                }
                                                                onChange={
                                                                    handleSelectChange
                                                                }
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                role="switch"
                                                                name="isProductPage"
                                                            /> &nbsp; Product page
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="" className='p-0'></label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                checked={
                                                                    isCartPage
                                                                }
                                                                onChange={
                                                                    handleSelectChange
                                                                }
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                role="switch"
                                                                name="isCartPage"
                                                            /> &nbsp; Cart page
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="" className='p-0'></label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                checked={
                                                                    isOtherPages
                                                                }
                                                                onChange={
                                                                    handleSelectChange
                                                                }
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                role="switch"
                                                                name="isOtherPages"
                                                            /> &nbsp; Other pages
                                                        </div>
                                                    </div>
                                                </div>

                                            </>
                                        }

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

export default SidebarProductReviewWidget;
