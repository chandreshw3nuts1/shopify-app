import { useLoaderData } from "@remix-run/react";
import settingsJson from './../utils/settings.json';
import React, { useState, useEffect, useRef } from 'react';

import { getCustomQuestions } from './../utils/common';
import StarBigIcon from "./components/icons/StarBigIcon";
import LongArrowRight from "./components/icons/LongArrowRight";
import LongArrowLeft from "./components/icons/LongArrowLeft";
import AddImageIcon from "./components/icons/AddImageIcon";
import ImageFilledIcon from "./components/icons/ImageFilledIcon";
import CheckArrowIcon from "./components/icons/CheckArrowIcon";
import DeleteIcon from "./components/icons/DeleteIcon";
import RecordVideoIcon from "./components/icons/RecordVideoIcon";

import FaceStar1 from "./components/images/FaceStar1";
import FaceStar2 from "./components/images/FaceStar2";
import FaceStar3 from "./components/images/FaceStar3";
import FaceStar4 from "./components/images/FaceStar4";
import FaceStar5 from "./components/images/FaceStar5";
import shopDetails from "./models/shopDetails";
import manualReviewRequests from './models/manualReviewRequests';
import manualRequestProducts from './models/manualRequestProducts';
import generalAppearances from './models/generalAppearances';
import generalSettings from './models/generalSettings';
import reviewFormSettings from './models/reviewFormSettings';


import { ratingbabycloth, ratingbasket, ratingbones, ratingcoffeecup, ratingcrisamascap, ratingdiamondfront, ratingdiamondtop, ratingdogsleg, ratingfireflame, ratingflight, ratingfood, ratinggraduationcap, ratingheartround, ratingheartsq, ratingleafcanada, ratingleafnormal, ratinglikenormal, ratinglikerays, ratingpethouse, ratingplant, ratingshirt, ratingshoppingbag1, ratingshoppingbag2, ratingshoppingbag3, ratingstarrays, ratingstarrounded, ratingstarsq, ratingsunglass, ratingteacup, ratingtrophy1, ratingtrophy2, ratingtrophy3, ratingtshirt, ratingwine } from './../routes/components/icons/CommonIcons';
import { getDiscounts } from "./../utils/common";
import { Modal } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export const links = () => {
	const stylesUrl = `${settingsJson.host_url}/styles/reviewRequest.css`;
	return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader = async ({ params, request }) => {
	try {
		const { requestId } = params;
		const url = new URL(request.url);
		const requestIdQuery = url.searchParams.get("requestId");
		const manualRequestProductsModel = await manualRequestProducts.findById(requestId);

		let manualReviewRequestsModel, shopRecords = null;
		let customQuestionsData = [];
		let StarIcon = "";
		let discountObj, translations, reviewFormSettingsModel, languageWiseReviewFormSettings, generalAppearancesModel, generalSettingsModel = {};
		if (manualRequestProductsModel) {
			manualReviewRequestsModel = await manualReviewRequests.findById(manualRequestProductsModel.manual_request_id);

			shopRecords = await shopDetails.findById(manualReviewRequestsModel.shop_id);

			customQuestionsData = await getCustomQuestions({
				shop_id: shopRecords._id,
			});

			generalAppearancesModel = await generalAppearances.findOne({
				shop_id: shopRecords._id
			});
			StarIcon = generalAppearancesModel.starIcon.replace(/-/g, '');

			discountObj = await getDiscounts(shopRecords, true);

			generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id });

			const language = settingsJson.languages.find(language => language.code === manualReviewRequestsModel.customer_locale);

			const customer_locale = language ? language.code : generalSettingsModel.defaul_language;
			const apiUrl = `${settingsJson.host_url}/locales/${customer_locale}/translation.json`;
			const lang = await fetch(apiUrl, {
				method: 'GET'
			});
			translations = await lang.json();
			reviewFormSettingsModel = await reviewFormSettings.findOne({ shop_id: shopRecords._id });
			languageWiseReviewFormSettings = reviewFormSettingsModel[customer_locale] ? reviewFormSettingsModel[customer_locale] : {};
		}
		return { requestId, requestIdQuery, shopRecords, generalAppearancesModel, customQuestionsData, manualRequestProductsModel, manualReviewRequestsModel, StarIcon, discountObj, translations, reviewFormSettingsModel, languageWiseReviewFormSettings, generalSettingsModel };
	} catch (error) {
		console.log(error);
	}
	return {};
};

