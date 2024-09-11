// src/components/ImageSlider.js
import React, { useState, useEffect } from 'react';
import styles from './imageSlider.module.css';
import { Modal, DropdownButton, Dropdown } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';  // Import the three dots icon
import settingsJson from './../../../utils/settings.json';
import { getUploadDocument } from './../../../utils/documentPath';
import MoreIcon from '../../../images/MoreIcon';

import UnPublishedIcon from '../../../images/UnPublishedIcon';

const ImageSlider = ({ reviewDocuments, shopRecords, autoPlay, interval }) => {

	const [currentIndex, setCurrentIndex] = useState(0);
	const [preArrow, setPreArrow] = useState(false);
	const [nextArrow, setNextArrow] = useState(true);
	const [showImageModal, setShowImageModal] = useState(false);
	const [documentType, setDocumentType] = useState('image');
	const [images, setImages] = useState(reviewDocuments);

	useEffect(() => {
		setImages(reviewDocuments);
	}, [reviewDocuments]);

	const handleCloseImageModal = () => setShowImageModal(false);


	const handleShowImageModal = (event, type) => {
		setDocumentType(type);
		setShowImageModal(true);
	}

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
	};

	const goToSlide = (index) => {
		setCurrentIndex(index);
	};

	useEffect(() => {
		if (autoPlay) {
			const timer = setInterval(nextSlide, interval || 3000);
			return () => clearInterval(timer);
		}
		if (currentIndex == 0) {
			setPreArrow(false);
			setNextArrow(true);
		} else if (currentIndex + 1 == images.length) {
			setPreArrow(true);
			setNextArrow(false);
		} else {
			setPreArrow(true);
			setNextArrow(true);
		}
	}, [currentIndex, autoPlay, interval]);

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const handleMenuToggle = () => {
		setIsMenuOpen(!isMenuOpen);
	};


	const makeCoverPhoto = async (event, index) => {
		const docId = images[index]._id;
		const customParams = {
			doc_id: images[index]._id,
			review_id: images[index].review_id,
			actionType: "imageSliderAction",
			subActionType: "makeCoverPhoto"
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
		} else {
			shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime,
                isError: true
            });
		}

		setImages(images.map((item, idx) =>
			idx === index ? { ...item, is_cover: true } : { ...item, is_cover: false }
		));

	};

	const approvePhoto = async (event, index) => {
		const docId = images[index]._id;
		const customParams = {
			doc_id: images[index]._id,
			review_id: images[index].review_id,
			actionType: "imageSliderAction",
			subActionType: "approvePhoto"
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
		} else {
			shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime,
                isError: true
            });
		}

		setImages(images.map((item, idx) =>
			idx === index ? { ...item, is_approve: true } : item
		));
	};
	const hidePhoto = async (event, index) => {
		const docId = images[index]._id;
		const customParams = {
			doc_id: images[index]._id,
			review_id: images[index].review_id,
			actionType: "imageSliderAction",
			subActionType: "hidePhoto"
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
		} else {
			shopify.toast.show(data.message, {
                duration: settingsJson.toasterCloseTime,
                isError: true
            });
		}

		setImages(images.map((item, idx) =>
			idx === index ? { ...item, is_approve: false } : item
		));

	};

	const openImageInNewTab = (imgPath) => {
		const img = getUploadDocument(imgPath, shopRecords.shop_id);

		window.open(img, '_blank');
	};

	const downloadImage = (imageUrlPath) => {
		const imageUrl = getUploadDocument(imageUrlPath, shopRecords.shop_id);

		const imageName = imageUrl.split('/').pop();

		fetch(imageUrl)
			.then((response) => response.blob())
			.then((blob) => {
				const url = window.URL.createObjectURL(new Blob([blob]));

				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', imageName);
				document.body.appendChild(link);

				link.click();

				link.parentNode.removeChild(link);
				window.URL.revokeObjectURL(url);
			})
			.catch((error) => {
				console.error('Error downloading image: ', error);
			});
	}

	return (
		<>
			<div className={styles.slider}>
				{preArrow && images.length > 1 && <button className={`${styles.prev} ${styles.button}`} onClick={prevSlide}>❮</button>}
				<div className={styles['slider-wrapper']} style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
					{images.map((image, index) => (
						<div
							key={index}
							className={`${styles.slide} ${index === currentIndex ? styles.active : ''}`}
						>

							<img onClick={(e) => handleShowImageModal(e, image.type)} className={styles.img} src={getUploadDocument(image.thumbnail_name || image.url, shopRecords.shop_id)} alt={`Slide ${index}`} />

							{/* {image.type === 'image' ? (
							) : (
								<video onClick={(e) => handleShowImageModal(e, image.type)} className={styles.img} controls>
									<source src={getUploadDocument(image.thumbnail_name || image.url, shopRecords.shop_id)} type="video/mp4" />
								</video>
							)} */}


							<div className='flxfix dropdownwrap ddlightbtn'>

								<DropdownButton className={styles.menu_icon} id="dropdown-basic-button" title={<MoreIcon />} align={'end'}>
									{image.is_cover == false && image.is_approve == true ?
										<Dropdown.Item onClick={(e) => makeCoverPhoto(e, index)} eventKey="edit" className="custom-dropdown-item" >Make cover {image.type == "image" ? "photo" : "video"} </Dropdown.Item> : ""}
									{image.is_approve == false ?
										<Dropdown.Item onClick={(e) => approvePhoto(e, index)} eventKey="delete" className="custom-dropdown-item" >Approve {image.type == "image" ? "photo" : "video"}</Dropdown.Item> : ""}
									{image.is_approve &&
										<Dropdown.Item onClick={(e) => hidePhoto(e, index)} eventKey="delete" className="custom-dropdown-item" >Hide {image.type == "image" ? "photo" : "video"}</Dropdown.Item>}
									<Dropdown.Item onClick={(e) => openImageInNewTab(image.url)} eventKey="delete" className="custom-dropdown-item" >View {image.type == "image" ? "photo" : "video"}</Dropdown.Item>
									<Dropdown.Item onClick={(e) => downloadImage(image.url)} eventKey="delete" className="custom-dropdown-item" >Download {image.type == "image" ? "photo" : "video"}</Dropdown.Item>

								</DropdownButton>
							</div>
							
							{image.is_cover && image.is_approve && (
								<span className={`${styles.cover_photo_label} ${styles.coverphotolabel}`}>
									<i className='starsico-single-star'></i> cover {image.type == "image" ? "photo" : "video"}
								</span>
							)}
							{image.is_approve == false &&
								<span className={`${styles.cover_photo_label} ${styles.hidephotolabel}`}><UnPublishedIcon /> Hide</span>
							}
						</div>
					))}
				</div>
				{nextArrow && images.length > 1 && <button className={`${styles.next} ${styles.button}`} onClick={nextSlide}>❯</button>}
				{images.length > 1 ?
					<div className={styles.dots}>
						{images.map((_, index) => (
							<span
								key={index}
								className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
								onClick={() => goToSlide(index)}
							></span>
						))}
					</div>
					: ""
				}
			</div>

			<Modal show={showImageModal} className='reviewimagepopup' onHide={handleCloseImageModal} size="lg" backdrop="static">
				<Modal.Header closeButton>
				</Modal.Header>
				<Modal.Body>
					{documentType === 'image' && images[currentIndex] && images[currentIndex].url ? (
						<img src={getUploadDocument(images[currentIndex].url, shopRecords.shop_id)} alt={`Slide ${currentIndex}`} style={{ width: '100%' }} />
					) : documentType === 'video' && images[currentIndex] && images[currentIndex].url ? (
						<video controls className={styles.videoWidth}>
							<source src={getUploadDocument(images[currentIndex].url, shopRecords.shop_id)} type="video/mp4" />
						</video>
					) : (
						<p>No content to display</p>
					)}

				</Modal.Body>
			</Modal>
		</>

	);
};

export default ImageSlider;
