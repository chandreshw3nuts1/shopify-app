import { useEffect, useState, useCallback } from "react";

import CloseIcon from "../icons/CloseIcon";
import StarBigIcon from "../icons/StarBigIcon";
import LongArrowRight from "../icons/LongArrowRight";
import LongArrowLeft from "../icons/LongArrowLeft";
import AddImageIcon from "../icons/AddImageIcon";
import ImageFilledIcon from "../icons/ImageFilledIcon";
import CheckArrowIcon from "../icons/CheckArrowIcon";
import ShareIcon from "../icons/ShareIcon";
import CopyIcon from "../icons/CopyIcon";
import RecordVideoIcon from "../icons/RecordVideoIcon";

import FaceStar1 from "../images/FaceStar1";
import FaceStar2 from "../images/FaceStar2";
import FaceStar3 from "../images/FaceStar3";
import FaceStar4 from "../images/FaceStar4";
import FaceStar5 from "../images/FaceStar5";

import settingsJson from './../../../utils/settings.json';


const CreateReviewModalWidget = ({ shopRecords, customQuestionsData, paramObj, generalAppearancesModel, CommonRatingComponent, otherProps }) => {
    const { reviewFormSettingsModel, languageWiseReviewFormSettings, translations, productReviewWidgetCustomizesModel, languageWiseProductWidgetSettings, generalSettingsModel } = otherProps;
    const proxyUrl = "https://" + shopRecords.shop + "/apps/w3-proxy/product-review-widget";
    const countTotalQuestions = customQuestionsData.length;


    const languageContent = (type) => {
        if (type && languageWiseReviewFormSettings && languageWiseReviewFormSettings[type] !== undefined && languageWiseReviewFormSettings[type] !== '') {
            return languageWiseReviewFormSettings[type];
        } else {
            return translations.reviewFormSettings[type];
        }
    }

    let discountHtml = "";

    if (paramObj?.discountObj && Object.keys(paramObj.discountObj).length > 0) {
        if (paramObj.discountObj.isSameDiscount) {
            discountHtml = languageContent('addReviewSameDiscountText').replace(/\[discount\]/g, paramObj.discountObj.discount);
        } else {
            discountHtml = languageContent('addReviewDifferentDiscountText');
            discountHtml = discountHtml.replace(/\[photo_discount\]/g, paramObj.discountObj.photoDiscount);
            discountHtml = discountHtml.replace(/\[video_discount\]/g, paramObj.discountObj.videoDiscount);

        }
    }

    let termsServiceLink = "#";
    let privacyPolicyLink = "#";
    let termsAndConditionHtml = translations.termsAndConditions;
    termsAndConditionHtml = termsAndConditionHtml.replace(/\[terms_service\]/g, termsServiceLink);
    termsAndConditionHtml = termsAndConditionHtml.replace(/\[privacy_policy\]/g, privacyPolicyLink);
    const themeColor = reviewFormSettingsModel?.themeColor ? reviewFormSettingsModel?.themeColor : `#${settingsJson.reviewFormSettings.themeColor}`;
    const themeTextColor = reviewFormSettingsModel?.themeTextColor ? reviewFormSettingsModel?.themeTextColor : `#${settingsJson.reviewFormSettings.themeTextColor}`;
    const cornerRadius = reviewFormSettingsModel?.cornerRadius ? reviewFormSettingsModel?.cornerRadius : generalAppearancesModel.cornerRadius;

    return (
        <>
            <style>
                {`
					.theme-color-class {
						background-color: ${themeColor} !important;
                        color : ${themeTextColor} !important;
					}
                    .modal .modal-content {
						border-radius : ${cornerRadius}px !important;
					}
					
				`}
            </style>
            <div id="createReviewModal" className="modal fade addreviewpopup" data-bs-backdrop="static">
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
                                            <h1 className="modal-title">{languageContent('ratingPageTitle')}</h1>
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
                                                        <div className='text-message'>{languageContent('ratingPageSubTitle')}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <div className="form-group ratingformgroup">
                                            <div className='rating-stars text-center'>
                                                <ul id='stars'>
                                                    <li className='star' title={languageContent('oneStarsRatingText')} data-value='1'>
                                                        {CommonRatingComponent ? <CommonRatingComponent /> : null}
                                                    </li>
                                                    <li className='star' title={languageContent('twoStarsRatingText')} data-value='2'>
                                                        {CommonRatingComponent ? <CommonRatingComponent /> : null}
                                                    </li>
                                                    <li className='star' title={languageContent('threeStarsRatingText')} data-value='3'>
                                                        {CommonRatingComponent ? <CommonRatingComponent /> : null}
                                                    </li>
                                                    <li className='star' title={languageContent('fourStarsRatingText')} data-value='4'>
                                                        {CommonRatingComponent ? <CommonRatingComponent /> : null}
                                                    </li>
                                                    <li className='star' title={languageContent('fiveStarsRatingText')} data-value='5'>
                                                        {CommonRatingComponent ? <CommonRatingComponent /> : null}
                                                    </li>
                                                    <input type="hidden" id="review_rating" name="rating" value="3" />
                                                </ul>
                                            </div>

                                        </div>

                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="revbtn lightbtn nextbtn" disabled="disabled">{translations.next_link}<LongArrowRight /></button>
                                    </div>
                                </div>
                                <div className="reviewsteps step-2 d-none">
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
                                                    <div className="iconimage">
                                                        <AddImageIcon />
                                                    </div>
                                                    <div className="simpletext">{generalSettingsModel.is_enabled_video_review ? languageContent('dragDropPhotoVideoText') : languageContent('dragDropPhotoText')}</div>
                                                    <div className="orbox flxrow">
                                                        <span>OR</span>
                                                    </div>
                                                    <div className="btnwrap">
                                                        <span className="revbtn w3revbtnblock">
                                                            <ImageFilledIcon />
                                                            {generalSettingsModel.is_enabled_video_review ? languageContent('addPhotoVideoButtonText') : languageContent('addPhotoButtonText')}
                                                        </span>
                                                        <span className="revbtn w3loadingblock d-none">
                                                            <div id="loading-icon" class="loading-icon">
                                                                <i class="fas fa-spinner fa-spin"></i> {translations.reviewFormSettings.uploadingFiles}
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <input className="form__file" name="image_and_videos[]" id="upload-files" type="file" accept={generalSettingsModel.is_enabled_video_review ? 'image/*,video/mp4,video/x-m4v,video/*' : 'image/*'} multiple="multiple" />
                                                </label>
                                                <div className="record_video" id="showRecordVideoModal">
                                                    <RecordVideoIcon /> Rec
                                                </div>
                                            </div>
                                            <div className="discountrow uploadDocError d-none">
                                                <div className="discountbox"><strong>{generalSettingsModel.is_enabled_video_review ? translations.reviewFormSettings.maxFivePhotoVideoError : translations.reviewFormSettings.maxFivePhotoError}</strong></div>
                                            </div>

                                            <div className="discountrow uploadDocSizeError d-none">
                                                <div className="discountbox"><strong>{ translations.reviewFormSettings.uploadMediaSizeError}</strong></div>
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
                                        <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> {translations.back_link}</a>
                                        <a href="#" className="revbtn lightbtn nextbtn">{translations.next_link}<LongArrowRight /></a>
                                    </div>
                                </div>

                                {customQuestionsData.map((customQuestionItem, qIndex) =>
                                    <div className={`reviewsteps step-${qIndex + 3} d-none`} key={qIndex}>
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
                                            <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> {translations.back_link}</a>
                                            <a href="#" className={`revbtn lightbtn nextbtn ${customQuestionItem.isMakeRequireQuestion ? 'd-none' : ''}`} >{translations.next_link}<LongArrowRight /></a>
                                        </div>
                                    </div>
                                )}


                                <div className={`reviewsteps step-${countTotalQuestions + 3} d-none`}>
                                    <div className="modal-header">
                                        <div className="flxflexi">
                                            <h1 className="modal-title">{languageContent('reviewTextPageTitle')}</h1>
                                            <div className="subtextbox">{languageContent('reviewTextPageSubTitle')}</div>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <div className="tellusmorepopup_wrap">
                                            <div className="form-group">
                                                <textarea className="form-control review-description" name="description" placeholder={languageContent('reviewTextPagePlaceholder')}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> {translations.back_link}</a>
                                        <button type="button" className="revbtn lightbtn nextbtn" disabled="disabled">{translations.next_link}<LongArrowRight /></button>
                                    </div>
                                </div>
                                <div className={`reviewsteps step-${countTotalQuestions + 4} d-none`}>
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
                                                        <label htmlFor="">{translations.first_name} <span className="text-danger" >*</span> </label>
                                                        <input type="text" className="form-control" name="first_name" id="first_name" placeholder={translations.first_name_placeholder} defaultValue={paramObj.cust_first_name} />
                                                        <div className="error text-danger" id="firstNameError"></div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label htmlFor="">{translations.last_name} <span className="text-danger" >*</span></label>
                                                        <input type="text" className="form-control" name="last_name" id="last_name" placeholder={translations.last_name_placeholder} defaultValue={paramObj.cust_last_name} />
                                                        <div className="error text-danger" id="lastNameError"></div>

                                                    </div>
                                                </div>
                                                <div className="col-lg-12">
                                                    <div className="form-group">
                                                        <label htmlFor="">{translations.email_address} <span className="text-danger" >*</span></label>
                                                        <input type="email" className="form-control" name="email" id="emailfield" placeholder={translations.email_address_placeholder} defaultValue={paramObj.cust_email} />
                                                        <div className="error text-danger" id="emailError"></div>

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
                                        <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> {translations.back_link}</a>
                                        <button type="submit" className="revbtn submitBtn">{languageContent('submitButtonTitle')} <LongArrowRight /></button>
                                    </div>
                                </div>
                                <div id="thankyou-page-content" className="reviewsteps d-none">

                                </div>
                                {/* <div className={`reviewsteps step-${countTotalQuestions + 5} d-none thankyou-page`}>
                                    <div className="modal-header">
                                        <div className="flxflexi">
                                            <h1 className="modal-title">Thank you!</h1>
                                            <div className="subtextbox">Your review was submitted.</div>
                                        </div>
                                    </div>
                                    <div className="modal-body">
                                        <div className="thankyoubody">
                                            <div className="sharewithfriends">
                                                <a href="#">
                                                    <span className="flxfix"><ShareIcon /></span>
                                                    <strong className="flxflexi">Share with friends and groups, they'll get <b>14%</b> of their first purchase</strong>
                                                </a>
                                            </div>
                                            <div className="copycodewrap">
                                                <div className="textline">Use this following discount code for $8 off your next purchase!</div>
                                                <div className="discountcodebox">
                                                    <div className="codebox">LX-72CNLL</div>
                                                    <div className="copybtn">
                                                        <a href="#"><CopyIcon /></a>
                                                    </div>
                                                </div>
                                                <div className="textline">We'll also send it by email</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <a href="#" className="revbtn lightbtn nextbtn continueBtn">{languageContent('continueButtonTitle')} <LongArrowRight /></a>
                                    </div>
                                </div> */}
                            </form>
                        </div>
                    </div>
                </div>
                {/* <div className="custom-review-modal-content">
                
            </div> */}
            </div>
            {/* <div id="createReviewModal" className="custom-review-modal" >
            
        </div> */}


            <div id="record_review_video_modal" style={{ zIndex: "2147483647" }} className="modal fade addreviewpopup" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <CloseIcon />
                        </button>
                        <div className="modal_step_wrap">
                            <div className="reviewsteps activestep step-1">
                                <div className="modal-header">
                                    <div className="flxflexi">
                                        <h1 className="modal-title">{translations.recordingVideoTitle}</h1>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <div className="recordvideo_wrap">
                                        <div className="form-group">
                                            <div className="recvideobox">
                                                <video id="record_video_el" autoPlay={true}></video>
                                            </div>
                                            <div className="btnwrap justify-content-center">
                                                <button type="button" className="revbtn" id="stopVideoRecording" >{translations.stopRecordingBtnText}</button>
                                                <button type="button" className="revbtn " id="startVideoRecording" >{translations.startRecordingBtnText}</button>
                                                <button type="button" className="revbtn" id="submitVideoRecording">{translations.submitRecordingBtnText}</button>
                                                <button type="button" className="revbtn" id="uploadingVideoRecording">{translations.uploadingRecordingBtnText}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </>

    );

}

export default CreateReviewModalWidget;
