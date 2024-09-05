import React, { useState, useEffect } from 'react';
import settingsJson from './../../../utils/settings.json';
import ColorPicker from "./../settings/ColorPicker";


const FloatingWidget = ({ shopRecords, customizeObj }) => {
    const [documentObj, setDocumentObj] = useState(customizeObj);
    const [title, setTitle] = useState('');
    const [showProductThumb, setShowProductThumb] = useState(customizeObj?.isHomePage);
    const [initialData, setInitialData] = useState({});

    useEffect(() => {

        const documentObjInfo = (documentObj) ? documentObj : {};
        const {
            title,
        } = documentObjInfo;
        setTitle(title || '');

        setInitialData({
            title: title || '',
        });

    }, []);

    const handleSelectChange = async (event) => {
        const eventKey = event.target.name;
        let eventVal = event.target.value;
        if (eventKey == 'showProductThumb') {
            eventVal = !showProductThumb;
        }

        const updateData = {
            field: event.target.name,
            value: eventVal,
            shop: shopRecords.shop,
            actionType: "floatingWidgetCustomize"
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
        if (eventKey == 'showProductThumb') {
            setShowProductThumb(!showProductThumb);
        }
    };


    const changeLanguageInput = (event) => {
        const eventKey = event.target.name;
        const eventVal = event.target.value;
        if (eventKey == 'title') {
            setTitle(eventVal);
        }
    };

    const handleInputBlur = async (e) => {
        if (initialData[e.target.name] != e.target.value) {
            const updateData = {
                field: e.target.name,
                value: e.target.value,
                shop: shopRecords.shop,
                actionType: "floatingWidgetCustomize"
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
                <h2>Floating Product Reviews Widget</h2>
                <p>Present your reviews on a floating display so users can browse through reviews without leaving the page they are currently on.</p>
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

                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Title</label>
                                            <div className='sideinput flxflexi'>
                                                <input type='text' className='form-control' onBlur={handleInputBlur} onChange={changeLanguageInput} name="title" value={title} placeholder="Title" />
                                            </div>
                                        </div>

                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Title background color </label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="floatingWidgetCustomize" pickerType="backgroundColor" />
                                            </div>
                                        </div>

                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="">Title text color</label>
                                            <div className='sideinput mw300 flxflexi'>
                                                <ColorPicker documentObj={documentObj} shopRecords={shopRecords} setDocumentObj={setDocumentObj} pickerContent="floatingWidgetCustomize" pickerType="textColor" />
                                            </div>
                                        </div>


                                        <div className="form-group m-0 horizontal-form">
                                            <label htmlFor="" className='p-0'>Show product thumbnails</label>
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

export default FloatingWidget;
