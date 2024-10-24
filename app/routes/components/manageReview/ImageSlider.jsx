import React, { useState, useEffect, useCallback } from 'react';
import styles from './imageSlider.module.css';
import settingsJson from './../../../utils/settings.json';
import { getUploadDocument } from './../../../utils/documentPath';

import UnPublishedIcon from '../../../images/UnPublishedIcon';
import {
	Popover, ActionList, Icon
} from "@shopify/polaris";

import { MenuVerticalIcon } from '@shopify/polaris-icons';

const ImageSlider = ({ reviewDocuments, shopRecords, onImageClick, autoPlay, interval }) => {

	const [currentIndex, setCurrentIndex] = useState(0);
	const [preArrow, setPreArrow] = useState(false);
	const [nextArrow, setNextArrow] = useState(true);
	const [images, setImages] = useState(reviewDocuments);

	useEffect(() => {
		setImages(reviewDocuments);
	}, [reviewDocuments]);

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


	const makeCoverPhoto = async (event, index) => {
		setPopoverImageActionDropdown(false);
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
		setPopoverImageActionDropdown(false);

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
		setPopoverImageActionDropdown(false);
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

	const [popoverImageActionDropdown, setPopoverImageActionDropdown] = useState(false);

	
	const togglePopoverImageActionDropdown = (index) => {
		setPopoverImageActionDropdown(popoverImageActionDropdown === index ? null : index);
	};

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

							<img onClick={() => onImageClick(image, image.type, index)} className={styles.img} src={getUploadDocument(image.thumbnail_name || image.url, shopRecords.shop_id)} alt={`Slide ${index}`} />

							<Popover
								active={popoverImageActionDropdown === index}
								activator={
									<div className={styles.menu_icon} onClick={() => togglePopoverImageActionDropdown(index)}>
										<Icon source={MenuVerticalIcon} />
									</div>
								}

								onClose={() => togglePopoverImageActionDropdown(index)}
								preferredAlignment="right"
							>
								<ActionList
									actionRole="menuitem"
									items={[
										image.is_cover === false && image.is_approve === true && {
											content: `Make cover ${image.type === "image" ? "photo" : "video"}`,
											onAction: (e) => makeCoverPhoto(e, index),
										},
										image.is_approve === false && {
											content: `Approve ${image.type === "image" ? "photo" : "video"}`,
											onAction: (e) => approvePhoto(e, index),
										},
										image.is_approve && {
											content: `Hide ${image.type === "image" ? "photo" : "video"}`,
											onAction: (e) => hidePhoto(e, index),
										},
										{
											content: `View ${image.type === "image" ? "photo" : "video"}`,
											onAction: (e) => openImageInNewTab(image.url),
										},
										{
											content: `Download ${image.type === "image" ? "photo" : "video"}`,
											onAction: (e) => downloadImage(image.url),
										},
									].filter(Boolean)}
								/>
							</Popover>


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

		</>

	);
};

export default ImageSlider;
