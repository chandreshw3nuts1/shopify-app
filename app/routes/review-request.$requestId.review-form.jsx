import { useLoaderData } from "@remix-run/react";
import settingsJson from './../utils/settings.json';
import { useState, useCallback, useEffect } from "react";
import { getCustomQuestions } from './../utils/common';
import StarBigIcon from "./components/icons/StarBigIcon";
import LongArrowRight  from "./components/icons/LongArrowRight";
import LongArrowLeft from "./components/icons/LongArrowLeft";
import AddImageIcon from "./components/icons/AddImageIcon";
import ImageFilledIcon from "./components/icons/ImageFilledIcon";
import CheckArrowIcon from "./components/icons/CheckArrowIcon";
import DeleteIcon from "./components/icons/DeleteIcon";

import FaceStar1 from "./components/images/FaceStar1";
import FaceStar2 from "./components/images/FaceStar2";
import FaceStar3 from "./components/images/FaceStar3";
import FaceStar4 from "./components/images/FaceStar4";
import FaceStar5 from "./components/images/FaceStar5";
import shopDetails from "./models/shopDetails";
import manualReviewRequests from './models/manualReviewRequests';
import manualRequestProducts from './models/manualRequestProducts';


export const links = () => {
	const stylesUrl = `${settingsJson.host_url}/app/styles/reviewRequest.css`;
	return [{ rel: "stylesheet", href: stylesUrl }];
};

export const loader = async ({ params, request }) => {
	try{
		const { requestId } = params;
		const url = new URL(request.url);
		const requestIdQuery = url.searchParams.get("requestId");
	
		const manualRequestProductsModel = await manualRequestProducts.findById( requestId);
	
		let manualReviewRequestsModel, shopRecords = null;
		let customQuestionsData = [];
		if(manualRequestProductsModel) {
			manualReviewRequestsModel = await manualReviewRequests.findById(manualRequestProductsModel.manual_request_id);
			
			shopRecords = await shopDetails.findById(manualReviewRequestsModel.shop_id);
	
			customQuestionsData = await getCustomQuestions({
				shop_id: shopRecords._id,
			});
		}
	
	
	  return { requestId, requestIdQuery, shopRecords, customQuestionsData, manualRequestProductsModel, manualReviewRequestsModel};
	
	}catch(error){
		console.log(error);
	}
	return {};

};

