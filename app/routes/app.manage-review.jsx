import { useEffect, useState, useRef } from "react";
import Breadcrumb from "./components/Breadcrumb";
import ReviewPageSidebar from "./components/ReviewPageSidebar";
import RatingSummary from "./components/manageReview/RatingSummary";
import { mongoConnection } from './../utils/mongoConnection'; 
import { getShopDetails } from './../utils/common'; 
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useNavigate } from 'react-router-dom';
import { hostUrl } from './../utils/hostUrl'; 

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
        const response = await fetch(`${await hostUrl()}/api/manage-review`, {
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

	const options = [
		{label: 'Today', value: 'today'},
		{label: 'Yesterday', value: 'yesterday'},
		{label: 'Last 7 days', value: 'lastWeek'},
	  ];
	
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
			console.log('call apiss');
			const response = await fetchAllReviewsApi(searchFormData);
			if (searchFormData.page === 1) {
				console.log('inside');
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
		console.log("loadmore " + searchFormData.page);
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
		console.log(searchFormData);
		console.log("handleSubmit before " + searchFormData.page);

		setSearchFormData((prevData) => ({
			...prevData,
			page: 1,
		}));
		setSubmitHandle(!submitHandle);
		console.log("handleSubmit after " + searchFormData.page);

	};
  return (
	<>
	<Page fullWidth>
		<Breadcrumb crumbs={crumbs}/>
	</Page>
	<Page fullWidth>
		<div className="row">
			<div className="col-sm-3">
				<ReviewPageSidebar />
			</div>
			<div className="col-sm-9">
				<Layout.Section>
					<LegacyCard sectioned>
						<RatingSummary ratingData={manageReviewData.outputRatting} />
					</LegacyCard>
				</Layout.Section>
			</div>
		</div>

		<div className="row">
			<div className="col-sm-3">
			</div>
			<div className="col-sm-9">
				<Layout.Section>
					<LegacyCard sectioned>
						<Card sectioned>
							{/* <form action="/manage-review" method="GET">
								<FormLayout>
									<TextField
										label="Search"
										value=""
										autoComplete="off"
									/>
									<Select
										label="Filter"
										options={options}
									/>
									<Button submit  primary>Search</Button>
								</FormLayout>
							</form> */}

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
		</div>



		<div className="row">
			<div className="col-sm-3">
			</div>
			<div className="col-sm-9">
				<Layout.Section>
				{filteredReviews.map((result, index) => (
					<LegacyCard sectioned>
						<br/>
						<br/>
						<br/>
						<div key={index}>{result.first_name}</div>
						
					</LegacyCard>
					))}
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
					
				</Layout.Section>
			</div>
		</div>


	</Page>
    </>
    
  );
}
