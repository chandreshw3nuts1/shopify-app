import { useEffect, useState, useRef } from "react";
import Breadcrumb from "./components/Breadcrumb";
import ReviewPageSidebar from "./components/ReviewPageSidebar";
import RatingSummary from "./components/manageReview/RatingSummary";
import { mongoConnection } from './../utils/mongoConnection'; 
import { getShopDetails } from './../utils/common'; 
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useNavigate } from 'react-router-dom';
//import useScrollToBottom from './../hooks/useScrollToBottom'; // Import the custom hook

import {
  Layout,
  Page,
  LegacyCard,
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
			"limit" : 2,
			"filter_status" : "default params",
			"param2" : "default params 2",
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
		
        const response = await fetch(`https://generations-puzzles-assure-pharmaceutical.trycloudflare.com/api/manage-review`, {
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

	const [hasMore, setHasMore] = useState(1);
	const [loading, setLoading] = useState(false);

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
		if (!hasMore ) return;
		
		const handleObserver = (entries) => {
			const target = entries[0];
			if (target.isIntersecting) {
				loadMore();
			}
		};

		observer.current = new IntersectionObserver(handleObserver, {
			root: null,
			rootMargin: "20px",
			threshold: 1.0,
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

	console.log(filteredReviews)
	useEffect(() => {
		(async() => {
			setLoading(true);
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
	}, [searchFormData.page]);

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
		
	const  handleSubmit = (e) => {
		e.preventDefault();
		setSearchFormData((prevData) => ({
			...prevData,
			page: 1,
		}));
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
								<input type="text" name="param1" value={searchFormData.param1} onChange={handleChange} placeholder="Enter param1" />
								<Select
										label="Date range"
										name="filter_status"
										options={filterStatusOptions}
										onChange={handleChange}
										value={searchFormData.param2}
										/>
								<input type="text" name="param2" value={searchFormData.param2} onChange={handleChange} placeholder="Enter param2" />
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
						
						<div key={index} ref={index === filteredReviews.length - 1 ? lastElementRef : null}>{result.first_name}</div>
						
					</LegacyCard>
					))}
					{loading && <p>Loading...</p>}
				</Layout.Section>
			</div>
		</div>


	</Page>
    </>
    
  );
}
