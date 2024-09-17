import React, { useState, useEffect } from 'react';
import settingsJson from './../../../utils/settings.json';

const PopupModalWidget = ({ shopRecords, customizeObj }) => {
    const [documentObj, setDocumentObj] = useState(customizeObj);
    const [isActive, setIsActive] = useState(customizeObj?.isActive);
    const [selectedWidgetPosition, setSelectedWidgetPosition] = useState(customizeObj?.widgetPosition);
    const [selectedCornerRadius, setSelectedCornerRadius] = useState(customizeObj?.cornerRadius);
    const [minimumRatingDisplay, setMinimumRatingDisplay] = useState(customizeObj?.minimumRatingDisplay);
    const [initialDelay, setInitialDelay] = useState(customizeObj?.initialDelay);
    const [delayBetweenPopups, setDelayBetweenPopups] = useState(customizeObj?.delayBetweenPopups);
    const [popupDisplayTime, setPopupDisplayTime] = useState(customizeObj?.popupDisplayTime);
    const [maximumPerPage, setMaximumPerPage] = useState(customizeObj?.maximumPerPage);
    const [showProductThumb, setShowProductThumb] = useState(customizeObj?.showProductThumb);
    const [hideOnMobile, setHideOnMobile] = useState(customizeObj?.hideOnMobile);
    const [isHomePage, setIsHomePage] = useState(customizeObj?.isHomePage);
    const [isProductPage, setIsProductPage] = useState(customizeObj?.isProductPage);
    const [isCartPage, setIsCartPage] = useState(customizeObj?.isCartPage);
    const [isOtherPages, setIsOtherPages] = useState(customizeObj?.isOtherPages);

    const [initialData, setInitialData] = useState({});


    useEffect(() => {

        const documentObjInfo = (documentObj) ? documentObj : {};
        const {
            initialDelay,
            delayBetweenPopups,
            popupDisplayTime,
            maximumPerPage,

        } = documentObjInfo;
        setInitialDelay(initialDelay || '');
        setDelayBetweenPopups(delayBetweenPopups || '');
        setPopupDisplayTime(popupDisplayTime || '');
        setMaximumPerPage(maximumPerPage || '');

        setInitialData({
            initialDelay: initialDelay || '',
            delayBetweenPopups: delayBetweenPopups || '',
            popupDisplayTime: popupDisplayTime || '',
            maximumPerPage: maximumPerPage || '',
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
        } else if (eventKey == 'showProductThumb') {
            eventVal = !showProductThumb;
        }

        const updateData = {
            field: event.target.name,
            value: eventVal,
            shop: shopRecords.shop,
            actionType: "popupModalReviewCustomize"
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
        } else if (eventKey == 'cornerRadius') {
            setSelectedCornerRadius(eventVal);
        } else if (eventKey == 'minimumRatingDisplay') {
            setMinimumRatingDisplay(eventVal);
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
        } else if (eventKey == 'hideOnMobile') {
            setHideOnMobile(!hideOnMobile);
        } else if (eventKey == 'showProductThumb') {
            setShowProductThumb(!showProductThumb);
        }
    };


    const changeLanguageInput = (event) => {
        const eventKey = event.target.name;
        const eventVal = event.target.value;
        if (eventKey == 'initialDelay') {
            setInitialDelay(eventVal);
        } else if (eventKey == 'delayBetweenPopups') {
            setDelayBetweenPopups(eventVal);
        } else if (eventKey == 'popupDisplayTime') {
            setPopupDisplayTime(eventVal);
        } else if (eventKey == 'maximumPerPage') {
            setMaximumPerPage(eventVal);
        }
    };

    const handleInputBlur = async (e) => {
        if (initialData[e.target.name] != e.target.value) {
            const updateData = {
                field: e.target.name,
                value: e.target.value,
                shop: shopRecords.shop,
                actionType: "popupModalReviewCustomize"
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
                <h2>Pop-up Widget</h2>
                <p>Spotlight relevant reviews and drive visitors to your product pages with a subtle social proof pop-up.
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
                                                            <option value="bottom_left">Bottom-left corner</option>
                                                            <option value="bottom_right">Bottom-right corner</option>
                                                            <option value="top_left">Top-left corner</option>
                                                            <option value="top_right">Top-right corner</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form alightop">
                                                    <label htmlFor="">Corner Radius</label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <select name="cornerRadius" onChange={handleSelectChange} value={selectedCornerRadius} className='input_text'>
                                                            <option value="0">Sharp</option>
                                                            <option value="4">Slightly Rounded</option>
                                                            <option value="8">Rounded</option>
                                                            <option value="16">Extra Rounded</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="form-group m-0 horizontal-form alightop">
                                                    <label htmlFor="">Minimum rating to display</label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <select name="minimumRatingDisplay" onChange={handleSelectChange} value={minimumRatingDisplay} className='input_text'>
                                                            <option value="5">5 stars only</option>
                                                            <option value="4">4 stars and up</option>
                                                            <option value="3">3 stars and up</option>
                                                            <option value="2">2 stars and up</option>
                                                            <option value="all">All reviews</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="">Initial Delay (Sec.)</label>
                                                    <div className='sideinput mw300  flxflexi'>
                                                        <input type='number' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="initialDelay" value={initialDelay} placeholder="5" />
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="">Delay between pop-ups (Sec.)</label>
                                                    <div className='sideinput mw300  flxflexi'>
                                                        <input type='number' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="delayBetweenPopups" value={delayBetweenPopups} placeholder="5" />
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="">Pop-up display time (Sec.)</label>
                                                    <div className='sideinput mw300  flxflexi'>
                                                        <input type='number' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="popupDisplayTime" value={popupDisplayTime} placeholder="5" />
                                                    </div>
                                                </div>

                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="">Maximum per page (pop-ups.)</label>
                                                    <div className='sideinput mw300  flxflexi'>
                                                        <input type='number' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="maximumPerPage" value={maximumPerPage} placeholder={settingsJson.page_limit} />
                                                    </div>
                                                </div>




                                                <div className="form-group m-0 horizontal-form">
                                                    <label htmlFor="" className='p-0'>Product thumbnail </label>
                                                    <div className='sideinput mw300 flxflexi'>
                                                        <div className="form-check form-switch">
                                                            <input
                                                                checked={
                                                                    showProductThumb
                                                                }
                                                                onChange={
                                                                    handleSelectChange
                                                                }
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                role="switch"
                                                                name="showProductThumb"
                                                            />
                                                        </div>
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

export default PopupModalWidget;
