import { useLoaderData } from "@remix-run/react";
import settingsJson from './../utils/settings.json';
import React, { useState, useEffect, useRef } from 'react';

import LongArrowRight from "./components/icons/LongArrowRight";
import AddImageIcon from "./components/icons/AddImageIcon";
import ImageFilledIcon from "./components/icons/ImageFilledIcon";
import DeleteIcon from "./components/icons/DeleteIcon";
import RecordVideoIcon from "./components/icons/RecordVideoIcon";
import shopDetails from "./models/shopDetails";
import productReviews from './models/productReviews';
import generalAppearances from './models/generalAppearances';
import generalSettings from './models/generalSettings';
import reviewFormSettings from './models/reviewFormSettings';
import reviewDocuments from './models/reviewDocuments';
import { getDiscounts } from "./../utils/common";
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const meta = () => {
	return [
		{ title: `${settingsJson.app_name} Review Request` },
	];
};


export const links = () => {
	const stylesUrl = `${settingsJson.host_url}/styles/reviewRequest.css`;
	return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader = async ({ params, request }) => {
	try {
		const { reviewId } = params;
		const productReviewsModel = await productReviews.findById(reviewId);
		let shopRecords = null;
		let StarIcon = "";
		let discountObj, translations, reviewDocumentsModel, reviewFormSettingsModel, languageWiseReviewFormSettings, generalAppearancesModel, generalSettingsModel = {};
		if (productReviewsModel) {
			shopRecords = await shopDetails.findById(productReviewsModel.shop_id);

			generalAppearancesModel = await generalAppearances.findOne({
				shop_id: shopRecords._id
			});
			StarIcon = generalAppearancesModel.starIcon.replace(/-/g, '');

			discountObj = await getDiscounts(shopRecords, true);

			generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id });
			reviewDocumentsModel = await reviewDocuments.find({ review_id: productReviewsModel._id });
			const language = settingsJson.languages.find(language => language.code === productReviewsModel.customer_locale);

			const customer_locale = language ? language.code : generalSettingsModel.defaul_language;
			const apiUrl = `${settingsJson.host_url}/locales/${customer_locale}/translation.json`;
			const lang = await fetch(apiUrl, {
				method: 'GET'
			});
			translations = await lang.json();
			reviewFormSettingsModel = await reviewFormSettings.findOne({ shop_id: shopRecords._id });
			languageWiseReviewFormSettings = reviewFormSettingsModel[customer_locale] ? reviewFormSettingsModel[customer_locale] : {};
		}
		return { reviewId, shopRecords, reviewDocumentsModel, productReviewsModel, generalAppearancesModel, StarIcon, discountObj, translations, reviewFormSettingsModel, languageWiseReviewFormSettings, generalSettingsModel };
	} catch (error) {
		console.log(error);
	}
	return {};
};