const ReviewRequestForm = () => {
	const { requestId, requestIdQuery, shopRecords, customQuestionsData, manualRequestProductsModel, manualReviewRequestsModel } = useLoaderData();
	if(!manualRequestProductsModel) {
		return 'Page Not Found';
	}

	const [faceStartValue, setFaceStartValue] = useState("");
	const [faceStarLable, setFaceStarLable] = useState("Please provide star rating");
	const [rating, setRating] = useState(0); 
	const [currentStep, setCurrentStep] = useState(0);
	const [reviewDescription, setReviewDescription] = useState('');
	const [customQuestionsDataObj, setCustomQuestionsDataObj] = useState(customQuestionsData);
	
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');
	const [email, setEmail] = useState('');
	const [errors, setErrors] = useState({});
	const [disableSubmitBtn, setDisableSubmitBtn] = useState(false);

	const [files, setFiles] = useState([]);
	const [previews, setPreviews] = useState([]);
	const [noOFfileUploadErr, setNoOFfileUploadErr] = useState(false);
	const [uploadedDocuments, setUploadedDocuments] = useState([]);
	const shopUrl = "https://"+shopRecords.shop;
	const countTotalQuestions = customQuestionsData.length;

	useEffect(() => {
		if(manualRequestProductsModel.status == 'sent' ) {
			setCurrentStep(1);
		} else {
			setCurrentStep(countTotalQuestions+5);
		}
    }, []);

	
	const starRatingObj = [
		{"star" : 1 , "title" : "Terrible!"},
		{"star" : 2 , "title" : "Bad!"},
		{"star" : 3 , "title" : "Okay!"},
		{"star" : 4 , "title" : "Good Product!"},
		{"star" : 5 , "title" : "Awesome Product!"},
	];

	const starClicks = async (index, star) => {
		setFaceStartValue("star-"+star);
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
		
		if((event.target.value).trim() !=""){
			setReviewDescription(event.target.value);
		}
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
		const newProperties= {
			answer: answer,
		};

		setCustomQuestionsDataObj(customQuestionsDataObj.map((item, idx) =>
			idx === index 
			  ? { ...item, ...newProperties } 
			  : item
		  ));

		console.log(customQuestionsDataObj);
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
		if (totalFiles > 5 ) {
			setNoOFfileUploadErr(true);
			
		} else {

			setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
			
			const newPreviews = selectedFiles.map((file) => {
				const url = URL.createObjectURL(file);
				return { url, type: file.type };

			});

			for (const file of selectedFiles) {
				const formData = new FormData();
				formData.append('image_and_videos[]', file);
				formData.append('actionType', "uploadDocuments");
				try {
					const response = await fetch('/api/product-review-widget', {
						method: 'POST',
						body: formData,
					});
					const data = await response.json();
					setUploadedDocuments(prevUploadedFiles => [...prevUploadedFiles, ...data]);

				} catch (error) {
					console.error('Error uploading file:', error);
				}
			}

			setPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
		}
	};

	const deleteDocument = async (index) => {
		console.log(index);
		console.log(uploadedDocuments);
		const deletedUrl = uploadedDocuments[index];
		const formData = new FormData();
		formData.append('deleteFileName', deletedUrl);
		formData.append('actionType', "deleteDocuments");
		try {
			const response = await fetch('/api/product-review-widget', {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			setUploadedDocuments(uploadedDocuments.filter((item, i) => i !== index));
			setPreviews(previews.filter((item, i) => i !== index));
			setFiles(files.filter((item, i) => i !== index));
			console.log(uploadedDocuments);
			console.log(files);
		} catch (error) {
			console.error('Error uploading file:', error);
		}
	}
	

	const submitReview = async () => {
		const validationErrors = validate();

		console.log(validationErrors);
		console.log(Object.keys(validationErrors));
		if (validationErrors.firstName == '' && validationErrors.lastName == '' && validationErrors.email == '' ) {
			const formData = new FormData();
			formData.append('first_name', firstName);
			formData.append('last_name', lastName);
			formData.append('email', email);
			formData.append('shop_domain', shopRecords.shop);
			formData.append('product_id', manualRequestProductsModel.product_id);
			formData.append('rating', rating);
			formData.append('file_objects', uploadedDocuments);
			formData.append('description', reviewDescription);
			formData.append('requestId', requestId);
			
			customQuestionsDataObj.forEach((item, index) => { 
				if(item.answer !="" && typeof item.answer != 'undefined' ) {
					formData.append(`questions[${index}][question_id]`, item._id);
					formData.append(`questions[${index}][answer]`, item.answer);
					formData.append(`questions[${index}][question_name]`, item.question);
				}
			});
			setDisableSubmitBtn(true);
			await fetch('/api/product-review-widget', {
				method: 'POST',
				body: formData,
			});
			setCurrentStep(countTotalQuestions+5);
		} else {
		  	setErrors(validationErrors);
		}

	}
	const paramObj = {
		cust_first_name : "",
		cust_last_name : "",
		cust_email : "",
	}
	
	return (
    <>
		<div className="review-content">
			<div className="modal_step_wrap">
				<form  method="post" className="popupform" id="review_submit_btn_form">
					{ currentStep == 1	&&
						<div className="reviewsteps step-1">
							<div className="modal-header">
								<div className="flxflexi">
									<h1 className="modal-title">Create Review</h1>
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
											<StarBigIcon />
											</li>
										))}
										<input type='hidden' id='review_rating' name='rating' value={rating} />
										</ul>
										
									</div>
								</div>
							</div>
							<div className="modal-footer">
							{ rating > 0 && <a onClick={(e) => nextStep(2)} className="revbtn lightbtn nextbtn">Next <LongArrowRight /></a> }
							</div>
						</div>
					}
					
					
					{ currentStep == 2	&&	
						<div className="reviewsteps step-2 ">
							<div className="modal-header">
								<div className="flxflexi">
									<h1 class="modal-title">Show it off</h1>
									<div className="subtextbox">We'd love to see it in action.</div>
								</div>
							</div>
							<div className="modal-body">
								<div className="filesupload_wrap">
									<label class="form__container" id="upload-container">
										{files.length == 0 &&
											<>
												<div className="iconimage">
													<AddImageIcon />
												</div>
												<div className="simpletext">Drag &amp; Drop image or video Files</div>
												<div className="orbox flxrow">
													<span>OR</span>
												</div>
											</>
										}
										<div className="btnwrap">
											<span className="revbtn">
												<ImageFilledIcon />
												Add Photos or Videos
											</span>
										</div>
										<input onChange={handleFileChange} class="form__file" name="image_and_videos[]" id="upload-files" type="file" accept="image/*,video/mp4,video/x-m4v,video/*" multiple="multiple" />
									</label>
									

									{noOFfileUploadErr && <div className="discountrow uploadDocError ">
										<div className="discountbox"><strong>You can select up to 5 photos</strong></div>
									</div>}
									<div className="discountrow">
										<div className="discountbox">Your <strong>15%</strong> off discount is wait for you!</div>
									</div>
									<div class="form__files-container" id="files-list-container">

									{previews.map((preview, index) => (
										<>
											<div class="listbox">
												<div class="form__image-container js-remove-image" data-index="' + index + '">
												{preview.type.startsWith('image') ? (
													<img className="form__image" src={preview.url} alt={`preview ${index}`} />
												) : (
													<video className="form__video" controls>
													<source src={preview.url} type="video/mp4" />
													</video>
												)}
						
												<div class="deleteicon" onClick={(e) => deleteDocument(index)}><DeleteIcon /> </div>
												</div>
											</div>
										</>
									))}


											

									</div>
									<input type="hidden" name="file_objects" id="file_objects" />
								</div>
							</div>
							<div className="modal-footer">
								<a onClick={(e) => prevStep(1)} className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
								<a onClick={(e) => nextStep(3)} className="revbtn lightbtn nextbtn">Next <LongArrowRight /></a>
							</div>
						</div>
					}


					{customQuestionsDataObj.map((customQuestionItem, qIndex) => (
						currentStep === qIndex + 3 && (
									
							<div className={`reviewsteps step-${qIndex+3} `} key={qIndex}>
								<div className="modal-header">
									<div className="flxflexi">
										<h1 className="modal-title">Question</h1>
										<div className="subtextbox">Please give us answer about your product.</div>
									</div>
								</div>
								<div className="modal-body">
									<div className="popupquestionswrap">
										<h4>{customQuestionItem.question}</h4>
										<input type="hidden" name= {"questions["+qIndex+"][question_id]"} value={customQuestionItem._id} />
										<input type="hidden" name= {"questions["+qIndex+"][question_name]"} value={customQuestionItem.question} />
										<div className="answers_wrap">
											{ customQuestionItem.answers.map((answerItems ,aIndex) => 
												<div className="anserbox" key={aIndex} >
													<input type="radio" checked={customQuestionItem.answer == answerItems.val ? "checked" : ""} onChange={(e) => answerChecked(answerItems.val, qIndex)} className="check-answer" id={"answer"+qIndex +"_"+aIndex} value={answerItems.val} name= {"questions["+qIndex +"][answer]"}  />
													<label htmlFor={"answer"+qIndex +"_"+aIndex} >
														<strong>{answerItems.val}</strong>
														<span className="flxfix"><CheckArrowIcon /></span>
													</label>
												</div>
											)}
											
										</div>
									</div>
								</div>
								<div className="modal-footer">
									<a onClick={(e) => prevStep(2+qIndex)} className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
									<a onClick={(e) => nextStep(qIndex + 4)}  className={`revbtn lightbtn nextbtn ${customQuestionItem.isMakeRequireQuestion ? '' : ''}`} >Next <LongArrowRight /></a>
								</div>
							</div>
						)
					))}

					{ currentStep == (countTotalQuestions+3)	&&	
						<div className={`reviewsteps step-${countTotalQuestions+3} `}>
							<div className="modal-header">
								<div className="flxflexi">
									<h1 className="modal-title">Tell us more!</h1>
									<div className="subtextbox">We'd love to see your thoughts about our product.</div>
								</div>
							</div>
							<div className="modal-body">
								<div className="tellusmorepopup_wrap">
									<div className="form-group">
									<textarea
										onChange={changeReviewDescription}
										className="form-control review-description"
										name="description"
										placeholder="Share your experience..."
										value={reviewDescription}
										></textarea>
										
									</div>
									<div className="discountrow">
										<div className="discountbox">Your <strong>15%</strong> off discount is wait for you!</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<a onClick={(e) => prevStep(countTotalQuestions+2)} className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
								{reviewDescription && <a onClick={(e) => nextStep(countTotalQuestions+4)} className="revbtn lightbtn nextbtn">Next <LongArrowRight /></a>}
							</div>
						</div>
					}
					{ currentStep == (countTotalQuestions+4)	&&	
						<div className={`reviewsteps step-${countTotalQuestions+4}`}>
							<div className="modal-header">
								<div className="flxflexi">
									<h1 className="modal-title">About you!</h1>
									<div className="subtextbox">Can we collect your information for improve our product.</div>
								</div>
							</div>
							<div className="modal-body">
								<div className="tellmeaboutyou_wrap">
									<div className="row">
										<div className="col-lg-6">
											<div className="form-group">

												<label htmlFor="">First name <span className="text-danger" >*</span> </label>
												<input type="text" onChange={changeFirstName} className="form-control" name="first_name" id="first_name" placeholder="Enter first name" value={firstName} />
												
												{errors.firstName && <div className="error text-danger">{errors.firstName}</div>}

											</div>
										</div>
										<div className="col-lg-6">
											<div className="form-group">
												<label htmlFor="">Last name <span className="text-danger" >*</span></label>
												<input type="text" onChange={changeLastName} className="form-control" name="last_name" id="last_name" placeholder="Enter last name" value={lastName} />
												{errors.lastName && <div className="error text-danger">{errors.lastName}</div>}
												

											</div>
										</div>
										<div className="col-lg-12">
											<div className="form-group">
												<label htmlFor="">Email address <span className="text-danger" >*</span></label>
												<input type="email" onChange={changeEmail} className="form-control" name="email" id="emailfield" placeholder="Enter email address" value={email} />
												{errors.email && <div className="error text-danger">{errors.email}</div>}


											</div>
										</div>
										<div className="col-lg-12">
											<div className="formnote">By submitting, I acknowledge the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> and that my review will be publicly posted and shared online</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<a onClick={(e) => prevStep(countTotalQuestions+3)} className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
								<button onClick={submitReview} disabled={disableSubmitBtn} type="button" className="revbtn submitBtn">Submit <LongArrowRight /></button>
							</div>
						</div>
					}

					{ (currentStep == (countTotalQuestions+5)) &&	
						<div className={`reviewsteps step-${countTotalQuestions+5}  thankyou-page`}>
							<div className="modal-header">
								<div className="flxflexi">
									<h1 className="modal-title">Thank you!</h1>
									<div className="subtextbox">Can we collect your information for improve our product.</div>
								</div>
							</div>
							<div className="modal-body">
								<div className="tellmeaboutyou_wrap">
									<div className="row">
										<div className="col-lg-12">
											<div className="formnote">Thank you</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<a href={shopUrl} className="revbtn lightbtn nextbtn" > Continue <LongArrowRight /></a>
							</div>
						</div>
					}
				</form>
			</div>
		</div>
    </>
  );
};

export default ReviewRequestForm;