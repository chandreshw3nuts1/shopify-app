import { ColorPicker, TextField, Popover } from '@shopify/polaris';
import { useState, useEffect } from 'react';
import settingsJson from './../../../utils/settings.json';

// Helper function to convert HSB to RGB and then to Hex
function hsbToHex(hsb) {
    let { hue, saturation, brightness } = hsb;
    let chroma = brightness * saturation;
    let h = hue / 60;
    let x = chroma * (1 - Math.abs((h % 2) - 1));
    let m = brightness - chroma;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1) {
        r = chroma; g = x; b = 0;
    } else if (1 <= h && h < 2) {
        r = x; g = chroma; b = 0;
    } else if (2 <= h && h < 3) {
        r = 0; g = chroma; b = x;
    } else if (3 <= h && h < 4) {
        r = 0; g = x; b = chroma;
    } else if (4 <= h && h < 5) {
        r = x; g = 0; b = chroma;
    } else if (5 <= h && h < 6) {
        r = chroma; g = 0; b = x;
    }

    // Convert RGB to [0, 255] and round
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    // Convert to hex
    const toHex = (value) => value.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;

}

// Helper function to convert HEX to HSB
function hexToHsb(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h, s, v = max;

    let d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
        h = 0; // achromatic
    } else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        hue: Math.round(h * 360),
        saturation: s,
        brightness: v,
    };
}

export async function updateColorCode(color, props) {
    try {
        const updateData = {
            color: color,
            field: props.pickerType,
            actionType: "updateColorCode",
            subActionType: props.pickerContent ? props.pickerContent : "brandingSetting",
            shop_domain: props.shopRecords.shop
        };
        const response = await fetch('/api/branding', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
        });
        const data = await response.json();
        if (data.status === 200) {
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime
            });
            props.setDocumentObj({
                ...props.documentObj,
                [props.pickerType]: color
            });
        } else {
            shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime,
                isError: true
            });
        }

    } catch (error) {
        console.error('Error updating record:', error);
    }
}

export default function ColorPickerComponent(props) {
    const defaultColor = props.pickerContent
        ? settingsJson[props.pickerContent][props.pickerType]
        : settingsJson.defaultColors[props.pickerType];

    // Initialize selectedColor with the default color in HEX format
    const [selectedColor, setSelectedColor] = useState(
        props.documentObj && props.documentObj[props.pickerType] ? props.documentObj[props.pickerType] : defaultColor
    );
    const [initialSelectedColor, setInitialSelectedColor] = useState(
        props.documentObj && props.documentObj[props.pickerType] ? props.documentObj[props.pickerType] : defaultColor
    );

    const [activePopover, setActivePopover] = useState(false); // Track if popover is active

    // Function to toggle popover visibility
    const togglePopover = () => {
        setActivePopover((prevActive) => !prevActive);
    };

    const onChangeHandle = (hsb) => {
        const hexColor = hsbToHex(hsb); // Convert HSB to HEX
        setSelectedColor(hexColor); // Update selected color

    };
    const handlePopoverClose = async () => {
        setActivePopover(false);
        if (activePopover && selectedColor != initialSelectedColor) {
            await updateColorCode(selectedColor, props);
            setInitialSelectedColor(selectedColor);

        }
    };

    return (
        <div>
            <Popover
                active={activePopover}
                activator={
                    <div onClick={togglePopover} className="colorpicker_input" style={{ display: 'flex', alignItems: 'center', border: '1px solid #E3E4E5', borderRadius: '8px', padding: '0 8px 0 15px' }}>
                        <span>#</span>
                        <input
                            className='form-control'
                            type="text"
                            defaultValue={selectedColor.replace('#', '')}
                            style={{ flexGrow: 1, border: 'none', outline: 'none', cursor: 'pointer' }}
                            maxLength={6}
                            onClick={handlePopoverClose}
                            placeholder={defaultColor}
                        />
                        <div
                            style={{
                                width: '30px',
                                height: '30px',
                                backgroundColor: selectedColor.startsWith('#') ? selectedColor : `#${selectedColor}`, // Ensure the color has a # prefix
                                borderRadius: '4px',
                                marginLeft: '5px'
                            }}
                        ></div>
                    </div>

                }
                onClose={handlePopoverClose} // Save color when closing the popover
                preferredAlignment="left"
            >
                <ColorPicker
                    onChange={(hsb) => onChangeHandle(hsb)}
                    color={hexToHsb(selectedColor)} // Convert HEX to HSB for ColorPicker
                />
            </Popover>
        </div>
    );
}