const ReviewRequestForm = () => {
	const { requestId, requestIdQuery, shopRecords, generalAppearancesModel, customQuestionsData, manualRequestProductsModel, manualReviewRequestsModel, StarIcon, discountObj, translations, reviewFormSettingsModel, languageWiseReviewFormSettings, generalSettingsModel } = useLoaderData();
	if (!manualRequestProductsModel) {
		return 'Page Not Found';
	}

	const [faceStartValue, setFaceStartValue] = useState("");
	const [rating, setRating] = useState(0);
	const [currentStep, setCurrentStep] = useState(0);
	const [reviewDescription, setReviewDescription] = useState('');
	const [customQuestionsDataObj, setCustomQuestionsDataObj] = useState(customQuestionsData);

	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	const [email, setEmail] = useState(manualReviewRequestsModel?.email || "");
	const [errors, setErrors] = useState({});
	const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

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
	const countTotalQuestions = customQuestionsData.length;

	useEffect(() => {
		if (manualRequestProductsModel.status == 'sent') {
			setCurrentStep(1);
		} else {
			setCurrentStep(countTotalQuestions + 5);
		}

		//setCurrentStep(2);
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
	const [faceStarLable, setFaceStarLable] = useState(languageContent('ratingPageSubTitle'));

	const iconComponents = {
		ratingbabycloth, ratingbasket, ratingbones, ratingcoffeecup, ratingcrisamascap, ratingdiamondfront, ratingdiamondtop, ratingdogsleg, ratingfireflame, ratingflight, ratingfood, ratinggraduationcap, ratingheartround, ratingheartsq, ratingleafcanada, ratingleafnormal, ratinglikenormal, ratinglikerays, ratingpethouse, ratingplant, ratingshirt, ratingshoppingbag1, ratingshoppingbag2, ratingshoppingbag3, ratingstarrays, ratingstarrounded, ratingstarsq, ratingsunglass, ratingteacup, ratingtrophy1, ratingtrophy2, ratingtrophy3, ratingtshirt, ratingwine
	};

	const IconComponent = iconComponents[StarIcon] || ratingstarrounded;

	const starRatingObj = [
		{ "star": 1, "title": languageContent('oneStarsRatingText') },
		{ "star": 2, "title": languageContent('twoStarsRatingText') },
		{ "star": 3, "title": languageContent('threeStarsRatingText') },
		{ "star": 4, "title": languageContent('fourStarsRatingText') },
		{ "star": 5, "title": languageContent('fiveStarsRatingText') },
	];

	const starClicks = async (index, star) => {
		setFaceStartValue("star-" + star);
		setFaceStarLable(starRatingObj[index].title);
		setRating(star);
	}
	const nextStep = (step) => {
		setCurrentStep(step);
	};

	const prevStep = (step) => {
		setCurrentStep(step);
	};

	const changeReviewDescription = (event) => {
		setReviewDescription(event.target.value);
	}

	const changeFirstName = (event) => {
		setFirstName(event.target.value);
	}
	const changeLastName = (event) => {
		setLastName(event.target.value);
	}
	const changeEmail = (event) => {
		setEmail(event.target.value);
	}

	const answerChecked = (answer, index) => {
		const newProperties = {
			answer: answer,
		};
		setCustomQuestionsDataObj(customQuestionsDataObj.map((item, idx) =>
			idx === index
				? { ...item, ...newProperties }
				: item
		));
	}

	const validate = () => {
		const errors = {};
		errors.firstName = "";
		if (!firstName.trim()) {
			errors.firstName = 'First name is required';
		}
		errors.lastName = "";
		if (!lastName.trim()) {
			errors.lastName = 'Last name is required';
		}
		errors.email = "";
		if (!email) {
			errors.email = 'Email is required';
		} else if (!/^[\w+-.]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
			errors.email = 'Email is invalid';
		}
		return errors;
	};



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
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	}


	const submitReview = async () => {
		const validationErrors = validate();

		if (validationErrors.firstName == '' && validationErrors.lastName == '' && validationErrors.email == '') {
			const formData = new FormData();
			formData.append('first_name', firstName);
			formData.append('last_name', lastName);
			formData.append('email', email);
			formData.append('shop_domain', shopRecords.shop);
			formData.append('product_id', manualRequestProductsModel.product_id);
			formData.append('variant_title', manualRequestProductsModel.variant_title ?? '');
			formData.append('rating', rating);
			formData.append('file_objects', uploadedDocuments);
			formData.append('description', reviewDescription);
			formData.append('requestId', requestId);
			formData.append('customer_locale', manualReviewRequestsModel?.customer_locale);


			customQuestionsDataObj.forEach((item, index) => {
				if (item.answer != "" && typeof item.answer != 'undefined') {
					formData.append(`questions[${index}][question_id]`, item._id);
					formData.append(`questions[${index}][answer]`, item.answer);
					formData.append(`questions[${index}][question_name]`, item.question);
				}
			});
			setDisableSubmitBtn(true);
			const response = await fetch('/api/product-review-widget', {
				method: 'POST',
				body: formData,
			});
			const submitResponse = await response.json();
			if (submitResponse.success) {
				setThankyouHtmlContent(submitResponse.content);
			}
			setCurrentStep(countTotalQuestions + 5);
		} else {
			setErrors(validationErrors);
		}

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
	const [mediaRecorder, setMediaRecorder] = useState(null);
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
		if(videoRef.current.srcObject){
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
							<div className="reviewsteps step-1">
								<div className="modal-header">
									<div className="flxflexi">
										<h1 className="modal-title">{languageContent('ratingPageTitle')}</h1>
										<div className="subtextbox">
											<div className="success-box-wrap">
												<div className={`success-box ${faceStartValue}`}>
													<div className="facewrap">
														<div className="facebox facestar1"><FaceStar1 /></div>
														<div className="facebox facestar2"><FaceStar2 /></div>
														<div className="facebox facestar3"><FaceStar3 /></div>
														<div className="facebox facestar4"><FaceStar4 /></div>
														<div className="facebox facestar5"><FaceStar5 /></div>
													</div>
													<div className='text-message'>{faceStarLable}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="modal-body">
									<div className="form-group ratingformgroup">
										<div className='rating-stars text-center'>
											<ul id='stars' className={faceStartValue}>
												{starRatingObj.map((star, sIndex) => (
													<li
														key={sIndex}
														onClick={() => starClicks(sIndex, star.star)}
														className={`star ${star.star <= rating ? 'selected' : ''}`}
														title={star.title}
														data-value={star.star}
													>
														{IconComponent ? <IconComponent /> : <StarBigIcon />}

													</li>
												))}
												<input type='hidden' id='review_rating' name='rating' value={rating} />
											</ul>

										</div>
									</div>
								</div>
								<div className="modal-footer">

									<button onClick={(e) => nextStep(2)} disabled={rating == 0 ? true : false} type="button" className="revbtn outline lightbtn nextbtn">{translations.next_link} <LongArrowRight /></button>

								</div>
							</div>
						}


						{currentStep == 2 &&
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
												<>
													<div className="listbox">
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
												</>
											))}




										</div>
										<input type="hidden" name="file_objects" id="file_objects" />
									</div>
								</div>
								<div className="modal-footer">
									<a onClick={(e) => prevStep(1)} className="revbtn outline lightbtn backbtn"><LongArrowLeft /> {translations.back_link}</a>
									<a onClick={(e) => nextStep(3)} className="revbtn outline lightbtn nextbtn">{translations.next_link} <LongArrowRight /></a>
								</div>
							</div>
						}


						{customQuestionsDataObj.map((customQuestionItem, qIndex) => (
							currentStep === qIndex + 3 && (

								<div className={`reviewsteps step-${qIndex + 3} `} key={qIndex}>
									<div className="modal-header">
										<div className="flxflexi">
											<h1 className="modal-title">{languageContent('questionTitle')}</h1>
											<div className="subtextbox">{languageContent('questionSubTitle')}</div>
										</div>
									</div>
									<div className="modal-body">
										<div className="popupquestionswrap">
											<h4>{customQuestionItem.question}</h4>
											<input type="hidden" name={"questions[" + qIndex + "][question_id]"} value={customQuestionItem._id} />
											<input type="hidden" name={"questions[" + qIndex + "][question_name]"} value={customQuestionItem.question} />
											<div className="answers_wrap">
												{customQuestionItem.answers.map((answerItems, aIndex) =>
													<div className="anserbox" key={aIndex} >
														<input type="radio" checked={customQuestionItem.answer == answerItems.val ? "checked" : ""} onChange={(e) => answerChecked(answerItems.val, qIndex)} className="check-answer" id={"answer" + qIndex + "_" + aIndex} value={answerItems.val} name={"questions[" + qIndex + "][answer]"} />
														<label htmlFor={"answer" + qIndex + "_" + aIndex} >
															<strong>{answerItems.val}</strong>
															<span className="flxfix"><CheckArrowIcon /></span>
														</label>
													</div>
												)}

											</div>
										</div>
									</div>
									<div className="modal-footer">
										<a onClick={(e) => prevStep(2 + qIndex)} className="revbtn outline lightbtn backbtn"><LongArrowLeft /> {translations.back_link}</a>
										{(customQuestionItem.isMakeRequireQuestion == false || customQuestionItem.answer) &&
											<a onClick={(e) => nextStep(qIndex + 4)} className={`revbtn outline lightbtn nextbtn ${customQuestionItem.isMakeRequireQuestion ? '' : ''}`} >{translations.next_link} <LongArrowRight /></a>
										}
									</div>
								</div>
							)
						))}

						{currentStep == (countTotalQuestions + 3) &&
							<div className={`reviewsteps step-${countTotalQuestions + 3} `}>
								<div className="modal-header">
									<div className="flxflexi">
										<h1 className="modal-title">{languageContent('reviewTextPageTitle')}</h1>
										<div className="subtextbox">{languageContent('reviewTextPageSubTitle')}</div>
									</div>
								</div>
								<div className="modal-body">
									<div className="tellusmorepopup_wrap">
										<div className="form-group">
											<textarea
												onChange={changeReviewDescription}
												className="form-control review-description"
												name="description"
												placeholder={languageContent('reviewTextPagePlaceholder')}
												value={reviewDescription}
											></textarea>

										</div>

									</div>
								</div>
								<div className="modal-footer">
									<a onClick={(e) => prevStep(countTotalQuestions + 2)} className="revbtn outline lightbtn backbtn"><LongArrowLeft /> {translations.back_link}</a>

									<button onClick={(e) => nextStep(countTotalQuestions + 4)} disabled={reviewDescription ? false : true} type="button" className="revbtn outline lightbtn nextbtn">{translations.next_link} <LongArrowRight /></button>

								</div>
							</div>
						}
						{currentStep == (countTotalQuestions + 4) &&
							<div className={`reviewsteps step-${countTotalQuestions + 4}`}>
								<div className="modal-header">
									<div className="flxflexi">
										<h1 className="modal-title">{languageContent('reviewFormTitle')}</h1>
										<div className="subtextbox">{languageContent('reviewFormSubTitle')}</div>
									</div>
								</div>
								<div className="modal-body">
									<div className="tellmeaboutyou_wrap">
										<div className="row">
											<div className="col-lg-6">
												<div className="form-group">

													<label htmlFor="">{translations.first_name}<span className="text-danger" >*</span> </label>
													<input type="text" onChange={changeFirstName} className="form-control" name="first_name" id="first_name" placeholder={translations.first_name_placeholder} value={firstName} />

													{errors.firstName && <div className="error text-danger">{errors.firstName}</div>}

												</div>
											</div>
											<div className="col-lg-6">
												<div className="form-group">
													<label htmlFor="">{translations.last_name} <span className="text-danger" >*</span></label>
													<input type="text" onChange={changeLastName} className="form-control" name="last_name" id="last_name" placeholder={translations.last_name_placeholder} value={lastName} />
													{errors.lastName && <div className="error text-danger">{errors.lastName}</div>}


												</div>
											</div>
											<div className="col-lg-12">
												<div className="form-group">
													<label htmlFor="">{translations.email_address} <span className="text-danger" >*</span></label>
													<input type="email" readOnly onChange={changeEmail} className="form-control" name="email" id="emailfield" placeholder={translations.email_address_placeholder} value={email} />
													{errors.email && <div className="error text-danger">{errors.email}</div>}

												</div>
											</div>
											<div className="col-lg-12">
												<div className="formnote" dangerouslySetInnerHTML={{ __html: termsAndConditionHtml }}>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="modal-footer">
									<a onClick={(e) => prevStep(countTotalQuestions + 3)} className="revbtn lightbtn outline backbtn"><LongArrowLeft /> {translations.back_link}</a>
									<button onClick={submitReview} disabled={disableSubmitBtn} type="button" className="revbtn submitBtn">{languageContent('submitButtonTitle')} <LongArrowRight /></button>
								</div>
							</div>
						}

						{(currentStep == (countTotalQuestions + 5)) &&
							<>
								{thankyouHtmlContent ? (
									<div className="reviewsteps" dangerouslySetInnerHTML={{ __html: thankyouHtmlContent }} />
								) : (
									<div className={`reviewsteps step-${countTotalQuestions + 5}  thankyou-page`}>
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

export default ReviewRequestForm;
