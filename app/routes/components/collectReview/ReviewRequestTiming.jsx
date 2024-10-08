import { useState, useCallback } from 'react';

import {
    Card,
    Select,
    TextField
} from '@shopify/polaris';
import settingsJson from './../../../utils/settings.json';


export default function ReviewRequestTiming({ reviewRequestTimingSettings, shopRecords }) {
    const [isDifferentTimingChecked, setIsDifferentTimingChecked] = useState(
        reviewRequestTimingSettings?.is_different_timing || false
    );
    const [selectedDefaultDayTiming, setSelectedDefaultDayTiming] = useState(
        reviewRequestTimingSettings?.default_day_timing || null
    );
    const [selectedDefaultOrderTiming, setSelectedDefaultOrderTiming] = useState(
        reviewRequestTimingSettings?.default_order_timing || false
    );
    const [selectedDomesticDayTiming, setSelectedDomesticDayTiming] = useState(
        reviewRequestTimingSettings?.domestic_day_timing || null
    );
    const [selectedDomesticOrderTiming, setSelectedDomesticOrderTiming] = useState(
        reviewRequestTimingSettings?.domestic_order_timing || null
    );
    const [selectedInternationalDayTiming, setSelectedInternationalDayTiming] = useState(
        reviewRequestTimingSettings?.international_day_timing || null
    );
    const [selectedInternationalOrderTiming, setSelectedInternationalOrderTiming] = useState(
        reviewRequestTimingSettings?.international_order_timing || null
    );
    const [selectedFallbackTiming, setSelectedFallbackTiming] = useState(
        reviewRequestTimingSettings?.fallback_timing || null
    );


    const dayTimings = settingsJson.dayTimings;
    const defaultOrderTiming = settingsJson.defaultOrderTiming;
    const differentOrderTiming = settingsJson.differentOrderTiming;
    const fallbackTiming = settingsJson.fallbackTiming;

    const handleSelectChange = async (value, name) => {
        const updateData = {
            field: name,
            value: value,
            shop: shopRecords.shop,
            actionType: "reviewRequestTiming"
        };
        const response = await fetch('/api/collect-review-setting', {
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
        } else {
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime,
                isError: true
            });
        }

        if (name == 'default_order_timing') {
            setSelectedDefaultOrderTiming(value);
        } else if (name == 'default_day_timing') {
            setSelectedDefaultDayTiming(value);
        } else if (name == 'domestic_day_timing') {
            setSelectedDomesticDayTiming(value);
        } else if (name == 'domestic_order_timing') {
            setSelectedDomesticOrderTiming(value);
        } else if (name == 'international_day_timing') {
            setSelectedInternationalDayTiming(value);
        } else if (name == 'international_order_timing') {
            setSelectedInternationalOrderTiming(value);
        } else if (name == 'fallback_timing') {
            setSelectedFallbackTiming(value);
        }
    };


    const handleCheckboxChange = async event => {
        try {

            const updateData = {
                field: event.target.name,
                value: event.target.checked,
                shop: shopRecords.shop,
                actionType: "reviewRequestTiming"
            };
            const response = await fetch('/api/collect-review-setting', {
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
            } else {
                shopify.toast.show(data.message, {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
            }
            setIsDifferentTimingChecked(!event.target.checked);
        } catch (error) {
            console.error('Error updating record:', error);
        }

    };



    return (
        <div className='row'>
            <div className='col-md-12'>
                <div className='collectreviewformbox'>
                    <Card>
                        <div className="reviewtiming_wrap">

                            <div className="form-group m-0 flxflexi">
                                <label htmlFor="">Email timing</label>
                                <div className='beforeafterwrap flxrow'>
                                    <div className='inputwrap flxflexi'>
                                        <div className="formcontent" >
                                            <Select
                                                name="default_day_timing"
                                                id="default_day_timing"
                                                options={dayTimings}
                                                disabled={isDifferentTimingChecked}
                                                onChange={
                                                    handleSelectChange
                                                }
                                                value={selectedDefaultDayTiming}
                                            />
                                        </div>
                                    </div>
                                    {selectedDefaultDayTiming != "never" && (
                                        <><span className="flxfix aftertextlabel">After</span>
                                            <div className='inputwrap flxflexi'>
                                                <div className="formcontent" >
                                                    <Select
                                                        name="default_order_timing"
                                                        id="default_order_timing"
                                                        options={defaultOrderTiming}
                                                        disabled={isDifferentTimingChecked}
                                                        onChange={
                                                            handleSelectChange
                                                        }
                                                        value={selectedDefaultOrderTiming}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {(selectedDefaultOrderTiming == "delivery" && !isDifferentTimingChecked && selectedDefaultDayTiming != "never") &&
                                <div className="form-group m-0 horizontal-form alightop">
                                    <label htmlFor="">Fallback timing</label>
                                    <div className='sideinput mw300 flxflexi'>
                                        <div className="formcontent" >
                                            <Select
                                                name="fallback_timing"
                                                id="fallback_timing"
                                                options={fallbackTiming}
                                                onChange={
                                                    handleSelectChange
                                                }
                                                value={selectedFallbackTiming}
                                            />
                                        </div>
                                    </div>
                                </div>
                            }


                            {(selectedDefaultDayTiming != "never") &&

                                <div className="form-check form-switch">
                                    <input
                                        checked={
                                            isDifferentTimingChecked
                                        }
                                        onChange={
                                            handleCheckboxChange
                                        }
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        name="is_different_timing"
                                        id="is_different_timing"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="is_different_timing"
                                    >
                                        Set different timing for domestic and international orders
                                    </label>
                                </div>
                            }

                            {isDifferentTimingChecked &&
                                <>

                                    <div className="">
                                        <div className="form-group m-0">
                                            <label htmlFor="">Domestic orders (shipping within IN)</label>
                                            <div className='beforeafterwrap flxrow'>
                                                <div className='inputwrap flxflexi'>
                                                    <div className="formcontent" >
                                                        <Select
                                                            name="domestic_day_timing"
                                                            id="domestic_day_timing"
                                                            options={dayTimings.slice(0, -1)}
                                                            onChange={
                                                                handleSelectChange
                                                            }
                                                            value={selectedDomesticDayTiming}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="flxfix aftertextlabel">After</span>
                                                <div className="inputwrap flxflexi">
                                                    <div className="formcontent" >
                                                        <Select
                                                            name="domestic_order_timing"
                                                            id="domestic_order_timing"
                                                            options={differentOrderTiming}
                                                            onChange={
                                                                handleSelectChange
                                                            }
                                                            value={selectedDomesticOrderTiming}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>


                                    <div className="">
                                        <div className="form-group m-0">
                                            <label htmlFor="">{`International orders (shipping outside ${shopRecords.country_code})`}</label>
                                            <div className='beforeafterwrap flxrow'>
                                                <div className='inputwrap flxflexi'>
                                                    <div className="formcontent" >
                                                        <Select
                                                            name="intenational_day_timing"
                                                            id="intenational_day_timing"
                                                            options={dayTimings.slice(0, -1)}
                                                            onChange={
                                                                handleSelectChange
                                                            }
                                                            value={selectedInternationalDayTiming}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="flxfix aftertextlabel">After</span>
                                                <div className="inputwrap flxflexi">
                                                    <div className="formcontent" >
                                                        <Select
                                                            name="intenational_order_timing"
                                                            id="intenational_order_timing"
                                                            options={differentOrderTiming}
                                                            onChange={
                                                                handleSelectChange
                                                            }
                                                            value={selectedInternationalOrderTiming}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>


                                    </div>

                                </>
                            }

                        </div>
                        {isDifferentTimingChecked &&
                            <>

                                <div className="">
                                    <div className="form-group ">

                                        <div className="formcontent" >
                                            <Select
                                                name="domestic_day_timing"
                                                id="domestic_day_timing"
                                                label="Domestic orders (shipping within IN)"
                                                options={dayTimings.slice(0, -1)}
                                                onChange={
                                                    handleSelectChange
                                                }
                                                value={selectedDomesticDayTiming}
                                            />
                                        </div>
                                    </div>
                                    <span className="">After</span>
                                    <div className="form-group">
                                        <div className="formcontent" >
                                            <Select
                                                name="domestic_order_timing"
                                                id="domestic_order_timing"
                                                options={differentOrderTiming}
                                                onChange={
                                                    handleSelectChange
                                                }
                                                value={selectedDomesticOrderTiming}
                                            />
                                        </div>
                                    </div>

                                </div>


                                <div className="">
                                    <div className="form-group ">

                                        <div className="formcontent" >
                                            <Select
                                                name="international_day_timing"
                                                id="international_day_timing"
                                                label={`International orders (shipping outside ${shopRecords.country_code})`}
                                                options={dayTimings.slice(0, -1)}
                                                onChange={
                                                    handleSelectChange
                                                }
                                                value={selectedInternationalDayTiming}
                                            />
                                        </div>
                                    </div>
                                    <span className="">After</span>
                                    <div className="form-group">
                                        <div className="formcontent" >
                                            <Select
                                                name="international_order_timing"
                                                id="international_order_timing"
                                                options={differentOrderTiming}
                                                onChange={
                                                    handleSelectChange
                                                }
                                                value={selectedInternationalOrderTiming}
                                            />
                                        </div>
                                    </div>

                                </div>

                            </>
                        }


                    </Card>
                </div>
            </div>


        </div>
    );
}