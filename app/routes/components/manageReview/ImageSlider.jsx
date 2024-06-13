// src/components/ImageSlider.js
import React, { useState, useEffect } from 'react';
import styles from './imageSlider.module.css';
import { Modal } from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';  // Import the three dots icon
import { toast } from 'react-toastify';

const ImageSlider = ({ reviewDocuments, autoPlay, interval }) => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [preArrow, setPreArrow] = useState(false);
	const [nextArrow, setNextArrow] = useState(true);
	const [showImageModal, setShowImageModal] = useState(false);
	const [images, setImages] = useState(reviewDocuments);

	const handleCloseImageModal = () => setShowImageModal(false);


	const handleShowImageModal = (review_id, index) => {
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
			toast.success(data.message);
		} else {
			toast.error(data.message);
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
			toast.success(data.message);
		} else {
			toast.error(data.message);
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
			toast.success(data.message);
		} else {
			toast.error(data.message);
		}

		setImages(images.map((item, idx) =>
			idx === index ? { ...item, is_approve: false } : item
		));

	};

	const openImageInNewTab = (img) => {
		window.open(img, '_blank');
	};

	const downloadImage = (imageUrl) => {
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
							<img onClick={handleShowImageModal} className={styles.img} src={image.url} alt={`Slide ${index}`} />
							<div className={styles.menu_icon} onClick={handleMenuToggle}>
								<FaEllipsisV />
								{isMenuOpen && (
									<div className={styles.menu}>
										<ul>
											{image.is_cover == false && image.is_approve == true ?
												<li onClick={(e) => makeCoverPhoto(e, index)}>Make cover photo</li> : ""}

											{image.is_approve == false ?
												<li onClick={(e) => approvePhoto(e, index)}>Approve photo</li> : ""}
											{image.is_approve && <li onClick={(e) => hidePhoto(e, index)}>Hide photo</li>}
											<li onClick={(e) => openImageInNewTab(image.url)} >View photo</li>
											<li onClick={(e) => downloadImage(image.url)}>
												Download photo</li>
										</ul>
									</div>
								)}
							</div>
							{image.is_cover && image.is_approve && (<span className={styles.cover_photo_label}>cover photo</span>)}
							{image.is_approve == false && <span className={styles.cover_photo_label}>Hide</span>}
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

			<Modal show={showImageModal} onHide={handleCloseImageModal} size="lg" backdrop="static">
				<Modal.Header closeButton>
				</Modal.Header>
				<Modal.Body>
					{images[currentIndex] &&
						<img src={images[currentIndex].url} alt={`Slide ${currentIndex}`} style={{ width: '100%' }} />
					}
				</Modal.Body>

			</Modal>



		</>

	);
};

export default ImageSlider;
