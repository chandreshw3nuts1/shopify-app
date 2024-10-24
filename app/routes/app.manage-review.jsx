import { useEffect, useState, useRef, useCallback } from "react";
import Breadcrumb from "./components/Breadcrumb";
import ReviewPageSidebar from "./components/headerMenu/ReviewPageSidebar";
import RatingSummary from "./components/manageReview/RatingSummary";
import ReviewItem from "./components/manageReview/ReviewItem";
import { useNavigate } from 'react-router-dom';
import generalSettings from './models/generalSettings';
import { getUploadDocument } from './../utils/documentPath';

import { mongoConnection } from './../utils/mongoConnection';
import { getShopDetails } from './../utils/getShopDetails';
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import settingsJson from './../utils/settings.json';
const reviewImage = `/images/no-reviews-yet.svg`;
import { Modal, TitleBar } from '@shopify/app-bridge-react';

import {
	Layout,
	Page,
	Spinner,
	Image,
	Box,
	Card, Button, Text, InlineGrid, InlineStack, TextField, Select
} from "@shopify/polaris";

export async function loader({ request }) {
	try {

		const shopRecords = await getShopDetails(request);
		const limit = settingsJson.page_limit;

		const db = await mongoConnection();
		const countRating = await db.collection("product_reviews").aggregate([
			{ $match: { shop_id: shopRecords._id } },
			{ $group: { _id: "$rating", count: { $sum: 1 } } }
		]).toArray();

		if (countRating.length > 0) {
			var outputRatting = countRating.map(item => ({
				stars: item._id,
				count: item.count
			}));

		} else {
			var outputRatting = [
				{ "stars": 1, "count": 0 },
				{ "stars": 2, "count": 0 },
				{ "stars": 3, "count": 0 },
				{ "stars": 4, "count": 0 },
				{ "stars": 5, "count": 0 },
			];
		}
		const defaultSearchParams = {
			"shop": shopRecords.shop,
			"page": 1,
			"limit": limit,
			"filter_status": "all",
			"filter_stars": "all",
			"search_keyword": "",
			"filter_options": "all",
		}

		const generalSettingsModel = await generalSettings.findOne({
			shop_id: shopRecords._id
		});
		shopRecords.reviewers_name_format = generalSettingsModel.reviewers_name_format;
		return json({ "outputRatting": outputRatting, "countRating": countRating.length, "shopRecords": shopRecords, "defaultSearchParams": defaultSearchParams });
	} catch (error) {
		console.error('Error fetching manage review:', error);
		return json({ error: 'Error fetching manage review' }, { status: 500 });
	}

}

export async function fetchAllReviewsApi(requestParams) {
	try {
		const response = await fetch(`${settingsJson.host_url}/api/manage-review`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(requestParams)
		});

		const data = await response.json();
		return data;

	} catch (error) {
		console.error('Failed to fetch reviews:', error);
	}
}

