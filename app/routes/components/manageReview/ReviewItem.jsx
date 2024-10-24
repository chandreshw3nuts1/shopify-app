import { useState, useCallback } from "react";
import { formatTimeAgo, reviewersNameFormat } from './../../../utils/dateFormat';
import settingsJson from './../../../utils/settings.json';

const mailBlueIcon = `/images/blue-mail-icon.svg`;

const facebookSocial = "/images/Facebook-Original.svg";
const twitterxicon = "/images/twitter-x-icon.svg";
const pinterestSocial = "/images/Pinterest-Original.svg";
import ImageSlider from './ImageSlider';
import { Modal, TitleBar } from '@shopify/app-bridge-react';


import {
	Image, Button, Box, TextField, BlockStack, Text, Popover, ActionList, InlineGrid, InlineStack, Icon
} from "@shopify/polaris";
import { ArrowDiagonalIcon } from '@shopify/polaris-icons';

export default function ReviewItem({ filteredReviews, setFilteredReviews, filteredReviewsTotal, setFilteredReviewsTotal, shopRecords, searchFormData, setSubmitHandle, submitHandle, setSearchFormData, onImageClick }) {
	const [showReplayModal, setShowReplayModal] = useState(false);
	const [replyText, setReplyText] = useState('');
	const [replyReviewId, setReplyReviewId] = useState('');
	const [replyReviewIndex, setReplyReviewIndex] = useState('');
	const [replyValueError, setReplyValueError] = useState(true);
	const [isUpdatingReply, setIsUpdatingReply] = useState(false);
	const [replyButtonText, setReplyButtonText] = useState('');
	const [replyHelpText, setReplyHelpText] = useState('');
	const handleCloseReplyModal = () => {
		setReplyText('');
		setShowReplayModal(false)
	}

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

	const [showDeleteReviewReplyModal, setShowDeleteReviewReplyModal] = useState(false);
	const [showDeleteReviewModal, setShowDeleteReviewModal] = useState(false);

	const [deleteReviewReplyObject, setDeleteReviewReplyObject] = useState({});
	const [deleteReviewObject, setDeleteReviewObject] = useState({});

	const handleCloseChangeProductModal = () => {
		setShowChangeProductModal(false);
		setChangeProductHandle('');

	};
	const [changeProductReviewId, setChangeProductReviewId] = useState('');

	const handleShowChangeProductModal = (review_id, index) => {
		setShowChangeProductModal(true);
		setChangeProductReviewId(review_id);
		setChangeProductIndex(index);
	}
	const [changeProductValueError, setChangeProductValueError] = useState(true);
	const [changeProductHandle, setChangeProductHandle] = useState('');


	const handleShowChangeProduct = useCallback((value) => {
		setChangeProductHandle(value); // Update the state with the input value
		setChangeProductValueError(false); // Clear the error flag
		if (value.trim() === "") {
			setChangeProductValueError(true); // Set the error flag if input is empty
		}
	}, []);


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
		setReplyValueError(true);

		const response = await fetch(`/api/manage-review`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(customParams)
		});
		const data = await response.json();
		if (data.status == 200) {
			shopify.toast.show(data.message, {
				duration: settingsJson.toasterCloseTime
			});
		} else {
			shopify.toast.show(data.message, {
				duration: settingsJson.toasterCloseTime,
				isError: true
			});
		}
		setReplyText('');
		setShowReplayModal(false);
		setFilteredReviews(filteredReviews.map((item, idx) =>
			idx === replyReviewIndex ? { ...item, replyText: replyText } : item
		));
	};


	const submitChangeProduct = async () => {
		setChangeProductValueError(true);

		const customParams = {
			review_id: changeProductReviewId,
			changeProductHandle: changeProductHandle,
			actionType: "changeProductHandle",
			shop: shopRecords.shop,
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
			shopify.toast.show(data.message, {
				duration: settingsJson.toasterCloseTime
			});
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
			shopify.toast.show(data.message, {
				duration: settingsJson.toasterCloseTime,
				isError: true
			});
		}
		setChangeProductValueError(false);

	};

	const openReviewDeleteModal = (review_id, index) => {
		console.log(review_id, index);
		setShowDeleteReviewModal(true);
		setDeleteReviewObject({ review_id, index });
	}

	const handleCloseReviewModal = () => {
		setShowDeleteReviewModal(false);
		setDeleteReviewObject({});
	};

	const handleDeleteReviewItem = async () => {

		try {
			const { review_id, index } = deleteReviewObject;
			setShowDeleteReviewModal(false);
			setDeleteReviewObject({});

			const response = await fetch(`${settingsJson.host_url}/api/manage-review`, {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ "review_id": review_id })
			});

			const data = await response.json();
			if (data.status == 200) {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
				setFilteredReviewsTotal(--filteredReviewsTotal);
				setFilteredReviews(filteredReviews.filter((item, i) => i !== index));

			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
			}

		} catch (error) {
			console.error("Error deleting record:", error);
			shopify.toast.show("Failed to delete record", {
				duration: settingsJson.toasterCloseTime,
				isError: true
			});
		}

	};

	const handleRatingStatusChange = async (statusValue, index) => {
		setPopoverPublishDropdown(null);
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
		const data = await response.json();

		shopify.toast.show(data.message, {
			duration: settingsJson.toasterCloseTime
		});
		setFilteredReviews(filteredReviews.map((item, idx) =>
			idx === index ? { ...item, status: statusValue } : item
		));
	};
	const [showBulkActionModal, setShowBulkActionModal] = useState(false);
	const [bulkActionModalObject, setBulkActionModalObject] = useState('');


	const opeBulkActionModal = (statusValue) => {
		setShowBulkActionModal(true);
		setBulkActionModalObject(statusValue);
		setPopoverBulkDropdown(false);
	}
	const handleCloseBulkActionModal = () => {
		setShowBulkActionModal(false);
		setBulkActionModalObject('');
	}

	const handleBuklRatingStatusChange = async () => {
		const statusValue = bulkActionModalObject;

		try {
			setShowBulkActionModal(false);

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
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
			}

			setSearchFormData((prevData) => ({
				...prevData,
				page: 1,
			}));
			setSubmitHandle(!submitHandle);

		} catch (error) {
			shopify.toast.show("Failed to delete record", {
				duration: settingsJson.toasterCloseTime,
				isError: true
			});
		}
	}



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

	const openReviewReplyDeleteModal = (review_id, index) => {
		console.log(review_id, index);
		setShowDeleteReviewReplyModal(true);
		setDeleteReviewReplyObject({ review_id, index });
	}

	const handleCloseReviewReplyModal = () => {
		setShowDeleteReviewReplyModal(false);
		setDeleteReviewReplyObject({});
	};
	const deleteReviewReply = async () => {

		try {
			const { review_id, index } = deleteReviewReplyObject;

			setShowDeleteReviewReplyModal(false);
			setDeleteReviewReplyObject({});

			const response = await fetch(`/api/manage-review`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ review_id: review_id, actionType: "addReviewReply", subActionType: "deleteReply", reply: '' })
			});
			const data = await response.json();
			if (data.status == 200) {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
			}

			setFilteredReviews(filteredReviews.map((item, idx) =>
				idx === index ? { ...item, replyText: '' } : item
			));

		} catch (error) {
			shopify.toast.show("Failed to delete record", {
				duration: settingsJson.toasterCloseTime,
				isError: true
			});
		}
	}



	const handleMoreReviewChange = async (statusValue, result, index) => {
		const review_id = result._id;
		setPopoverMoreDropdown(null);
		if (statusValue == 'delete') {
			openReviewDeleteModal(review_id, index);
		} else if (statusValue == 'change-product') {
			handleShowChangeProductModal(review_id, index);
		} else if (statusValue === 'discount') {
			const discountDetailsUrl = `https://admin.shopify.com/store/${shopRecords.myshopify_domain.replace(".myshopify.com", "")}/discounts/${result.discount_code_id}`;
			window.open(discountDetailsUrl, "_blank");
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
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
				if (statusValue == 'feature') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, tag_as_feature: true } : item
					));
				} else if (statusValue == 'remove-feature') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, tag_as_feature: false } : item
					));
				} else if (statusValue == 'verify-badge') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, verify_badge: true } : item
					));
				} else if (statusValue == 'remove-verify-badge') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, verify_badge: false } : item
					));
				} else if (statusValue == 'add-to-carousel') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, add_to_carousel: true } : item
					));
				} else if (statusValue == 'remove-add-to-carousel') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, add_to_carousel: false } : item
					));
				}

				else if (statusValue == 'add-to-video-slider') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, video_slider: true } : item
					));
				} else if (statusValue == 'remove-video-slider') {
					setFilteredReviews(filteredReviews.map((item, idx) =>
						idx === index ? { ...item, video_slider: false } : item
					));
				}


			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
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
			return 'Published';
		} else if (status === 'unpublish') {
			return 'Unpublished';
		} else {
			return 'Pending';
		}
	};


	const [popoverBulkDropdown, setPopoverBulkDropdown] = useState(false);

	const togglePopoverBulkDropdown = useCallback(
		() => setPopoverBulkDropdown((popoverBulkDropdown) => !popoverBulkDropdown),
		[],
	);

	const bulkActionOptions = {
		"publish": "Publish all reviews",
		"unpublish": "Unpublish all reviews",
		"delete": "Delete all reviews"
	};



	const [popoverPublishDropdown, setPopoverPublishDropdown] = useState(false);
	const togglePopoverPublishDropdown = (index) => {
		setPopoverPublishDropdown(popoverPublishDropdown === index ? null : index);
	};


	const [popoverMoreDropdown, setPopoverMoreDropdown] = useState(false);
	const togglePopoverMoreDropdown = (index) => {
		setPopoverMoreDropdown(popoverMoreDropdown === index ? null : index);
	};



	return (
		<>

			<div className="reviewlistblocks">
				<Box style={{ "marginBottom": "10px" }}>
					<InlineGrid columns={['oneHalf', 'oneHalf']} alignItems="center">

						<InlineStack align="start" gap="400">
							<BlockStack gap="100">
								<Text as="h4" variant="headingMd">{filteredReviewsTotal} Reviews found</Text>
							</BlockStack>
						</InlineStack>

						<InlineStack align="end" gap="400">
							<BlockStack gap="100">
								{filteredReviewsTotal > 0 &&

									<Popover
										active={popoverBulkDropdown}
										activator={
											<Button onClick={togglePopoverBulkDropdown} disclosure>
												Bulk Actions
											</Button>
										}
										autofocusTarget="first-node"
										onClose={togglePopoverBulkDropdown}
										preferredAlignment="right"
									>
										<ActionList
											actionRole="menuitem"
											items={
												Object.entries(bulkActionOptions).map(([key, value]) => {
													return { content: value, onAction: () => opeBulkActionModal(key) }
												})
											}
										/>
									</Popover>
								}
							</BlockStack>
						</InlineStack>
					</InlineGrid>
				</Box>

				{filteredReviews.map((result, index) => {
					let publishActionOptions = {};
					let moreActionOptions = {};
					if (result.status === "pending") {
						publishActionOptions = {
							"publish": "Publish",
							"unpublish": "Unpublish",
						};
					} else if (result.status === "publish") {
						publishActionOptions = {
							"unpublish": "Unpublish",
						};
					} else if (result.status === "unpublish") {
						publishActionOptions = {
							"publish": "Publish",
						};
					}

					moreActionOptions["change-product"] = "Change Product";
					if (result.discount_code_id != null) {
						moreActionOptions["discount"] = "See discount details";
					}

					if (!result.tag_as_feature) {
						moreActionOptions["feature"] = "Tag as Feature";
					}
					if (result.tag_as_feature) {
						moreActionOptions["remove-feature"] = "Remove feature tag";
					}

					if (!result.verify_badge) {
						moreActionOptions["verify-badge"] = "Add verified badge";
					}
					if (result.verify_badge) {
						moreActionOptions["remove-verify-badge"] = "Remove verified badge";
					}

					if (!result.add_to_carousel) {
						moreActionOptions["add-to-carousel"] = "Add to Carousel";
					}
					if (result.add_to_carousel) {
						moreActionOptions["remove-add-to-carousel"] = "Remove from Carousel";
					}

					if (result.reviewDocuments.length > 0) {
						if ((result.video_slider == false || result.video_slider == null)) {
							moreActionOptions["add-to-video-slider"] = "Add to Video Slider";

						}
						if ((result.video_slider == false || result.video_slider == null)) {
							moreActionOptions["remove-video-slider"] = "Remove from Video Slider";

						}
					}
					moreActionOptions["resend-review-request"] = "Resend review request";
					moreActionOptions["delete"] = "Delete";



					return (
						<div className="reviewbunch">
							<div className="reviewrowbox">
								<div className="topline">
									{result.reviewDocuments.length > 0 &&
										<div className="slider_imagebox flxfix">
											<ImageSlider reviewDocuments={result.reviewDocuments} shopRecords={shopRecords} onImageClick={onImageClick} autoPlay={false} interval={500} />
										</div>
									}

									<div className="rightinfo flxflexi">
										{(result.tag_as_feature == true || result.verify_badge == true || result.add_to_carousel == true || result.video_slider == true) &&
											<div className="topbadges">
												{result.tag_as_feature == true &&
													<div className="featured_tag revbedge">Featured
														{/* <a href="#" className="bedclosebtn"><i className="twenty-closeicon"></i></a> */}
													</div>
												}
												{result.verify_badge == true &&
													<div className="revbedge onlyicon darkcolor" title="Verified purchase">
														<i className="twenty-checkicon"></i>
													</div>
												}
												{result.add_to_carousel == true &&
													<div className="revbedge onlyicon darkcolor" title="Carousel">
														<i className="twenty-carousel"></i>
													</div>
												}
												{result.video_slider == true &&
													<div className="revbedge onlyicon darkcolor" title="Video slider">
														<i className="twenty-video-slider"></i>
													</div>
												}
											</div>
										}
										<div className="titlebox">
											{result.status == "unpublish" &&
												<div className="checkmark unpublish">
													<i className="twenty-closeicon"></i>
												</div>
											}
											{result.status == "publish" &&
												<div className="checkmark">
													<i className="twenty-checkicon"></i>
												</div>
											}
											<h4 className="fleflexi">
												<strong>{result.first_name} {result.last_name}</strong> about <strong>
													{result.product_id ? <a href={`https://${shopRecords.shop}/products/${result.product_url}`} target="_blank"> {result.product_title} </a> : ''}</strong>
											</h4>
										</div>
										<div className="displayname">Display name: {reviewersNameFormat(result.first_name, result.last_name, shopRecords.reviewers_name_format)}</div>
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
										{result.status == "publish" &&
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

											<Popover
												active={popoverPublishDropdown === index}
												activator={
													<Button onClick={() => togglePopoverPublishDropdown(index)} disclosure>
														{getTitle(result.status)}
													</Button>
												}
												autofocusTarget="first-node"
												onClose={() => togglePopoverPublishDropdown(index)}
												fullWidth={true}
											>
												<ActionList
													actionRole="menuitem"
													items={
														Object.entries(publishActionOptions).map(([key, value]) => {
															return { content: value, onAction: (e) => handleRatingStatusChange(key, index) }
														})
													}
												/>
											</Popover>

											{/* <DropdownButton id="dropdown-basic-button" className={result.status == 'publish' ? 'publishstatus' : 'unpblishstatus'} onSelect={(e) => handleRatingStatusChange(e, index)} title={getTitle(result.status)}>
											{result.status == "unpublish" && <Dropdown.Item eventKey="publish" className="custom-dropdown-item">Publish</Dropdown.Item>}
											{result.status == "publish" && <Dropdown.Item eventKey="unpublish" className="custom-dropdown-item">Unpublish</Dropdown.Item>}
											{result.status == "pending" && <>
												<Dropdown.Item eventKey="publish" className="custom-dropdown-item">Publish</Dropdown.Item>
												<Dropdown.Item eventKey="unpublish" className="custom-dropdown-item">Unpublish</Dropdown.Item>
											</>
											}
										</DropdownButton> */}


											{!result.replyText && result.status == "publish" &&
												<Button icon={ArrowDiagonalIcon} fullWidth={true} onClick={(e) => handleShowReplyModal(result._id, index)}>
												Reply
											  </Button>
											  
											}



											<Popover
												active={popoverMoreDropdown === index}
												activator={
													<Button onClick={() => togglePopoverMoreDropdown(index)} disclosure>
														More
													</Button>
												}
												autofocusTarget="first-node"
												onClose={() => togglePopoverMoreDropdown(index)}
												preferredAlignment="right"

											>
												<ActionList
													actionRole="menuitem"
													items={
														Object.entries(moreActionOptions).map(([key, value]) => {
															return { content: value, onAction: (e) => handleMoreReviewChange(key, result, index) }
														})
													}
												/>
											</Popover>


											{/* 
											<DropdownButton id="dropdown-basic-button" onSelect={(e) => handleMoreReviewChange(e, result, index)} title="More" align={'end'}>
												<Dropdown.Item eventKey="change-product" className="custom-dropdown-item">Change Product</Dropdown.Item>

												{result.discount_code_id != null && <Dropdown.Item eventKey="discount" className="custom-dropdown-item">See discount details</Dropdown.Item>}


												{result.tag_as_feature == false && <Dropdown.Item eventKey="feature" className="custom-dropdown-item">Tag as Feature</Dropdown.Item>}
												{result.tag_as_feature == true && <Dropdown.Item eventKey="remove-feature" className="custom-dropdown-item">Remove feature tag</Dropdown.Item>}

												{result.verify_badge == false && <Dropdown.Item eventKey="verify-badge" className="custom-dropdown-item">Add verified badge</Dropdown.Item>}
												{result.verify_badge == true && <Dropdown.Item eventKey="remove-verify-badge" className="custom-dropdown-item">Remove verified badge</Dropdown.Item>}

												{result.add_to_carousel == false && <Dropdown.Item eventKey="add-to-carousel" className="custom-dropdown-item">Add to Carousel</Dropdown.Item>}
												{result.add_to_carousel == true && <Dropdown.Item eventKey="remove-add-to-carousel" className="custom-dropdown-item">Remove from Carousel</Dropdown.Item>}

												{result.reviewDocuments.length > 0 &&
													<>
														{(result.video_slider == false || result.video_slider == null) && <Dropdown.Item eventKey="add-to-video-slider" className="custom-dropdown-item">Add to Video Slider</Dropdown.Item>}
														{result.video_slider == true && <Dropdown.Item eventKey="remove-video-slider" className="custom-dropdown-item">Remove from Video Slider</Dropdown.Item>}
													</>
												}

												<Dropdown.Item eventKey="resend-review-request" className="custom-dropdown-item">Resend review request </Dropdown.Item>
												<Dropdown.Item eventKey="delete" className="custom-dropdown-item">Delete</Dropdown.Item>
											</DropdownButton> */}


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
											{result.status == "publish" &&
												<>
													<div className="flxfix replayaction">
														<button type="button" className="" onClick={(e) => handleShowEditReplyModal(result._id, index)} >
															<i className="twenty-editicon2"></i>
														</button>
														<button type="button" className="" onClick={(e) => openReviewReplyDeleteModal(result._id, index)} >
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
					);
				})}



				{
					showReplayModal && (
						<Modal
							variant="base"
							open={showReplayModal}
							onHide={handleCloseReplyModal}
						>
							<TitleBar title="Your Reply">

								<button variant="primary" onClick={submitReply} disabled={replyValueError}>
									{replyButtonText}
								</button>
								<button onClick={handleCloseReplyModal}>Close</button>

							</TitleBar>
							<Box padding="500">

								<textarea className="form-control" value={replyText}
									onChange={(e) => handleReplyTextChange(e)}
									rows="6"
									autoComplete="off"
								></textarea>
								<div className="inputnote">{replyHelpText}</div>
							</Box>
						</Modal>
					)
				}

				{
					showChangeProductModal && (
						<Modal
							variant="base"
							open={showChangeProductModal}
							onHide={handleCloseChangeProductModal}
						>
							<TitleBar title="Change Product">

								<button variant="primary" onClick={submitChangeProduct} disabled={changeProductValueError}>
									Change
								</button>
								<button onClick={handleCloseChangeProductModal}>Close</button>
							</TitleBar>
							<Box padding="500">

								<TextField
									onChange={handleShowChangeProduct}
									autoComplete="off"
									value={changeProductHandle}
									placeholder="Product handle on Shopify (e.g. blue-t-shirt)"
								/>

								<span>A product handle is the last part of the product URL. For example, for this product:&nbsp;</span>
								<span style={{ textDecoration: "underline" }}> http://www.store.com/products/</span>
								<b style={{ textDecoration: "underline" }}>blue-t-shirt</b> the handle is <b>blue-t-shirt</b>
							</Box>
						</Modal>
					)
				}

				{
					showDeleteReviewReplyModal && (
						<Modal
							variant="base"
							open={showDeleteReviewReplyModal}
							onHide={handleCloseReviewReplyModal}
						>
							<TitleBar title="Delete review reply">
								<button tone="critical" variant="primary" onClick={deleteReviewReply} >
									Delete
								</button>
								<button onClick={handleCloseReviewReplyModal}>Cancel</button>
							</TitleBar>
							<Box padding="400">
								<BlockStack gap="400">

									<Text variant="headingXl" as="h4" style={{ marginBottom: "10px" }}>
										Are you sure you want to delete your reply?

									</Text>
									<Text>
										<strong>Warning: </strong>This action is irreversible, and the review reply will not be accessible again
									</Text>
								</BlockStack>
							</Box>
						</Modal>
					)
				}

				{
					showBulkActionModal && (
						<Modal
							variant="base"
							open={showBulkActionModal}
							onHide={handleCloseBulkActionModal}
						>
							<TitleBar title={`${bulkActionModalObject.charAt(0).toUpperCase() + bulkActionModalObject.slice(1)} reviews?`}>
								{bulkActionModalObject === 'delete' &&
									<button tone="critical" variant="primary" onClick={handleBuklRatingStatusChange} >
										Delete
									</button>
								}
								{bulkActionModalObject === 'publish' &&
									<button variant="primary" onClick={handleBuklRatingStatusChange} >
										Publish
									</button>
								}
								{bulkActionModalObject === 'unpublish' &&
									<button variant="primary" onClick={handleBuklRatingStatusChange} >
										Unpublish
									</button>
								}
								<button onClick={handleCloseBulkActionModal}>Cancel</button>
							</TitleBar>
							<Box padding="400">
								<BlockStack gap="400">

									<Text variant="headingXl" as="h4" style={{ marginBottom: "10px" }}>
										Are you sure you want to {bulkActionModalObject} {filteredReviewsTotal} reviews?

									</Text>

								</BlockStack>
							</Box>
						</Modal>
					)
				}


				{
					showDeleteReviewModal && (
						<Modal
							variant="base"
							open={showDeleteReviewModal}
							onHide={handleCloseReviewModal}
						>
							<TitleBar title="Delete review">
								<button tone="critical" variant="primary" onClick={handleDeleteReviewItem} >
									Delete
								</button>
								<button onClick={handleCloseReviewModal}>Cancel</button>
							</TitleBar>
							<Box padding="400">
								<BlockStack gap="400">

									<Text variant="headingXl" as="h4" style={{ marginBottom: "10px" }}>
										Are you sure you want to delete review?

									</Text>
									<Text>
										<strong>Warning: </strong>This action is irreversible, and the review will not be accessible again
									</Text>
								</BlockStack>
							</Box>
						</Modal>
					)
				}


			</div >
		</>
	)
}