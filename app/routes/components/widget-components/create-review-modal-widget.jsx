import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { Image } from "@shopify/polaris";

import CloseIcon from "../icons/CloseIcon";
import StarBigIcon from "../icons/StarBigIcon";
import LongArrowRight  from "../icons/LongArrowRight";
import LongArrowLeft from "../icons/LongArrowLeft";
import AddImageIcon from "../icons/AddImageIcon";
import ImageFilledIcon from "../icons/ImageFilledIcon";
import CheckArrowIcon from "../icons/CheckArrowIcon";

import FaceStar1 from "../images/FaceStar1";
import FaceStar2 from "../images/FaceStar2";
import FaceStar3 from "../images/FaceStar3";
import FaceStar4 from "../images/FaceStar4";
import FaceStar5 from "../images/FaceStar5";

const CreateReviewModalWidget = ({shopRecords}) => {
    const proxyUrl = "https://"+shopRecords.shop+"/apps/custom-proxy/product-review-widget";
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
                            <div className="reviewsteps step-1">
                                <div className="modal-header">
                                    <div className="flxflexi">
                                        <h1 class="modal-title">Create Review</h1>
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
                                                    <StarBigIcon />
                                                </li>
                                                <li className='star' title='Fair' data-value='2'>
                                                    <StarBigIcon />
                                                </li>
                                                <li className='star' title='Good' data-value='3'>
                                                    <StarBigIcon />
                                                </li>
                                                <li className='star' title='Excellent' data-value='4'>
                                                    <StarBigIcon />
                                                </li>
                                                <li className='star' title='WOW!!!' data-value='5'>
                                                    <StarBigIcon />
                                                </li>
                                            </ul>
                                        </div>
                                        
                                    </div>
                                    {/*
                                    <button type="submit" id="review_submit_btn" className="btn btn-primary">Submit Review</button> */}
                                </div>
                                <div className="modal-footer">
                                    {/* <button type="button" className="revbtn lightbtn" data-bs-dismiss="modal">Close</button> */}
                                    <a href="#" className="revbtn lightbtn nextbtn">Next <LongArrowRight /></a>
                                    {/* <button type="button" id="review_submit_btn" className="revbtn lightbtn">Next <LongArrowRight /></button> */}
                                </div>
                            </div>
                            <div className="reviewsteps step-2 d-none">
                                <div className="modal-header">
                                    <div className="flxflexi">
                                        <h1 class="modal-title">Show it off</h1>
                                        <div className="subtextbox">We'd love to see it in action.</div>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <div className="filesupload_wrap">
                                        <label class="form__container" id="upload-container">
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
                                            <input class="form__file" id="upload-files" type="file" accept="image/*,video/mp4,video/x-m4v,video/*" multiple="multiple" />
                                        </label>
                                        <div className="discountrow">
                                            <div className="discountbox">Your <strong>15%</strong> off discount is wait for you!</div>
                                        </div>
                                        <div class="form__files-container" id="files-list-container"></div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
                                    <a href="#" className="revbtn lightbtn nextbtn">Next <LongArrowRight /></a>
                                </div>
                            </div>
                            <div className="reviewsteps step-3 d-none">
                                <div className="modal-header">
                                    <div className="flxflexi">
                                        <h1 class="modal-title">Question</h1>
                                        <div className="subtextbox">Please give us answer about your product.</div>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <div className="popupquestionswrap">
                                        <h4>How’s our product is?</h4>
                                        <div className="answers_wrap">
                                            <div className="anserbox">
                                                <input type="radio" id="q1answer1" value="q1ans1" name="q1answers" />
                                                <label htmlFor="q1answer1">
                                                    <strong>Answer 01</strong>
                                                    <span className="flxfix"><CheckArrowIcon /></span>
                                                </label>
                                            </div>
                                            <div className="anserbox">
                                                <input type="radio" id="q1answer2" value="q1ans2" name="q1answers" />
                                                <label htmlFor="q1answer2">
                                                    <strong>Answer 02</strong>
                                                    <span className="flxfix"><CheckArrowIcon /></span>
                                                </label>
                                            </div>
                                            <div className="anserbox">
                                                <input type="radio" id="q1answer3" value="q1ans3" name="q1answers" />
                                                <label htmlFor="q1answer3">
                                                    <strong>Answer 03</strong>
                                                    <span className="flxfix"><CheckArrowIcon /></span>
                                                </label>
                                            </div>
                                            <div className="anserbox">
                                                <input type="radio" id="q1answer4" value="q1ans4" name="q1answers" />
                                                <label htmlFor="q1answer4">
                                                    <strong>Answer 04</strong>
                                                    <span className="flxfix"><CheckArrowIcon /></span>
                                                </label>
                                            </div>
                                            <div className="anserbox">
                                                <input type="radio" id="q1answer5" value="q1ans5" name="q1answers" />
                                                <label htmlFor="q1answer5">
                                                    <strong>Answer 05</strong>
                                                    <span className="flxfix"><CheckArrowIcon /></span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
                                    <a href="#" className="revbtn lightbtn nextbtn">Next <LongArrowRight /></a>
                                </div>
                            </div>
                            <div className="reviewsteps step-4 d-none">
                                <div className="modal-header">
                                    <div className="flxflexi">
                                        <h1 class="modal-title">Tell us more!</h1>
                                        <div className="subtextbox">We'd love to see your thoughts about our product.</div>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <div className="tellusmorepopup_wrap">
                                        <div className="form-group">
                                            <textarea className="form-control" placeholder="Share your experience..."></textarea>
                                        </div>
                                        <div className="discountrow">
                                            <div className="discountbox">Your <strong>15%</strong> off discount is wait for you!</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <a href="#" className="revbtn lightbtn backbtn"><LongArrowLeft /> Back</a>
                                    <a href="#" className="revbtn lightbtn nextbtn">Next <LongArrowRight /></a>
                                </div>
                            </div>
                            <div className="reviewsteps step-5 d-none">
                                <div className="modal-header">
                                    <div className="flxflexi">
                                        <h1 class="modal-title">About you!</h1>
                                        <div className="subtextbox">Can we collect your information for improve our product.</div>
                                    </div>
                                </div>
                                <div className="modal-body">
                                    <div className="tellmeaboutyou_wrap">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <label htmlFor="">First name</label>
                                                    <input type="text" className="form-control" placeholder="Enter first name" />
                                                </div>
                                            </div>
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <label htmlFor="">Last name</label>
                                                    <input type="text" className="form-control" placeholder="Enter last name" />
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="form-group">
                                                    <label htmlFor="">Email address</label>
                                                    <input type="text" className="form-control" placeholder="Enter email address" />
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
                                    <button type="submit" className="revbtn">Submit <LongArrowRight /></button>
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
