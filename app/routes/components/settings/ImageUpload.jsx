import React, { useState, useRef, useEffect } from 'react';
import { getUploadDocument } from './../../../utils/documentPath';
import { toast } from 'react-toastify';
import settingsJson from './../../../utils/settings.json';

const defaultBannerName = 'default-banner.png';
const SingleImageUpload = (props) => {
	const [file, setFile] = useState('');
	const singleFilebanner = useRef(null);
	useEffect(() => {
		const bannerImgUrl = getUploadDocument(props.documentObj?.banner, 'banners');
		setFile(bannerImgUrl);
	}, []);

	const handleFileChangeBanner = async (event) => {
		const selectedFile = event.target.files[0];
		if (!selectedFile) return;

		if (!selectedFile.type.match("image/(jpeg|jpg|png|gif)")) {
			toast.error("You can upload an image in jpg, jpeg, png or gif format");
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
		formData.append("actionType", "uploadCommonBanner");
		formData.append("shop_domain", props.shopRecords.shop);
		try {
			const response = await fetch(`/api/branding`, {
				method: 'POST',
				body: formData
			});
			const data = await response.json();
			if (data.status == 200) {
				toast.success(data.message, { autoClose: settingsJson.toasterCloseTime });
				props.setDocumentObj({
					...props.documentObj,
					banner: data.banner
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
		formData.append("actionType", "deleteCommonBanner");
		formData.append("shop_domain", props.shopRecords.shop);
		try {
			const response = await fetch(`/api/branding`, {
				method: 'DELETE',
				body: formData
			});
			const data = await response.json();
			if (data.status == 200) {
				toast.success(data.message, { autoClose: settingsJson.toasterCloseTime });
				const bannerImgUrl = getUploadDocument(defaultBannerName, 'banners');
				setFile(bannerImgUrl);
				props.setDocumentObj({
					...props.documentObj,
					banner: defaultBannerName
				});
				
				
			} else {
				toast.error(data.message);
			}

		} catch (error) {
			console.error('Error uploading image:', error);
		}

	};

	return (
		<div className={`imageuploadbox ${file ? 'hasfile' : ''} ${props.hasEdit ? 'haseditbtn' : ''} ${props.className} ${(props.documentObj.banner && props.documentObj.banner != defaultBannerName) ? 'hasdelete' : 'nodeletebtn'}`}>
			<div className='filebtnbox'>
				<input type="file" id="upload-banner-file" ref={singleFilebanner} className='inputfileimage singleFilebanner' accept="image/*" onChange={handleFileChangeBanner} />
				{props.hasEdit && file
					?
					(<label htmlFor="upload-banner-file"><i className="twenty-editicon1"></i></label>)
					:
					(
						props.className ? (
							<label htmlFor="upload-banner-file" className='revbtn lightbtn regularbtn m-0'>Choose a File</label>
						) : (
							<label htmlFor="upload-banner-file">Choose a File</label>
						)
					)
				}

			</div>

			{file && (
				<div className="files-list-container">
					<div className="listbox">
						<div className="form__image-container">
							<img className="form__image" src={file} alt="" />
							{props.documentObj.banner && props.documentObj.banner != defaultBannerName &&
								<div className="deleteicon" onClick={(e) => handleRemoveFile()}>
									<i className='twenty-deleteicon'></i>
								</div>
							}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default SingleImageUpload;
