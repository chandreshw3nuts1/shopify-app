import React, { useState, useRef, useEffect } from 'react';
import { getUploadDocument } from './../../../utils/documentPath';
import settingsJson from './../../../utils/settings.json';

const ImageUploadMultiLang = (props) => {

	const [file, setFile] = useState('');

	const inputfileimage = useRef(null);

	useEffect(() => {

		const bannerImgUrl = getUploadDocument(props.languageWiseEmailTemplate.banner, props.shopRecords.shop_id, 'banners');
		setFile(bannerImgUrl);

	}, [props.languageWiseEmailTemplate.banner, props.currentLanguage]);
	const handleFileChange = async (event) => {
		const selectedFile = event.target.files[0];
		if (!selectedFile) return;

		if (!selectedFile.type.match("image/(jpeg|jpg|png|gif)")) {
			shopify.toast.show("Upload an image in jpg, jpeg, png or gif format only.", {
				duration: settingsJson.toasterCloseTime,
				isError: true
			});
			return;
		}

		const fileSizeMB = selectedFile.size / (1024 * 1024);

		if (fileSizeMB > 5) {
			shopify.toast.show("The file size should be less than 5 MB.", {
				duration: settingsJson.toasterCloseTime,
				isError: true
			});
			return;
		}


		setFile(URL.createObjectURL(selectedFile));


		const formData = new FormData();
		formData.append("banner", selectedFile);
		formData.append("actionType", "uploadEmailBanner");
		formData.append("actionSubType", props.bannerType);
		formData.append("shop_domain", props.shopRecords.shop);
		formData.append("language", props.currentLanguage);
		try {
			const response = await fetch(`/api/branding`, {
				method: 'POST',
				body: formData
			});
			const data = await response.json();
			if (data.status == 200) {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
				props.setEmailTemplateObjState(prevState => ({
					...((prevState || {})[props.currentLanguage] || {}), // Ensure prevState and currentLanguage object are not null
					[props.currentLanguage]: {
						...(prevState ? prevState[props.currentLanguage] : {}), // Default to empty object if undefined
						banner: data.fileName
					}
				}));

			} else {
				shopify.toast.show(data.message, {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
			}

		} catch (error) {
			console.error('Error uploading image:', error);
		}
	};

	const handleRemoveFile = async () => {

		const formData = new FormData();
		formData.append("actionType", "deleteEmailBanner");
		formData.append("actionSubType", props.bannerType);
		formData.append("shop_domain", props.shopRecords.shop);
		formData.append("language", props.currentLanguage);
		try {
			const response = await fetch(`/api/branding`, {
				method: 'DELETE',
				body: formData
			});
			const data = await response.json();
			if (data.status == 200) {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});

				props.setEmailTemplateObjState({
					...props.emailTemplateObjState,
					[props.currentLanguage]: {
						...props.emailTemplateObjState[props.currentLanguage],
						banner: ""
					}
				});
			} else {
				shopify.toast.show(data.message, {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
			}

		} catch (error) {
			console.error('Error uploading image:', error);
		}


		setFile(null);
		inputfileimage.current.value = null;
	};



	const setDefaultBanner = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("actionType", "setDefaultBanner");
		formData.append("actionSubType", props.bannerType);
		formData.append("shop_domain", props.shopRecords.shop);
		formData.append("language", props.currentLanguage);
		try {
			const response = await fetch(`/api/branding`, {
				method: 'POST',
				body: formData
			});
			const data = await response.json();
			if (data.status == 200) {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});

				props.setEmailTemplateObjState(prevState => ({
					...((prevState || {})[props.currentLanguage] || {}), // Ensure prevState and currentLanguage object are not null
					[props.currentLanguage]: {
						...(prevState ? prevState[props.currentLanguage] : {}), // Default to empty object if undefined
						banner: data.fileName
					}
				}));

				const bannerImgUrl = getUploadDocument(data.fileName, props.shopRecords.shop_id, 'banners');
				setFile(bannerImgUrl);

			} else {
				shopify.toast.show(data.message, {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
			}

		} catch (error) {
			console.error('Error uploading image:', error);
		}

	};



	return (
		<>
			<div className={`imageuploadbox ${file ? 'hasfile' : ''} ${props.hasEdit ? 'haseditbtn' : ''} ${props.className}`}>
				<div className='filebtnbox'>
					<input type="file" id="upload-files" ref={inputfileimage} className='inputfileimage' accept="image/*" onChange={handleFileChange} />
					{props.hasEdit && file
						?
						(<label htmlFor="upload-files"><i className="twenty-editicon1"></i></label>)
						:
						(
							props.className ? (
								<label htmlFor="upload-files" className='revbtn lightbtn regularbtn m-0'>Choose a File</label>
							) : (
								<label htmlFor="upload-files">Choose a File</label>
							)
						)
					}
					{props.className
						?
						(<div className='btnwrap m-0'>
							<a href="#" onClick={setDefaultBanner} className='revbtn regularbtn'>Use {settingsJson.app_name} Default</a>
						</div>)
						:
						''
					}
				</div>

				{file && (
					<div className="files-list-container">
						<div className="listbox">
							<div className="form__image-container">
								<img className="form__image" src={file} alt="" />
								<div className="deleteicon" onClick={(e) => handleRemoveFile()}>
									<i className='twenty-deleteicon'></i>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<div className='inputnote'>{settingsJson.bannerHelpText}</div>
		</>
	);
};

export default ImageUploadMultiLang;
