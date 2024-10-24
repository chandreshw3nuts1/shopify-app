import { useState, useCallback } from 'react';

import {
    Card,
    Select,
    TextField,
    Box,
	Grid, 
	BlockStack,
	Checkbox,
	InlineError,
    Text,
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


    const handleCheckboxChange = useCallback(async (checked, name) => {
        try {
            // console.log(checked, name)
            const updateData = {
                field: name,
                value: checked,
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
            setIsDifferentTimingChecked(checked);
        } catch (error) {
            console.error('Error updating record:', error);
        }

    });

    /* const handleCheckboxChange = async event => {
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

    }; */



    return (
        <BlockStack gap="400">
            <Card gap="200">
                <BlockStack gap='400'>
                    <BlockStack gap='100'>
                        <Text variant="bodyMd" as="p">Email timing</Text>
                        <Grid>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 5, lg: 5, xl: 5}}>
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
                            </Grid.Cell>
                            {selectedDefaultDayTiming != "never" && (
                                <>
                                    <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 2, lg: 1, xl: 1}}>
                                        <Text variant="bodyMd" alignment='center' as="p">After</Text>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 5, lg: 5, xl: 5}}>
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
                                    </Grid.Cell>
                                </>
                            )}
                        </Grid>
                    </BlockStack>
                    {/* <div className="form-group m-0 flxflexi">
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
                    </div> */}

                    {(selectedDefaultOrderTiming == "delivery" && !isDifferentTimingChecked && selectedDefaultDayTiming != "never") &&
                        <Grid>
                            <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 5, lg: 5, xl: 5}}>
                                <Select
                                    label="Fallback timing"
                                    name="fallback_timing"
                                    id="fallback_timing"
                                    options={fallbackTiming}
                                    onChange={
                                        handleSelectChange
                                    }
                                    value={selectedFallbackTiming}
                                />
                            </Grid.Cell>
                        </Grid>
                    }


                    {(selectedDefaultDayTiming != "never") &&

                        <div className="form-check form-switch">
                            <Checkbox
                                label="Set different timing for domestic and international orders"
                                checked={isDifferentTimingChecked}
                                onChange={ (value) => handleCheckboxChange(value , "is_different_timing")}
                            />
                        </div>
                    }

                    {isDifferentTimingChecked &&
                        <>
                            <BlockStack gap='100'>
                                <Text variant="bodyMd" as="p">Domestic orders (shipping within IN)</Text>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 5, lg: 5, xl: 5}}>
                                        <Select
                                            name="domestic_day_timing"
                                            id="domestic_day_timing"
                                            options={dayTimings.slice(0, -1)}
                                            onChange={
                                                handleSelectChange
                                            }
                                            value={selectedDomesticDayTiming}
                                        />
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 2, lg: 1, xl: 1}}>
                                        <Text variant="bodyMd" alignment='center' as="p">After</Text>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 5, lg: 5, xl: 5}}>
                                        <Select
                                            name="domestic_order_timing"
                                            id="domestic_order_timing"
                                            options={differentOrderTiming}
                                            onChange={
                                                handleSelectChange
                                            }
                                            value={selectedDomesticOrderTiming}
                                        />
                                    </Grid.Cell>
                                </Grid>
                            </BlockStack>
                            <BlockStack gap='100'>
                                <Text variant="bodyMd" as="p">{`International orders (shipping outside ${shopRecords.country_code})`}</Text>
                                <Grid>
                                    <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 5, lg: 5, xl: 5}}>
                                        <Select
                                            name="intenational_day_timing"
                                            id="intenational_day_timing"
                                            options={dayTimings.slice(0, -1)}
                                            onChange={
                                                handleSelectChange
                                            }
                                            value={selectedInternationalDayTiming}
                                        />
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 2, lg: 1, xl: 1}}>
                                        <Text variant="bodyMd" alignment='center' as="p">After</Text>
                                    </Grid.Cell>
                                    <Grid.Cell columnSpan={{xs: 12, sm: 12, md: 5, lg: 5, xl: 5}}>
                                        <Select
                                            name="intenational_order_timing"
                                            id="intenational_order_timing"
                                            options={differentOrderTiming}
                                            onChange={
                                                handleSelectChange
                                            }
                                            value={selectedInternationalOrderTiming}
                                        />
                                    </Grid.Cell>
                                </Grid>
                            </BlockStack>
                        </>
                    }

                </BlockStack>
            </Card>
        </BlockStack>
    );
}