export default function ManageReview() {
	const manageReviewData = useLoaderData();
	const [searchFormData, setSearchFormData] = useState(manageReviewData.defaultSearchParams);
	const [countRating, setCountRating] = useState(manageReviewData.countRating);
	const shopRecords = manageReviewData.shopRecords;
	const navigate = useNavigate();

	const [submitHandle, setSubmitHandle] = useState(false);
	const [hasMore, setHasMore] = useState(1);
	const [loading, setLoading] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [selectedRating, setSelectedRating] = useState('all');
	const [selectedFilterOptions, setSelectedFilterOptions] = useState('all');

	const handleSelectChange = (value, name) => {
		setSelectedStatus(value);
		setSearchFormData({ ...searchFormData, [name]: value });
	}

	const handleChange = useCallback(
		(value, name) => {
			setSearchFormData({ ...searchFormData, [name]: value });
		}
	)

	const [filteredReviews, setFilteredReviews] = useState([]);
	const [filteredReviewsTotal, setFilteredReviewsTotal] = useState(0);


	const observer = useRef();
	const lastElementRef = useRef();

	useEffect(() => {
		if (!hasMore || loading) return;

		const handleObserver = (entries) => {
			const target = entries[0];
			if (target.isIntersecting) {
				loadMore();
			}
		};

		observer.current = new IntersectionObserver(handleObserver, {
			root: null,
			rootMargin: '0px',
			threshold: 0.1,
		});

		if (lastElementRef.current) {
			observer.current.observe(lastElementRef.current);
		}

		return () => {
			if (observer.current && lastElementRef.current) {
				observer.current.unobserve(lastElementRef.current);
			}
		};
	}, [lastElementRef, hasMore]);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const response = await fetchAllReviewsApi(searchFormData);
			if (searchFormData.page === 1) {
				setFilteredReviews([...response.reviewItems]);
			} else {
				setFilteredReviews(prevData => ([
					...prevData,    // Spread the existing data
					...response.reviewItems      // Spread the new data
				]));
			}
			setHasMore(response.hasMore);
			setFilteredReviewsTotal(response.totalReviewItems);

			setLoading(false);

		})()
	}, [searchFormData.page, submitHandle]);

	const loadMore = async () => {
		setSearchFormData((prevData) => ({
			...prevData,
			page: prevData.page + 1,
		}));
	};

	const [crumbs, setCrumbs] = useState([
		{ title: "Review", "link": "./../review" },
		{ title: "Manage review", "link": "" }
	]);

	const handleSubmit = (e) => {
		e.preventDefault();

		setSearchFormData((prevData) => ({
			...prevData,
			page: 1,
		}));
		setSubmitHandle(!submitHandle);

	};
	const showManualRequestForm = (e) => {
		e.preventDefault();
		navigate('/app/manual-review-requests/');
	};

	const showImportReviewForm = (e) => {
		e.preventDefault();
		navigate('/app/import-review/');
	};

	const [showImageModal, setShowImageModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [documentType, setDocumentType] = useState('image');

	const handleCloseImageModal = () => {
		setShowImageModal(false);
		setSelectedImage(null);
		setDocumentType('image');
	};
	const handleShowImageModal = (image, type, index) => {
		setSelectedImage(image);
		setDocumentType(type);
		setShowImageModal(true);
	};

	return (
		<>
			<Breadcrumb crumbs={crumbs} />
			<Page fullWidth>
				<div className="row">
					<div className="col-sm-12">
						<ReviewPageSidebar />
					</div>
				</div>

				<div className="noreviewyetmain">
					<Layout.Section>
						{countRating > 0 ?
							<>
								<RatingSummary shopRecords={shopRecords} ratingData={manageReviewData.outputRatting} />
								<Card padding="400" roundedAbove="xs">
									<form onSubmit={handleSubmit}>
										<Box paddingBlock="200">
											<InlineGrid gap="400" columns={['oneHalf', 'oneHalf']} alignItems="center">
												<Box>
													<TextField
														label="Search"
														value={searchFormData.search_keyword}
														onChange={(value) => handleChange(value, 'search_keyword')}
														autoComplete="off"
														placeholder="Search by name, email and product"
													/>
												</Box>
												<Box>
													<Select
														label="Status"
														options={settingsJson.searchStatusOptions}
														onChange={(value) => handleSelectChange(value, "filter_status")}
														value={searchFormData.filter_status}
													/>
												</Box>
											</InlineGrid>
										</Box>

										<Box paddingBlock="200">
											<InlineGrid gap="400" columns={['oneHalf', 'oneHalf']} alignItems="center">
												<Box>
													<Select
														label="Ratings"
														options={settingsJson.searchRatingOptions}
														onChange={(value) => handleSelectChange(value, "filter_stars")}
														value={searchFormData.filter_stars}
													/>
												</Box>
												<Box>
													<Select
														label="Filter"
														options={settingsJson.searchFilterOptions}
														onChange={(value) => handleSelectChange(value, "filter_options")}
														value={searchFormData.filter_options}
													/>
												</Box>
											</InlineGrid>
										</Box>
										<Box paddingBlock="200">
											<Button submit={true} variant="primary">Search</Button>
										</Box>
									</form>
								</Card>

								<div className="dividerblk"></div>
								<ReviewItem filteredReviews={filteredReviews} setFilteredReviews={setFilteredReviews} filteredReviewsTotal={filteredReviewsTotal} setFilteredReviewsTotal={setFilteredReviewsTotal} shopRecords={shopRecords} searchFormData={searchFormData} setSubmitHandle={setSubmitHandle} submitHandle={submitHandle} setSearchFormData={setSearchFormData} onImageClick={handleShowImageModal} />
								<div ref={lastElementRef}>
									{loading && (
										<div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
											<Spinner size="large" />
										</div>
									)}

									<div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
										{hasMore == 1 ? "" : <p>No more reviews found!</p>}
									</div>

								</div>
							</>
							:
							<div className="imageplustext">
								<div className="imagebox flxrow justify-content-center">
									<Image src={reviewImage} width={100} height={100} ></Image>
								</div>
								<h4>No reviews yet</h4>
								<p>Let's start collecting reviews. Try manually requesting or importing reviews.</p>
								<div className="btnwrap centeralign">
									<a href="#" className="revbtn lightbtn" onClick={showManualRequestForm}>Send manual request</a>
									<a href="#" className="revbtn" onClick={showImportReviewForm}>Import reviews</a>
								</div>
							</div>
						}
					</Layout.Section>
				</div>


			</Page>

			{showImageModal && (
				<Modal
					variant="large"
					open={showImageModal}
					onHide={handleCloseImageModal}
				>
					<TitleBar title={documentType === 'image' ? "View Image" : "View Video"}>
					</TitleBar>
					<Box padding="500">

						{documentType === 'image' && selectedImage?.url ? (
							<img
								src={getUploadDocument(selectedImage.url, shopRecords.shop_id)}
								alt='Selected'
								style={{ width: '100%', objectFit: 'contain' }}
							/>
						) : documentType === 'video' && selectedImage?.url ? (
							<video controls style={{ width: "100%" }}>
								<source src={getUploadDocument(selectedImage.url, shopRecords.shop_id)} type='video/mp4' />
							</video>
						) : (
							<p>No content to display</p>
						)}
					</Box>
				</Modal>
			)}
		</>

	);
}
