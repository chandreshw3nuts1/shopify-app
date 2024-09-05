import React, { useState, useEffect, useRef } from "react";
import SketchPicker from 'react-color';
import settingsJson from './../../../utils/settings.json';

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

export default function ColorPicker(props) {

	const defaultColor = props.pickerContent
		? settingsJson[props.pickerContent][props.pickerType]
		: settingsJson.defaultColors[props.pickerType];

	const [selectedColor, setSelectedColor] = useState(props.documentObj && props.documentObj[props.pickerType] ? props.documentObj[props.pickerType] : defaultColor);
	const [isPickerVisible, setIsPickerVisible] = useState(false);
	const [isColorInputEmpty, setIsColorInputEmpty] = useState(false);
	const pickerRef = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (pickerRef.current && !pickerRef.current.contains(event.target) &&
				inputRef.current && !inputRef.current.contains(event.target)) {
				setIsPickerVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	const handleChange = (color) => {
		setSelectedColor(color.hex);
	};
	const handleChangeComplete = async (color) => {
		setSelectedColor(color.hex);
		await updateColorCode(color.hex, props);
		setIsColorInputEmpty(false);

	};

	const handleInputChange = async (e) => {
		const inputValue = e.target.value;
		setSelectedColor(`#${inputValue}`);

		if (inputValue.length == 0) {
			await updateColorCode(`#${defaultColor}`, props);
			setIsColorInputEmpty(true);
		} else if (inputValue.length == 6) {
			const hexRegex = /^#[0-9a-fA-F]{6}$/;
			if (hexRegex.test(`#${inputValue}`)) {
				await updateColorCode(`#${inputValue}`, props);
				setIsColorInputEmpty(false);

			} else {
				shopify.toast.show("Invalid color code", {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});

			}
		}

	};

	const togglePickerVisibility = () => {
		setIsPickerVisible(!isPickerVisible);
	};

	return (
		<div style={{ position: 'relative' }}>
			<div className="colorpicker_input" style={{ display: 'flex', alignItems: 'center', border: '1px solid #E3E4E5', borderRadius: '8px', padding: '0 8px 0 15px' }}>
				<span>#</span>
				<input
					className='form-control'
					type="text"
					value={selectedColor.replace('#', '')}
					onClick={togglePickerVisibility}
					onChange={handleInputChange} // Added onChange handler
					style={{ flexGrow: 1, border: 'none', outline: 'none', cursor: 'pointer' }}
					ref={inputRef}
					maxLength={6}
					placeholder={defaultColor}
				/>
				<div style={{ width: '30px', height: '30px', backgroundColor: isColorInputEmpty ? `#${defaultColor}` : selectedColor, borderRadius: '4px', marginLeft: '5px' }}></div>
			</div>
			{isPickerVisible && (
				<div style={{ position: 'absolute', zIndex: 1, top: '45px', left: '0' }} ref={pickerRef}>
					<SketchPicker
						color={selectedColor}
						onChange={handleChange}
						onChangeComplete={handleChangeComplete}
					/>
				</div>
			)}
		</div>
	);
}
