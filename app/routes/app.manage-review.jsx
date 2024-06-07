import { useEffect, useState, useRef } from "react";
import Breadcrumb from "./components/Breadcrumb";
import ReviewPageSidebar from "./components/headerMenu/ReviewPageSidebar";
import RatingSummary from "./components/manageReview/RatingSummary";
import ReviewItem from "./components/manageReview/ReviewItem";

import { mongoConnection } from './../utils/mongoConnection'; 
import { getShopDetails } from './../utils/common'; 
import { json } from "@remix-run/node";
import { Links, useLoaderData } from "@remix-run/react";
import { useNavigate } from 'react-router-dom';
import settings from './../utils/settings.json'; 
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { Image, Link } from "@shopify/polaris";
import reviewImage from "./../images/no-reviews-yet.svg"

import {
  Layout,
  Page,
  LegacyCard,
  Spinner,
  Card,Select, TextField, Button, FormLayout
} from "@shopify/polaris";

export async function loader({request}) {
	try {

		const shopRecords = await getShopDetails(request);
		const limit = 10;
	  
		const db = await mongoConnection();
		const countRating =  await db.collection("product-reviews").aggregate([
			{ $match: { shop_id: shopRecords._id } }, 
			{ $group: { _id: "$rating", count: { $sum: 1 } } }
		]).toArray();
		if(countRating.length > 0) {
			var outputRatting = countRating.map(item => ({
				stars: item._id,
				count: item.count
			}));

		} else {
			var outputRatting = [
				{ "stars" : 1, "count" : 0 },
				{ "stars" : 2, "count" : 0 },
				{ "stars" : 3, "count" : 0 },
				{ "stars" : 4, "count" : 0 },
				{ "stars" : 5, "count" : 0 },
			];
		}
		const defaultSearchParams = {
			"shop" : shopRecords.domain,
			"page" : 1,
			"limit" : 5,
			"filter_status" : "all",
			"filter_stars" : "all",
			"search_keyword" : "",
		}
		const reviewItems = await fetchAllReviewsApi(defaultSearchParams);
		
	  
		return json({"outputRatting" : outputRatting, "shopRecords" : shopRecords, "reviewItems" : reviewItems, "defaultSearchParams" : defaultSearchParams});
	  } catch (error) {
		console.error('Error fetching manage review:', error);
		return json({ error: 'Error fetching manage review' }, { status: 500 });
	}

}

