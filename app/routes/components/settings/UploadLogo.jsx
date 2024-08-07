import React, { useState, useRef, useEffect } from 'react';
import { getUploadDocument } from './../../../utils/documentPath';
import settingsJson from './../../../utils/settings.json';

const UploadLogo = (props) => {
	const [file, setFile] = useState('');
	const inputfileimage = useRef(null);
	useEffect(() => {
		const logoImgUrl = getUploadDocument(props.documentObj?.logo, 'logo');
		setFile(logoImgUrl);
	}, []);
	const handleFileChange = async (event) => {
		const selectedFile = event.target.files[0];
		if (!selectedFile) return;

		if (!selectedFile.type.match("image/(jpeg|jpg|png)")) {
			shopify.toast.show("Upload an image in jpg, jpeg, or png format", {
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
		formData.append("logo", selectedFile);
		formData.append("actionType", "uploadLogo");
		formData.append("shop_domain", props.shopRecords.shop);
		try {
			const response = await fetch(`/api/branding`, {
				method: 'POST',
				body: formData
			});
			const data = await response.json();
			if (data.status == 200) {
				props.setDocumentObj({
					...props.documentObj,
					logo: data.logo
				});
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
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
	};

	const handleRemoveFile = async () => {

		const formData = new FormData();
		formData.append("actionType", "deleteLogo");
		formData.append("shop_domain", props.shopRecords.shop);
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
				//props.hasEdit = true;
				props.setDocumentObj({
					...props.documentObj,
					logo: null
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

	return (
		<div className={`imageuploadbox ${file ? 'hasfile' : ''} ${props.hasEdit ? 'haseditbtn' : ''} ${props.className} ${props.fullHeight ? 'flxflexi flxrow justify-content-center align-items-center' : ''}`}>
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
	);
};

export default UploadLogo;
