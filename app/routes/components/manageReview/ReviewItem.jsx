import { useState, useCallback } from "react";
import { formatDate, formatTimeAgo } from './../../../utils/dateFormat';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import settingsJson from './../../../utils/settings.json';

import NiceSelect from './../../../NiceSelect/NiceSelect';

import reviewImage from "./../../../images/no-reviews-yet.svg"
import customerImage from "./../../../images/customer-image.jpg"
import mailBlueIcon from "./../../../images/blue-mail-icon.svg"
import PublishedIcon from "../../../images/PublishedIcon";
import UnPublishedIcon from "../../../images/UnPublishedIcon";
import ReplyIcon from "../../../images/ReplyIcon";

import facebookSocial from "./../../../images/Facebook-Original.svg"
import redditSocial from "./../../../images/Reddit-Original.svg"
import twitterxicon from "./../../../images/twitter-x-icon.svg"
import pinterestSocial from "./../../../images/Pinterest-Original.svg"
import { Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap';
import ImageSlider from './ImageSlider';


import {
	Image
} from "@shopify/polaris";

export default function ReviewItem({ filteredReviews, setFilteredReviews, filteredReviewsTotal, setFilteredReviewsTotal, shopRecords, searchFormData, setSubmitHandle, submitHandle, setSearchFormData }) {
	const [showReplayModal, setShowReplayModal] = useState(false);
	const [replyText, setReplyText] = useState('');
	const [replyReviewId, setReplyReviewId] = useState('');
	const [replyReviewIndex, setReplyReviewIndex] = useState('');
	const [replyValueError, setReplyValueError] = useState(true);
	const [isUpdatingReply, setIsUpdatingReply] = useState(false);
	const [replyButtonText, setReplyButtonText] = useState('');
	const [replyHelpText, setReplyHelpText] = useState('');
	const handleCloseReplyModal = () => setShowReplayModal(false);
	
	const handleShowReplyModal = (review_id, index) => {
		setShowReplayModal(true);
		setReplyReviewId(review_id);
		setReplyReviewIndex(index);
		setReplyButtonText('Add Reply');
		setReplyHelpText('This reply is public and will appear on reviews widget. We will send the reviewer a notification email.');
		setIsUpdatingReply(false);
	}

	const [showChangeProductModal, setShowChangeProductModal] = useState(false);
	const [changeProductIndex, setChangeProductIndex] = useState('');

	const handleCloseChangeProductModal = () => setShowChangeProductModal(false);
	const [changeProductReviewId, setChangeProductReviewId] = useState('');

	const handleShowChangeProductModal = (review_id, index) => {
		setShowChangeProductModal(true);
		setChangeProductReviewId(review_id);
		setChangeProductIndex(index);
	}
	const [changeProductValueError, setChangeProductValueError] = useState(true);
	const [changeProductHandle, setChangeProductHandle] = useState('');

	const handleShowChangeProduct = (event) => {
		const val = (event.target.value);
		setChangeProductHandle(val);
		setChangeProductValueError(false);
		if (val.trim() == "") {
			setChangeProductValueError(true);
		}
	};

	const handleReplyTextChange = (event) => {
		const val = (event.target.value);
		setReplyText(val);

		setReplyValueError(false);
		if (val.trim() == "") {
			setReplyValueError(true);
		}
	};

	const submitReply = async () => {

		const customParams = {
			review_id: replyReviewId,
			reply: replyText,
			actionType: "addReviewReply",
			subActionType: isUpdatingReply && "editReview"
		};
		const response = await fetch(`/api/manage-review`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(customParams)
		});
		const data = await response.json();
		if (data.status == 200) {
			toast.success(data.message, { autoClose: settingsJson.toasterCloseTime });
		} else {
			toast.error(data.message);
		}
		setReplyValueError(true);
		setReplyText('');
		setShowReplayModal(false);
		setFilteredReviews(filteredReviews.map((item, idx) =>
			idx === replyReviewIndex ? { ...item, replyText: replyText } : item
		));
	};


	const submitChangeProduct = async () => {
		 
		const customParams = {
			review_id: changeProductReviewId,
			changeProductHandle: changeProductHandle,
			actionType: "changeProductHandle",
			shop : shopRecords.shop,
		};
		const response = await fetch(`/api/manage-review`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(customParams)
		});
		const data = await response.json();
		if (data.status == 200) {
			toast.success(data.message, { autoClose: settingsJson.toasterCloseTime });
			setFilteredReviews(filteredReviews.map((item, idx) =>
				idx === changeProductIndex 
					? {
						...item, 
						productDetails: { 
						...item.productDetails, 
						title: data.updatedProductData.product_title, 
						handle: data.updatedProductData.product_url 
						} 
					}
					: item
			));
			setChangeProductHandle('');
			setShowChangeProductModal(false);
		} else {
			toast.error(data.message);
		}
		
	};

	
	const handleDeleteReviewItem = async (recordId, index) => {
		Swal.fire({
			title: 'Are you sure you want to delete this review?',
			text: "This action is irreversible, and the review will not be accessible again!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Delete'
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await fetch(`${settingsJson.host_url}/api/manage-review`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ "review_id": recordId })
					});

					const data = await response.json();
					if (data.status == 200) {
						toast.success(data.message, { autoClose: settingsJson.toasterCloseTime });
						setFilteredReviewsTotal(--filteredReviewsTotal);
						setFilteredReviews(filteredReviews.filter((item, i) => i !== index));

					} else {
						toast.error(data.message);
					}

				} catch (error) {
					console.error("Error deleting record:", error);
					// Handle error, show toast, etc.
					toast.error("Failed to delete record.");
				}
			}
		});
	};

	const handleRatingStatusChange = async (statusValue, index) => {
		const updateData = {
			actionType: "changeReviewStatus",
			value: statusValue,
			oid: filteredReviews[index]._id,
		};
		const response = await fetch('/api/manage-review', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData),
		});

		setFilteredReviews(filteredReviews.map((item, idx) =>
			idx === index ? { ...item, status: statusValue } : item
		));
	};

	const handleBuklRatingStatusChange = async (statusValue) => {


		Swal.fire({
			title: `Are you sure you want to ${statusValue} ${filteredReviewsTotal} reviews? `,
			text: "",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes'
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const updateData = {
						actionType: "bulkRatingStatus",
						subActionType: statusValue,
						searchFormData: searchFormData
					};
					const response = await fetch('/api/manage-review', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify(updateData),
					});
					const data = await response.json();

					if (data.status == 200) {
						toast.success(data.message, { autoClose: settingsJson.toasterCloseTime });
					} else {
						toast.error(data.message);
					}

					setSearchFormData((prevData) => ({
						...prevData,
						page: 1,
					}));
					setSubmitHandle(!submitHandle);

				} catch (error) {
					console.error("Error deleting record:", error);
					toast.error("Failed to delete record.");
				}
			}
		});
	};



	const handleShowEditReplyModal = (review_id, index) => {
		const reviewItem = filteredReviews[index];
		setReplyReviewId(review_id);
		setReplyText(reviewItem.replyText);
		setReplyValueError(false);
		setShowReplayModal(true);
		setReplyButtonText('Edit Reply');
		setReplyHelpText('This reply is public and will appear on reviews widget.');
		setIsUpdatingReply(true);
		setReplyReviewIndex(index);
	};

	const deleteReviewReply = (review_id, index) => {
		Swal.fire({
			title: 'Are you sure you want to delete your reply?',
			text: "This action is irreversible, and the review will not be accessible again!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Delete'
		}).then(async (result) => {
			if (result.isConfirmed) {
				try {
					const response = await fetch(`/api/manage-review`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ review_id: review_id, actionType: "addReviewReply", subActionType: "deleteReply", reply: '' })
					});
					const data = await response.json();
					if (data.status == 200) {
						toast.success(data.message, { autoClose: settingsJson.toasterCloseTime });
					} else {
						toast.error(data.message);
					}
					setReplyValueError(true);
					setReplyText('');
					setShowReplayModal(false);

					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, replyText: '' } : item
					));

				} catch (error) {
					console.error("Error deleting record:", error);
					toast.error("Failed to delete record.");
				}
			}
		});
	};


	const handleMoreReviewChange = async (statusValue, review_id, index) => {
		
		if(statusValue == 'delete'){
			handleDeleteReviewItem(review_id, index);
		} else if(statusValue == 'change-product'){
			handleShowChangeProductModal(review_id, index);
		} else {
			const updateData = {
				actionType: "moreOptionChange",
				subActionType: statusValue,
				review_id: review_id
			};
			const response = await fetch('/api/manage-review', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateData),
			});
			const data = await response.json();

			if (data.status == 200) {
				toast.success(data.message, { autoClose: settingsJson.toasterCloseTime });
				if(statusValue == 'feature') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, tag_as_feature: true } : item
					));
				} else if(statusValue == 'remove-feature') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, tag_as_feature: false } : item
					));
				} else if(statusValue == 'verify-badge') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, verify_badge: true } : item
					));
				} else if(statusValue == 'remove-verify-badge') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, verify_badge: false } : item
					));
				} else if(statusValue == 'add-to-carousel') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, add_to_carousel: true } : item
					));
				} else if(statusValue == 'remove-add-to-carousel') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, add_to_carousel: false } : item
					));
				}
				

			} else {
				toast.error(data.message);
			}
		}

	};

	

	const shareOnFacebook = () => {
		const url = shopRecords.shop; 
		const encodedUrl = encodeURIComponent(`https://${url}`);
		const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
		window.open(shareUrl, '_blank', 'width=600,height=400');
	}

	const shareOnTwitter = () => {
		const url = `https://${shopRecords.shop}`; 
		const text = "";
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
		window.open(twitterUrl, '_blank', 'width=600,height=400');

	};

	const shareOnPinterest = () => {
		const url = `https://${shopRecords.shop}`; 
		const image = "https://chandstest.myshopify.com/cdn/shop/files/shitr.jpg?v=1714996209";
		const description = "test";
		const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(description)}`;

		window.open(pinterestUrl, '_blank', 'width=600,height=400');
	};
	

	  
	

	const getTitle = (status) => {
		if (status === 'publish') {
		  	return <><PublishedIcon /> Published</>;
		} else if (status === 'unpublish'){
		  	return <><UnPublishedIcon /> Unpublished</>;
		} else {
			return <><UnPublishedIcon /> Pending</>;
		}
	};

	return (
		<>

			<div className="reviewlistblocks">
				<div className="topactions flxrow">
					<div className="reviewcounttop">
						<span>{filteredReviewsTotal}</span>Reviews found
					</div>
					{filteredReviewsTotal > 0 &&
						<div className="rightbox dropdownwrap ms-auto ddlightbtn">
							<DropdownButton id="dropdown-basic-button" onSelect={(e) => handleBuklRatingStatusChange(e)} title="Bulk Actions" align={'end'}>
								<Dropdown.Item eventKey="publish" className="custom-dropdown-item">Publish all reviews</Dropdown.Item>
								<Dropdown.Item eventKey="unpublish" className="custom-dropdown-item">Unpublish all reviews</Dropdown.Item>
								<Dropdown.Item eventKey="delete" className="custom-dropdown-item">Delete all reviews</Dropdown.Item>
							</DropdownButton>
						</div>
					}
				</div>

				{filteredReviews.map((result, index) => (
					<div className="reviewbunch">
						<div className="reviewrowbox">
							<div className="topline">
								{result.reviewDocuments.length > 0 &&
									<div className="slider_imagebox flxfix">
										<ImageSlider reviewDocuments={result.reviewDocuments} autoPlay={false} interval={500} />
									</div>
								}

								<div className="rightinfo flxflexi">
									<div className="titlebox">
										<div className="checkmark">
											<i className="twenty-checkicon"></i>
										</div>
										<h4 className="fleflexi"><strong>{result.first_name} {result.last_name}</strong> about <strong>
												{result.productDetails ? <a href={`https://${shopRecords.shop}/products/${result.productDetails.handle}`} target="_blank"> {result.productDetails.title} </a> : ''}
											</strong>
										</h4>
									</div>
									<div className="displayname">Display name: {result.display_name}</div>
									<div className="ratingstars flxrow">
										<div className="inside_ratingstars">
											<div className="filledicon" style={{ width: `${result.rating * 20}%` }}>
												<i className="starsico-stars"></i>
											</div>
											<div className="dficon">
												<i className="starsico-stars"></i>
											</div>
										</div>
										<div className="rating_time">{formatTimeAgo(result.createdAt)}</div>
										{result.is_review_request &&
											<div className="reviewstatus flxrow">
												<Image src={mailBlueIcon} width={14} height={14} ></Image>
												Received through review request
											</div>
										}
									</div>

									<div className="timeline-body reviewquestionwrap">
										<div className="row">
											{result.reviewQuestionsAnswer.map((revItem, rIndex) => (
												<div className="col-md-3">
													<div className="qabox">
														<div className="questiontitle">{revItem.question_name}</div>
														<span className="answerofque">{revItem.answer}</span>
													</div>
												</div>
											))}

										</div>
									</div>

									<p>{result.description}</p>

									
								</div>
								<div className="rightactions flxfix flxcol">
									{ result.status == "publish" && 
										<>
											<div className="sociallinks flxrow">
												<a href="#" onClick={(e) => { e.preventDefault(); shareOnFacebook(); }}>
											      	<Image src={facebookSocial} width={24} height={24} />
											    </a>
											    <a href="#" onClick={(e) => { e.preventDefault(); shareOnTwitter(); }}>
													<Image src={twitterxicon} width={24} height={24} ></Image>
												</a>
												<a href="#" onClick={(e) => { e.preventDefault(); shareOnPinterest(); }}>
													<Image src={pinterestSocial} width={24} height={24} ></Image>
												</a>
											</div>
										</>
									}
									<div className="bottombuttons dropdownwrap">
										<DropdownButton id="dropdown-basic-button" className={result.status == 'publish' ? 'publishstatus' : 'unpblishstatus'} onSelect={(e) => handleRatingStatusChange(e, index)} title={getTitle(result.status)}>
											{ result.status == "unpublish" && <Dropdown.Item eventKey="publish" className="custom-dropdown-item">Publish</Dropdown.Item> }
											{ result.status == "publish" && <Dropdown.Item eventKey="unpublish" className="custom-dropdown-item">Unpublish</Dropdown.Item> }
											{ result.status == "pending" && <>
												<Dropdown.Item eventKey="publish" className="custom-dropdown-item">Publish</Dropdown.Item>
												<Dropdown.Item eventKey="unpublish" className="custom-dropdown-item">Unpublish</Dropdown.Item> 
												</>
											}
										</DropdownButton>
										
										
										{!result.replyText && result.status == "publish" && 
											<button type="button" className="revbtn lightbtn outline" onClick={(e) => handleShowReplyModal(result._id, index)} >Reply <ReplyIcon /></button>
										}


										<DropdownButton id="dropdown-basic-button" onSelect={(e) => handleMoreReviewChange(e, result._id, index)} title="More" align={'end'}>
											<Dropdown.Item eventKey="change-product" className="custom-dropdown-item">Change Product</Dropdown.Item>
											
											{ result.tag_as_feature == false &&  <Dropdown.Item eventKey="feature" className="custom-dropdown-item">Tag as Feature</Dropdown.Item> }
											{ result.tag_as_feature == true && <Dropdown.Item eventKey="remove-feature" className="custom-dropdown-item">Remove feature tag</Dropdown.Item> }
											
											{ result.verify_badge == false && <Dropdown.Item eventKey="verify-badge" className="custom-dropdown-item">Add verified badge</Dropdown.Item> }
											{ result.verify_badge == true && <Dropdown.Item eventKey="remove-verify-badge" className="custom-dropdown-item">Remove verified badge</Dropdown.Item> }
											
											{ result.add_to_carousel == false && <Dropdown.Item eventKey="add-to-carousel" className="custom-dropdown-item">Add to Carousel</Dropdown.Item> }
											{ result.add_to_carousel == true && <Dropdown.Item eventKey="remove-add-to-carousel" className="custom-dropdown-item">Remove from Carousel</Dropdown.Item> }
											
											
											<Dropdown.Item eventKey="delete" className="custom-dropdown-item">Delete</Dropdown.Item>
										</DropdownButton>

										{/* <button type="button" className="revbtn lightbtn outline" onClick={(e) => handleDeleteReviewItem(result._id, index)} >Delete Review</button> */}

									</div>
								</div>
							</div>
							{result.replyText &&
								<>
									<div className="timeline-reply replywrap flxrow">
												<div className="flxflexi">
													<h3>Your reply</h3>
													<p >{result.replyText}</p>
												</div>
												{ result.status == "publish" && 
													<>
														<div className="flxfix replayaction">
															<button type="button" className="" onClick={(e) => handleShowEditReplyModal(result._id, index)} >
																<i className="twenty-editicon2"></i>
															</button>
															<button type="button" className="" onClick={(e) => deleteReviewReply(result._id, index)} >
																<i className="twenty-deleteicon"></i>
															</button>
														</div>
													</>
												}
									</div>
								</>
							}
						</div>
					</div>
				))}

				<Modal show={showReplayModal} onHide={handleCloseReplyModal} size="lg" backdrop="static">
					<Modal.Header closeButton>
						<Modal.Title>Your Reply</Modal.Title>
					</Modal.Header>

					<Modal.Body>

						<textarea className="form-control" value={replyText}
							onChange={(e) => handleReplyTextChange(e)}
							rows="6"
							autoComplete="off"
						></textarea>
						<div className="inputnote">{replyHelpText}</div>

					</Modal.Body>
					<Modal.Footer>
						<button variant="primary" className="revbtn" onClick={submitReply} disabled={replyValueError}>
							{replyButtonText}
						</button>
						<button variant="secondary" className="revbtn lightbtn" onClick={handleCloseReplyModal}>
							Close
						</button>
					</Modal.Footer>
				</Modal>


				<Modal show={showChangeProductModal} onHide={handleCloseChangeProductModal} size="lg" backdrop="static">

					<Modal.Body>
						<h4>Change Product</h4>
						<input  className="form-control" value={changeProductHandle} onChange={(e) => handleShowChangeProduct(e)} placeholder="Product handle on Shopify (e.g. blue-t-shirt)"/>
						<span>A product handle is the last part of the product URL. For example, for this product:&nbsp;</span>
						<span  style={{ textDecoration: "underline" }}> http://www.store.com/products/</span>
						<b style={{textDecoration:"underline"}}>blue-t-shirt</b> the handle is <b>blue-t-shirt</b>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseChangeProductModal}>
							Close
						</Button>
						<Button variant="primary" onClick={submitChangeProduct} disabled={changeProductValueError}>
							Change
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</>
	)
}