const PhotoVideoReviewRequestForm = () => {
	const { reviewId, shopRecords, reviewDocumentsModel, productReviewsModel, generalAppearancesModel, StarIcon, discountObj, translations, reviewFormSettingsModel, languageWiseReviewFormSettings, generalSettingsModel } = useLoaderData();
	if (!productReviewsModel) {
		return 'Page Not Found';
	}

	const [currentStep, setCurrentStep] = useState(0);
	const [disableSubmitBtn, setDisableSubmitBtn] = useState(true);
	const [files, setFiles] = useState([]);
	const [previews, setPreviews] = useState([]);
	const [noOFfileUploadErr, setNoOFfileUploadErr] = useState(false);
	const [uploadedDocuments, setUploadedDocuments] = useState([]);
	const [maxUploadSizeErr, setMaxUploadSizeErr] = useState(false);

	const [thankyouHtmlContent, setThankyouHtmlContent] = useState('');
	const [isLoadingMedia, setIsLoadingMedia] = useState(false);
	const [submitRecLoader, setSubmitRecLoader] = useState(false);

	const fileInputRef = useRef(null); // Create a ref for the file input

	const shopUrl = "https://" + shopRecords.shop;

	useEffect(() => {
		if (reviewDocumentsModel.length > 0) {
			setCurrentStep(2);
		} else {
			setCurrentStep(1);
		}


	}, []);

	useEffect(() => {
		const copyButton = document.getElementById('copy-button');
		const discountCode = document.getElementById('discount-code');
		const copyMessage = document.getElementById('copy-message');

		const handleCopy = (event) => {
			event.preventDefault();

			const code = discountCode.textContent;

			// Copy the discount code to the clipboard
			navigator.clipboard.writeText(code).then(() => {
				// Show the "Copied!" message
				copyMessage.style.display = 'inline';

				// Hide the message after 2 seconds
				setTimeout(() => {
					copyMessage.style.display = 'none';
				}, 2000);
			}).catch((err) => {
				console.error('Failed to copy: ', err);
			});
		};

		// Attach the event listener
		if (thankyouHtmlContent) {
			if (!copyButton) {
				console.error("copyButton is undefined");
				return; // Exit early to avoid adding event listener to undefined
			}

			copyButton.addEventListener('click', handleCopy);

			// Cleanup the event listener when the component is unmounted
			return () => {
				copyButton.removeEventListener('click', handleCopy);
			};
		}

	}, [thankyouHtmlContent]);

	const languageContent = (type) => {
		if (type && languageWiseReviewFormSettings[type] !== undefined && languageWiseReviewFormSettings[type] !== '') {
			return languageWiseReviewFormSettings[type];
		} else {
			return translations.reviewFormSettings[type];
		}
	}
	const handleFileChange = async (event) => {
		const selectedFiles = Array.from(event.target.files);
		const totalFiles = files.length + selectedFiles.length;
		setNoOFfileUploadErr(false);
		if (totalFiles > 5) {
			setNoOFfileUploadErr(true);

		} else {

			const fileSizeLimit = 250 * 1024 * 1024;
			let checkUploadFilesIsValid = true;
			selectedFiles.forEach((file) => {
				if (file.size > fileSizeLimit) {
					checkUploadFilesIsValid = false;
				}
			});

			if (!checkUploadFilesIsValid) {
				fileInputRef.current.value = '';
				setMaxUploadSizeErr(true);
				return true;
			}
			setMaxUploadSizeErr(false);
			setIsLoadingMedia(true);
			const filteredFiles = selectedFiles.filter((file) => {
				const isImage = file.type.startsWith('image/');
				const isVideo = file.type.startsWith('video/');

				if (generalSettingsModel.is_enabled_video_review) {
					return isImage || isVideo;
				} else {
					return isImage;
				}
			});

			setFiles((prevFiles) => [...prevFiles, ...filteredFiles]);


			const newPreviews = selectedFiles
				.filter((file) => {
					// Include images always, and include videos if `shouldIncludeVideos` is true
					return file.type.startsWith('image/') || (generalSettingsModel.is_enabled_video_review && file.type.startsWith('video/'));
				})
				.map((file) => {
					const url = URL.createObjectURL(file);
					return { url, type: file.type };
				});


			for (const file of selectedFiles) {
				const formData = new FormData();
				formData.append('image_and_videos[]', file);
				formData.append('actionType', "uploadDocuments");
				formData.append('shop_domain', shopRecords.shop);
				try {
					const response = await fetch('/api/product-review-widget', {
						method: 'POST',
						body: formData,
					});
					const data = await response.json();
					setUploadedDocuments(prevUploadedFiles => [...prevUploadedFiles, ...data.files]);

				} catch (error) {
					console.error('Error uploading file:', error);
				}
			}

			setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
			setIsLoadingMedia(false);
			fileInputRef.current.value = '';
			setDisableSubmitBtn(false);
		}
	};

	const deleteDocument = async (index) => {
		const deletedUrl = uploadedDocuments[index];
		const formData = new FormData();
		formData.append('deleteFileName', deletedUrl);
		formData.append('actionType', "deleteDocuments");
		formData.append('shop_domain', shopRecords.shop);
		try {
			const response = await fetch('/api/product-review-widget', {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			setUploadedDocuments(uploadedDocuments.filter((item, i) => i !== index));
			setPreviews(previews.filter((item, i) => i !== index));
			setFiles(files.filter((item, i) => i !== index));
			if (uploadedDocuments.length == 1) {
				setDisableSubmitBtn(true);
			}
			setNoOFfileUploadErr(false);

		} catch (error) {
			console.error('Error uploading file:', error);
		}
	}


	const submitReview = async () => {

		const formData = new FormData();
		formData.append('shop_domain', shopRecords.shop);
		formData.append('product_id', productReviewsModel.product_id);
		formData.append('file_objects', uploadedDocuments);
		formData.append('reviewId', reviewId);
		formData.append('actionType', "addPhotoVideo");

		setDisableSubmitBtn(true);
		const response = await fetch('/api/product-review-widget', {
			method: 'POST',
			body: formData,
		});
		const submitResponse = await response.json();
		if (submitResponse.success) {
			setThankyouHtmlContent(submitResponse.content);
		}
		setCurrentStep(2);
	}
	let discountHtml = "";
	if (discountObj && Object.keys(discountObj).length > 0) {
		if (discountObj.isSameDiscount) {
			discountHtml = languageContent('addReviewSameDiscountText').replace(/\[discount\]/g, discountObj.discount);
		} else {
			discountHtml = languageContent('addReviewDifferentDiscountText');
			discountHtml = discountHtml.replace(/\[photo_discount\]/g, discountObj.photoDiscount);
			discountHtml = discountHtml.replace(/\[video_discount\]/g, discountObj.videoDiscount);
		}
	}

	let termsServiceLink = "#";
	let privacyPolicyLink = "#";
	let termsAndConditionHtml = translations.termsAndConditions;
	termsAndConditionHtml = termsAndConditionHtml.replace(/\[terms_service\]/g, termsServiceLink);
	termsAndConditionHtml = termsAndConditionHtml.replace(/\[privacy_policy\]/g, privacyPolicyLink);
	const themeColor = reviewFormSettingsModel.themeColor;
	const cornerRadius = reviewFormSettingsModel.cornerRadius ? reviewFormSettingsModel.cornerRadius : generalAppearancesModel.cornerRadius;


	// record video 
	const [showRecordVideoModal, setShowRecordVideoModal] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [videoURL, setVideoURL] = useState(null);
	const [recordedBlob, setRecordedBlob] = useState(null);
	const videoRef = useRef(null);
	const mediaRecorderRef = useRef(null);

	const startRecording = async () => {
		if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: {
					echoCancellation: true,
					noiseSuppression: true,
				},
				video: { width: 1920, height: 1080 }
			});
			videoRef.current.srcObject = stream;
			videoRef.current.play();

			mediaRecorderRef.current = new MediaRecorder(stream);
			const chunks = [];
			setRecordedBlob(null);

			mediaRecorderRef.current.ondataavailable = (event) => {
				chunks.push(event.data);
			};

			mediaRecorderRef.current.onstop = () => {
				const recordedBlobData = new Blob(chunks, { type: 'video/mp4' });
				setRecordedBlob(recordedBlobData);
				const url = URL.createObjectURL(recordedBlobData);
				setVideoURL(url);

				// Switch the video element to playback mode
				videoRef.current.srcObject = null;
				videoRef.current.src = url;
				videoRef.current.controls = true;
				videoRef.current.play();
			};

			mediaRecorderRef.current.start();
			setIsRecording(true);
		} else {
			console.error('MediaRecorder API not supported.');
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			videoRef.current.srcObject.getTracks().forEach(track => track.stop());
			setIsRecording(false);
		}
	};

	const submitRecording = async () => {
		if (!recordedBlob) return;
		setSubmitRecLoader(true);
		const formData = new FormData();
		formData.append("actionType", "uploadVideoRecording");
		formData.append("video_record", recordedBlob, 'recording.mp4'); // Correct extension for webm type
		formData.append('shop_domain', shopRecords.shop);

		try {
			const response = await fetch('/api/product-review-widget', {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			setUploadedDocuments(prevUploadedFiles => [...prevUploadedFiles, ...data]);


			const fileURL = URL.createObjectURL(recordedBlob);
			const fileName = recordedBlob.name;
			const fileType = recordedBlob.type;
			const uploadedFiles = {
				name: fileName,
				url: fileURL,
				type: fileType,
			};
			setFiles((prevFiles) => [...prevFiles, uploadedFiles]);
			setPreviews(prevPreviews => [...prevPreviews, uploadedFiles]);
			setShowRecordVideoModal(false);
			setSubmitRecLoader(false);
			setRecordedBlob(null);
			setDisableSubmitBtn(false);

		} catch (error) {
			console.error('Upload failed:', error);
		}
	};

	const recordVideoStart = () => {
		setShowRecordVideoModal(true);
		setRecordedBlob(null);
		setIsRecording(false);
	};

	const handleCloseRecordVideoModal = () => {
		setShowRecordVideoModal(false);
		setRecordedBlob(null);
		setIsRecording(false);
		if (videoRef.current.srcObject) {
			videoRef.current.srcObject.getTracks().forEach(track => track.stop());
			videoRef.current.srcObject = null;
			videoRef.current.src = null;
			videoRef.current.controls = false;
		}
	}

	return (
		<>
			<style>
				{`
					.theme-color-class {
						background-color: ${themeColor} !important;
					}
					.review-content {
						border-radius : ${cornerRadius}px !important;
					}
					
				`}
			</style>
			<div className="review-content">
				<div className="modal_step_wrap">
					<form method="post" className="popupform" id="review_submit_btn_form">
						{currentStep == 1 &&
							<div className="reviewsteps step-2 ">
								<div className="modal-header">
									<div className="flxflexi">
										<h1 className="modal-title">{languageContent('photoVideoPageTitle')}</h1>
										<div className="subtextbox">{languageContent('photoVideoPageSubTitle')}</div>
									</div>
								</div>
								<div className="modal-body">
									<div className="filesupload_wrap">
										<div className="filelabel_wrapbox">
											<label className="form__container" id="upload-container">
												{files.length == 0 &&
													<>
														<div className="iconimage">
															<AddImageIcon />
														</div>
														<div className="simpletext">{generalSettingsModel.is_enabled_video_review ? languageContent('dragDropPhotoVideoText') : languageContent('dragDropPhotoText')}</div>
														<div className="orbox flxrow">
															<span>OR</span>
														</div>
													</>
												}
												<div className="btnwrap">

													{isLoadingMedia == false ? (
														<span className="revbtn">
															<ImageFilledIcon />
															{generalSettingsModel.is_enabled_video_review ? languageContent('addPhotoVideoButtonText') : languageContent('addPhotoButtonText')}
														</span>
													) : (
														<span className="revbtn">
															<div className="loading-icon">
																<FontAwesomeIcon icon={faSpinner} spin /> {translations.reviewFormSettings.uploadingFiles}
															</div>
														</span>
													)}

												</div>
												<input ref={fileInputRef} onChange={handleFileChange} className="form__file" name="image_and_videos[]" id="upload-files" type="file" accept={generalSettingsModel.is_enabled_video_review ? 'image/*,video/mp4,video/x-m4v,video/*' : 'image/*'} multiple="multiple" />
											</label>
											<div className="record_video" onClick={recordVideoStart}>
												<RecordVideoIcon /> Rec
											</div>
										</div>



										{noOFfileUploadErr && <div className="discountrow uploadDocError ">
											<div className="discountbox"><strong>{generalSettingsModel.is_enabled_video_review ? translations.reviewFormSettings.maxFivePhotoVideoError : translations.reviewFormSettings.maxFivePhotoError}</strong></div>
										</div>}

										{maxUploadSizeErr &&
											<div className="discountrow">
												<div className="discountbox"><strong>{translations.reviewFormSettings.uploadMediaSizeError}</strong></div>
											</div>

										}

										{discountHtml &&
											<div className="discountrow">
												<div className="discountbox">{discountHtml}</div>
											</div>}
										<div className="form__files-container" id="files-list-container">

											{previews.map((preview, index) => (
												<div className="listbox" key={index}>
													<div className="form__image-container js-remove-image" data-index="' + index + '">
														{preview.type.startsWith('image') ? (
															<img className="form__image" src={preview.url} alt={`preview ${index}`} />
														) : (
															<video className="form__video" controls>
																<source src={preview.url} type="video/mp4" />
															</video>
														)}

														<div className="deleteicon" onClick={(e) => deleteDocument(index)}><DeleteIcon /> </div>
													</div>
												</div>
											))}




										</div>
										<input type="hidden" name="file_objects" id="file_objects" />
									</div>
								</div>
								<div className="modal-footer">
									<button onClick={submitReview} disabled={disableSubmitBtn} type="button" className="revbtn  submitBtn nextbtn">{languageContent('submitButtonTitle')} <LongArrowRight /></button>

								</div>
							</div>
						}

						{(currentStep == 2) &&
							<>
								{thankyouHtmlContent ? (
									<div className="reviewsteps" dangerouslySetInnerHTML={{ __html: thankyouHtmlContent }} />
								) : (
									<div className={`reviewsteps step-2  thankyou-page`}>
										<div className="modal-header">
											<div className="flxflexi">
												<h1 className="modal-title">{languageContent('thankyouTitle')}</h1>
												<div className="subtextbox">{languageContent('thankyouSubTitle')}</div>
											</div>
										</div>
										<div className="modal-body">

										</div>
										<div className="modal-footer">
											<a href={shopUrl} className="revbtn nextbtn" > {languageContent('continueButtonTitle')} <LongArrowRight /></a>
										</div>
									</div>
								)}
							</>
						}
					</form>
				</div>
			</div>

			<Modal show={showRecordVideoModal} className='reviewimagepopup' onHide={handleCloseRecordVideoModal} size="lg" backdrop="static">
				<Modal.Header closeButton>
					<Modal.Title>{translations.recordingVideoTitle}</Modal.Title>
				</Modal.Header>
				<Modal.Body>

					<div className="recordvideo_wrap">
						{/* Reused video element for both recording and playback */}
						<div className="recvideobox">
							<video ref={videoRef} autoPlay muted={!videoURL} style={{ width: '100%', maxHeight: '400px' }}></video>
						</div>

						<div className="btnwrap justify-content-center">

							{submitRecLoader ? (
								<button className="revbtn" >{translations.uploadingRecordingBtnText}</button>
							) : (
								<>
									{!isRecording ? (
										<button className="revbtn" onClick={startRecording}>{translations.startRecordingBtnText}</button>
									) : (
										<button className="revbtn" onClick={stopRecording}>{translations.stopRecordingBtnText}</button>
									)}
									{recordedBlob && <button className="revbtn" onClick={submitRecording}>{translations.submitRecordingBtnText}</button>}
								</>
							)};


						</div>
					</div>
				</Modal.Body>
			</Modal>
		</>
	);
};

export default PhotoVideoReviewRequestForm;
