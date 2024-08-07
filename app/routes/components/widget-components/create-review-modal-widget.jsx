import { useEffect, useState, useCallback } from "react";

import CloseIcon from "../icons/CloseIcon";
import StarBigIcon from "../icons/StarBigIcon";
import LongArrowRight from "../icons/LongArrowRight";
import LongArrowLeft from "../icons/LongArrowLeft";
import AddImageIcon from "../icons/AddImageIcon";
import ImageFilledIcon from "../icons/ImageFilledIcon";
import CheckArrowIcon from "../icons/CheckArrowIcon";

import FaceStar1 from "../images/FaceStar1";
import FaceStar2 from "../images/FaceStar2";
import FaceStar3 from "../images/FaceStar3";
import FaceStar4 from "../images/FaceStar4";
import FaceStar5 from "../images/FaceStar5";

const CreateReviewModalWidget = ({ shopRecords, customQuestionsData, paramObj, generalAppearancesModel, CommonRatingComponent, otherProps }) => {
	const {translations, productReviewWidgetCustomizesModel,languageWiseProductWidgetSettings } = otherProps;
    const proxyUrl = "https://" + shopRecords.shop + "/apps/custom-proxy/product-review-widget";
    const countTotalQuestions = customQuestionsData.length;
    let discountHtml = "";
    if (paramObj?.discountObj) {
        if (paramObj.discountObj.isSameDiscount) {
            discountHtml = translations.addReviewSameDiscountText.replace(/\[discount\]/g, paramObj.discountObj.discount);
        } else {
            discountHtml = translations.addReviewDifferentDiscountText;
            discountHtml = discountHtml.replace(/\[photo_discount\]/g, paramObj.discountObj.photoDiscount);
            discountHtml = discountHtml.replace(/\[video_discount\]/g, paramObj.discountObj.videoDiscount);

        }
    }

    return (
        <>
            <div id="createReviewModal" className="modal fade addreviewpopup">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <CloseIcon />
                        </button>
                        <div className="modal_step_wrap">
                            <form action={proxyUrl} method="post" className="popupform" id="review_submit_btn_form">
                                <div className="reviewsteps activestep step-1">
                                    <div className="modal-header">
                                        <div className="flxflexi">
                                            <h1 className="modal-title">Create Review</h1>
                                            <div className="subtextbox">
                                                <div className="success-box-wrap">
                                                    <div className='success-box'>
                                                        <div className="facewrap">
                                                            <div className="facebox facestar1"><FaceStar1 /></div>
                                                            <div className="facebox facestar2"><FaceStar2 /></div>
                                                            <div className="facebox facestar3"><FaceStar3 /></div>
                                                            <div className="facebox facestar4"><FaceStar4 /></div>
                                                            <div className="facebox facestar5"><FaceStar5 /></div>
                                                        </div>
                                                        <div className='text-message'>Please provide star rating</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group ratingformgroup">
                                            <div className='rating-stars text-center'>
                                                <ul id='stars'>
                                                    <li className='star' title='Poor' data-value='1'>
                                                        {CommonRatingComponent ? <CommonRatingComponent /> : null}
                                                    </li>
                                                    <li className='star' title='Fair' data-value='2'>
                                                        {CommonRatingComponent ? <CommonRatingComponent /> : null}
                                                    </li>
                                                    <li className='star' title='Good' data-value='3'>
                                                        {CommonRatingComponent ? <CommonRatingComponent /> : null}
                                                    </li>
                                                    <li className='star' title='Excellent' data-value='4'>
                                                        {CommonRatingComponent ? <CommonRatingComponent /> : null}
                                                    </li>
                                                    <li className='star' title='WOW!!!' data-value='5'>
                                                        {CommonRatingComponent ? <CommonRatingComponent /> : null}
                                                    </li>
                                                    <input type="hidden" id="review_rating" name="rating" value="3" />
                                                </ul>
                                            </div>

                                        </div>
                                        {/*
                                    <button type="submit" id="review_submit_btn" className="btn btn-primary">Submit Review</button> */}
                                    </div>
                                    <div className="modal-footer">
                                        {/* <button type="button" className="revbtn lightbtn" data-bs-dismiss="modal">Close</button> */}
                                        <button type="button" className="revbtn lightbtn nextbtn" disabled="disabled">Next <LongArrowRight /></button>
                                        {/* <button type="button" id="review_submit_btn" className="revbtn lightbtn">Next <LongArrowRight /></button> */}
                                    </div>
                                </div>
                                <div className="reviewsteps step-2 d-none">
                                    <div className="modal-header">
                                        <div className="flxflexi">
                                            <h1 className="modal-title">Show it off</h1>
                                            <div className="subtextbox">We'd love to see it in action.</div>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <div className="filesupload_wrap">
                                            <label className="form__container" id="upload-container">
                                                <div className="iconimage">
                                                    <AddImageIcon />
                                                </div>
                                                <div className="simpletext">Drag &amp; Drop image or video Files</div>
                                                <div className="orbox flxrow">
                                                    <span>OR</span>
                                                </div>
                                                <div className="btnwrap">
                                                    <span className="revbtn">
                                                        <ImageFilledIcon />
                                                        Add Photos or Videos
                                                    </span>
                                                </div>
                                                <input className="form__file" name="image_and_videos[]" id="upload-files" type="file" accept="image/*,video/mp4,video/x-m4v,video/*" multiple="multiple" />
                                            </label>

                                            <div className="discountrow uploadDocError d-none">
                                                <div className="discountbox"><strong>You can select up to 5 photos</strong></div>
                                            </div>
                                            {discountHtml &&
                                            <div className="discountrow">
                                                {/* <div className="discountbox">Your <strong>15%</strong> off discount is wait for you!</div> */}
                                                <div className="discountbox">{discountHtml}</div>
                                            </div>}

                                            <div className="form__files-container" id="files-list-container"></div>
                                            <input type="hidden" name="file_objects" id="file_objects" />
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
                                        <a href="#" className="revbtn lightbtn nextbtn">Next <LongArrowRight /></a>
                                    </div>
                                </div>

                                {customQuestionsData.map((customQuestionItem, qIndex) =>
                                    <div className={`reviewsteps step-${qIndex + 3} d-none`} key={qIndex}>
                                        <div className="modal-header">
                                            <div className="flxflexi">
                                                <h1 className="modal-title">Question</h1>
                                                <div className="subtextbox">Please give us answer about your product.</div>
                                            </div>
                                        </div>
                                        <div className="modal-body">
                                            <div className="popupquestionswrap">
                                                <h4>{customQuestionItem.question}</h4>
                                                <input type="hidden" name={"questions[" + qIndex + "][question_id]"} value={customQuestionItem._id} />
                                                <input type="hidden" name={"questions[" + qIndex + "][question_name]"} value={customQuestionItem.question} />
                                                <div className="answers_wrap">
                                                    {customQuestionItem.answers.map((answerItems, aIndex) =>
                                                        <div className="anserbox" key={aIndex}>
                                                            <input type="radio" className="check-answer" id={"answer" + qIndex + "_" + aIndex} value={answerItems.val} name={"questions[" + qIndex + "][answer]"} />
                                                            <label htmlFor={"answer" + qIndex + "_" + aIndex}>
                                                                <strong>{answerItems.val}</strong>
                                                                <span className="flxfix"><CheckArrowIcon /></span>
                                                            </label>
                                                        </div>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
                                            <a href="#" className={`revbtn lightbtn nextbtn ${customQuestionItem.isMakeRequireQuestion ? 'd-none' : ''}`} >Next <LongArrowRight /></a>
                                        </div>
                                    </div>
                                )}


                                <div className={`reviewsteps step-${countTotalQuestions + 3} d-none`}>
                                    <div className="modal-header">
                                        <div className="flxflexi">
                                            <h1 className="modal-title">Tell us more!</h1>
                                            <div className="subtextbox">We'd love to see your thoughts about our product.</div>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <div className="tellusmorepopup_wrap">
                                            <div className="form-group">
                                                <textarea className="form-control review-description" name="description" placeholder="Share your experience..."></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
                                        <button type="button" className="revbtn lightbtn nextbtn" disabled="disabled">Next <LongArrowRight /></button>                                    </div>
                                </div>
                                <div className={`reviewsteps step-${countTotalQuestions + 4} d-none`}>
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
                                                        <input type="text" className="form-control" name="first_name" id="first_name" placeholder="Enter first name" defaultValue={paramObj.cust_first_name} />
                                                        <div className="error text-danger" id="firstNameError"></div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label htmlFor="">Last name <span className="text-danger" >*</span></label>
                                                        <input type="text" className="form-control" name="last_name" id="last_name" placeholder="Enter last name" defaultValue={paramObj.cust_last_name} />
                                                        <div className="error text-danger" id="lastNameError"></div>

                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group">
                                                        <label htmlFor="">Email address <span className="text-danger" >*</span></label>
                                                        <input type="email" className="form-control" name="email" id="emailfield" placeholder="Enter email address" defaultValue={paramObj.cust_email} />
                                                        <div className="error text-danger" id="emailError"></div>

                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="formnote">By submitting, I acknowledge the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a> and that my review will be publicly posted and shared online</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
                                        <button type="submit" className="revbtn submitBtn">Submit <LongArrowRight /></button>
                                    </div>
                                </div>

                                <div className={`reviewsteps step-${countTotalQuestions + 5} d-none thankyou-page`}>
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
                                        <a href="#" className="revbtn lightbtn nextbtn continueBtn"><LongArrowRight /> Continue</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                {/* <div className="custom-review-modal-content">
                
            </div> */}
            </div>
            {/* <div id="createReviewModal" className="custom-review-modal" >
            
        </div> */}

        </>

    );

}

export default CreateReviewModalWidget;
