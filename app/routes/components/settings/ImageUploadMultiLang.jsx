import React, { useState, useRef, useEffect } from 'react';
import { getUploadDocument } from './../../../utils/documentPath';
import { toast } from 'react-toastify';

const DeleteBin = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17.5 8.38797C15.5575 8.18997 13.6033 8.08797 11.655 8.08797C10.5 8.08797 9.345 8.14797 8.19 8.26797L7 8.38797M10.2083 7.78199L10.3367 6.99599C10.43 6.426 10.5 6 11.4858 6H13.0142C14 6 14.0758 6.45 14.1633 7.00199L14.2917 7.78199M16.2458 10.2841L15.8666 16.326C15.8024 17.268 15.7499 18 14.1224 18H10.3774C8.74994 18 8.69744 17.268 8.63328 16.326L8.25411 10.2841M11.2759 14.6999H13.2184M10.7917 12.3H13.7083" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const ImageUploadMultiLang = (props) => {

	const [file, setFile] = useState('');

	const inputfileimage = useRef(null);

	useEffect(() => {

		const bannerImgUrl = getUploadDocument(props.languageWiseEmailTemplate.banner, 'banners');
		setFile(bannerImgUrl);

	}, [props.languageWiseEmailTemplate.banner, props.currentLanguage]);
	const handleFileChange = async (event) => {
		const selectedFile = event.target.files[0];
		if (!selectedFile) return;

		if (!selectedFile.type.match("image/(jpeg|jpg|png)")) {
			toast.error("You can upload an image in jpg, jpeg, or png format only.");
			return;
		}

		const fileSizeMB = selectedFile.size / (1024 * 1024);

		if (fileSizeMB > 5) {
			toast.error('The file size should be less than 5 MB.');
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
				toast.success(data.message);
				props.setEmailTemplateObjState({
					...props.emailTemplateObjState,
					[props.currentLanguage]: {
						...props.emailTemplateObjState[props.currentLanguage],
						banner: data.fileName
					}
				});


			} else {
				toast.error(data.message);
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
				toast.success(data.message);
			} else {
				toast.error(data.message);
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
				toast.success(data.message);
				props.setEmailTemplateObjState({
					...props.emailTemplateObjState,
					[props.currentLanguage]: {
						...props.emailTemplateObjState[props.currentLanguage],
						banner: data.fileName
					}
				});

				const bannerImgUrl = getUploadDocument(data.fileName, 'banners');
				setFile(bannerImgUrl);

			} else {
				toast.error(data.message);
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
							<a href="#" onClick={setDefaultBanner} className='revbtn regularbtn'>Use W3 Default</a>
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
			<div className='inputnote'>You can upload an image in JPG, PNG, or GIF format up to 5 MB. Email banner will be displayed in 500px width, for best results, upload an image between 500-1200px wide</div>
		</>
	);
};

export default ImageUploadMultiLang;