export async function fetchAllReviewsApi(requestParams) {
    try {
        const response = await fetch(`${settings.host_url}/api/manage-review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestParams)
        });
		
       	const data = await response.json();
		console.log(data);
		return data;
	
    } catch (error) {
        console.error('Failed to fetch reviews:', error);
    }
};

export default function ManageReview() {
	const manageReviewData = useLoaderData();
	const [searchFormData, setSearchFormData] = useState(manageReviewData.defaultSearchParams);
	
	const [submitHandle, setSubmitHandle] = useState(false);
	const [hasMore, setHasMore] = useState(1);
	const [loading, setLoading] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState('all');
	const [selectedRating, setSelectedRating] = useState('all');
	
	const handleSelectStatusChange = (e) => {
		setSelectedStatus(e.target.value);
		setSearchFormData({ ...searchFormData, filter_status: e.target.value });
		
	};

	const handleSelectedRatingChange = (e) => {
		setSelectedRating(e.target.value);
		setSearchFormData({ ...searchFormData, filter_stars: e.target.value });
	};

  
	const handleChange = (e) => {
		setSearchFormData({ ...searchFormData, [e.target.name]: e.target.value });
	};
	const [filteredReviews, setFilteredReviews] = useState(manageReviewData.reviewItems.reviewItems);

	  
	const handleDeleteReviewItem = async (recordId) => {
		Swal.fire({
			title: 'Are you sure you want to delete this review?',
			text: "This action is irreversible, and the review will not be accessible again!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => { 
			if (result.isConfirmed) {
				try {
					const response = await fetch(`${settings.host_url}/api/manage-review`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({"review_id" : recordId})
					});
	
					const data = await response.json();
					console.log(data);
					if(data.status == 200) {
						toast.success(data.message);
					} else {
						toast.error(data.message);
					}
					// Assuming toast is a function to show notifications
				} catch (error) {
					console.error("Error deleting record:", error);
					// Handle error, show toast, etc.
					toast.error("Failed to delete record.");
				}
			}
		});
	};
	

	const filterStatusOptions = [
		{label: 'All', value: 'all'},
		{label: 'Published', value: 'publish'},
		{label: 'Unpublished', value: 'unpublish'},
	];
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
		(async() => {
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
			setLoading(false);
		})()
	}, [searchFormData.page, submitHandle]);

	const loadMore = async () => {
		setSearchFormData((prevData) => ({
			...prevData,
			page:prevData.page+1,
		}));
	};

	const [crumbs, setCrumbs] = useState([
		{"title" : "Review", "link" :"./../review"},
		{"title" : "Manage Review", "link" :""}
	]);
		
	const handleSubmit = (e) => {
		e.preventDefault();
		
		setSearchFormData((prevData) => ({
			...prevData,
			page: 1,
		}));
		setSubmitHandle(!submitHandle);

	};
  return (
	<>
	<Breadcrumb crumbs={crumbs}/>
	<Page fullWidth>
		<div className="row">
			<div className="col-sm-12">
				<ReviewPageSidebar />
			</div>
			{/* <div className="col-sm-12">
				<Layout.Section className="abcd">
					<LegacyCard sectioned>
						<RatingSummary ratingData={manageReviewData.outputRatting} />
					</LegacyCard>
				</Layout.Section>
			</div> */}
		</div>

		{/* <div className="row">
			<div className="col-sm-3">
			</div>
			<div className="col-sm-9">
				<Layout.Section>
					<LegacyCard sectioned>
						<Card sectioned>
							
							<form onSubmit={handleSubmit}>
								<input type="text" name="search_keyword" value={searchFormData.search_keyword} onChange={handleChange} placeholder="Enter keyword" />
								
								<select value={selectedStatus} onChange={handleSelectStatusChange}>
									<option value="all">All</option>
									<option value="pending">Pending</option>
									<option value="publish">Publish</option>
									<option value="unpublish">Unpublish</option>
								</select>

								<select value={selectedRating} onChange={handleSelectedRatingChange}>
									<option value="all">Any rating</option>
									<option value="5">5 stars</option>
									<option value="4">4 stars</option>
									<option value="3">3 stars</option>
									<option value="2">2 stars</option>
									<option value="1">1 star</option>
								</select>
								<button type="submit">Submit</button>
							</form>

						</Card>
					</LegacyCard>
				</Layout.Section>
			</div>
		</div> */}



		<div className="noreviewyetmain">
			<Layout.Section>
				{filteredReviews.length > 0 ?
					<>
						<ReviewItem filteredReviews = {filteredReviews} />
						<div ref={lastElementRef}>
							{loading && (
								<div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
									<Spinner size="large" />
								</div>
							)}
							
							<div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
								{hasMore == 1 ? "" : <p>No more reviews found!</p> }
							</div>
						
						</div>
					</>
				: 
					<>
					<div className="imageplustext">
						<div className="imagebox flxrow justify-content-center">
							<Image src={reviewImage} width={100} height={100} ></Image>
						</div>
						<h4>No reviews yet</h4>
						<p>Let's start collecting reviews. Try manually requesting or importing reviews.</p>
						<div className="btnwrap centeralign">
							<a href="#" className="revbtn lightbtn">Send manual request</a>
							<a href="#" className="revbtn">Import reviews</a>
						</div>
					</div>
					{/* Review section Start */}
						<div className="totalreviewdisplay flxrow">
							<div className="lefttotal flxfix flxcol">
								<h4>Reviews</h4>
								<p>Export all reviews to .csv file</p>
								<div className="bottomdetail mt-auto">
									<h6>5.0</h6>
									<div className="reviewcount">1 Reviews</div>
									<div className="ratingstars flxrow">
										<div className="inside_ratingstars">
											<div className="filledicon" style={{width: '52%'}}>
												<i className="starsico-stars"></i>
											</div>
											<div className="dficon">
												<i className="starsico-stars"></i>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="rightrating flxflexi">
								
							</div>
						</div>		
					{/* Review section End */}

					</>
				}	
			</Layout.Section>
		</div>


	</Page>
    </>
    
  );
}
