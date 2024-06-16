import { useState, useCallback } from "react";
import { formatDate, formatTimeAgo } from './../../../utils/dateFormat';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import settings from './../../../utils/settings.json';

import NiceSelect from './../../../NiceSelect/NiceSelect';

import reviewImage from "./../../../images/no-reviews-yet.svg"
import customerImage from "./../../../images/customer-image.jpg"
import mailBlueIcon from "./../../../images/blue-mail-icon.svg"

import facebookSocial from "./../../../images/Facebook-Original.svg"
import redditSocial from "./../../../images/Reddit-Original.svg"
import pinterestSocial from "./../../../images/Pinterest-Original.svg"
import { Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap';
import ImageSlider from './ImageSlider';

const dropdownButtonStyle = {
	backgroundColor: '#4CAF50', // Green background
	color: 'white', // White text
	border: 'none', // Remove border
};



import {
	Image
} from "@shopify/polaris";

export default function ReviewItem({ filteredReviews, setFilteredReviews, filteredReviewsTotal, shopRecords, searchFormData, setSubmitHandle, submitHandle, setSearchFormData }) {
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
			toast.success(data.message);
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
					const response = await fetch(`${settings.host_url}/api/manage-review`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ "review_id": recordId })
					});

					const data = await response.json();
					if (data.status == 200) {
						toast.success(data.message);
					} else {
						toast.error(data.message);
					}
					setFilteredReviews(filteredReviews.filter((item, i) => i !== index));

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
						toast.success(data.message);
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
						toast.success(data.message);
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

	const shareOnFacebook = () => {
		const url = shopRecords.domain; 
		const encodedUrl = encodeURIComponent(`https://${url}`);
		const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
		window.open(shareUrl, '_blank', 'width=600,height=400');
	}

	const shareOnTwitter = () => {
		const url = `https://${shopRecords.domain}`; 
		const text = "";
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
		window.open(twitterUrl, '_blank', 'width=600,height=400');

	};

	const shareOnPinterest = () => {
		const url = `https://${shopRecords.domain}`; 
		const image = "https://chandstest.myshopify.com/cdn/shop/files/shitr.jpg?v=1714996209";
		const description = "test";
		const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(description)}`;

		window.open(pinterestUrl, '_blank', 'width=600,height=400');
	};
	

	  
	

	return (
		<>

			<div className="reviewlistblocks">
				<div className="topactions flxrow">
					<div className="reviewcounttop">
						<span>{filteredReviewsTotal}</span>Reviews found
					</div>
					{filteredReviewsTotal > 0 &&
						<div className="rightbox ms-auto">
							<DropdownButton id="dropdown-basic-button" onSelect={(e) => handleBuklRatingStatusChange(e)} title="Bulk Actions">
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
								<div className="">
									<ImageSlider reviewDocuments={result.reviewDocuments} autoPlay={false} interval={500} />
								</div>

								<div className="rightinfo flxflexi">
									<div className="titlebox">
										<div className="checkmark">
											<i className="twenty-checkicon"></i>
										</div>
										<h4 className="fleflexi"><strong>{result.first_name} {result.last_name}</strong> about
											<strong>
												{result.productDetails ? <a href={`https://${shopRecords.domain}/products/${result.productDetails.handle}`} target="_blank"> {result.productDetails.title} </a> : ''}
											</strong>
										</h4>
									</div>
									<div className="displayname">Display name: {result.first_name}</div>
									<div class="ratingstars flxrow">
										<div class="inside_ratingstars">
											<div class="filledicon" style={{ width: `${result.rating * 20}%` }}>
												<i class="starsico-stars"></i>
											</div>
											<div class="dficon">
												<i class="starsico-stars"></i>
											</div>
										</div>
										<div className="rating_time">{formatTimeAgo(result.created_at)}</div>
										{result.is_review_request &&
											<div className="reviewstatus flxrow">
												<Image src={mailBlueIcon} width={14} height={14} ></Image>
												Received through review request
											</div>
										}
									</div>

									<div className="timeline-body">
										<div className="row">
											{result.reviewQuestionsAnswer.map((revItem, rIndex) => (
												<div className="col-md-3">
													<div className="small text-muted">{revItem.reviewQuestions.question}</div>
													<span>{revItem.answer}</span>
												</div>
											))}

										</div>
									</div>

									<p>{result.description}</p>

									<div class="timeline-reply">
										{result.replyText &&
											<>
												<hr />
												<span >Your reply</span>
												<p >{result.replyText}</p>

												<button type="button" class="btn btn-default" onClick={(e) => handleShowEditReplyModal(result._id, index)} >Edit</button>
												<button type="button" class="btn btn-default" onClick={(e) => deleteReviewReply(result._id, index)} >Delete</button>
											</>
										}

									</div>
								</div>
								<div className="rightactions flxfix flxcol">
									<div className="sociallinks flxrow">
										<a href="javascript:void(0)" onClick={(e) => shareOnFacebook()}>
											<Image  src={facebookSocial} width={24} height={24} ></Image>
										</a>
										<a href="javascript:void(0)" onClick={(e) => shareOnTwitter()}>
											<Image   src={redditSocial} width={24} height={24} ></Image>
										</a>
										<a href="javascript:void(0)" onClick={(e) => shareOnPinterest()}>
											<Image src={pinterestSocial} width={24} height={24} ></Image>
										</a>
									</div>
									<div className="bottombuttons">
										<DropdownButton id="dropdown-basic-button" onSelect={(e) => handleRatingStatusChange(e, index)} title={result.status == 'publish' ? "Published" : "Unpublished"}>
											{ result.status == "unpublish" && <Dropdown.Item eventKey="publish" className="custom-dropdown-item">Publish</Dropdown.Item> }
											{ result.status == "publish" && <Dropdown.Item eventKey="unpublish" className="custom-dropdown-item">Unpublish</Dropdown.Item> }
										</DropdownButton>
										{!result.replyText &&
											<button type="button" class="btn btn-default" onClick={(e) => handleShowReplyModal(result._id, index)} >Reply</button>
										}
										<button type="button" class="btn btn-default" onClick={(e) => handleDeleteReviewItem(result._id, index)} >Delete Review</button>

									</div>
								</div>
							</div>
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
						<label>{replyHelpText}</label>

					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleCloseReplyModal}>
							Close
						</Button>
						<Button variant="primary" onClick={submitReply} disabled={replyValueError}>
							{replyButtonText}
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</>
	)
}