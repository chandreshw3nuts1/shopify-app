import { useEffect, useState, useRef } from "react";
import Breadcrumb from "./components/Breadcrumb";
import ReviewPageSidebar from "./components/headerMenu/ReviewPageSidebar";
import RatingSummary from "./components/manageReview/RatingSummary";
import ReviewItem from "./components/manageReview/ReviewItem";

import { mongoConnection } from './../utils/mongoConnection'; 
import { getShopDetails } from './../utils/getShopDetails'; 
import { json } from "@remix-run/node";
import { Links, useLoaderData } from "@remix-run/react";
import { useNavigate } from 'react-router-dom';
import settings from './../utils/settings.json'; 
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { Image, Link } from "@shopify/polaris";
// import Dropdown from 'react-bootstrap/Dropdown';
import NiceSelect from './../NiceSelect/NiceSelect';

import reviewImage from "./../images/no-reviews-yet.svg"
import customerImage from "./../images/customer-image.jpg"
import mailBlueIcon from "./../images/blue-mail-icon.svg"

import facebookSocial from "./../images/Facebook-Original.svg"
import redditSocial from "./../images/Reddit-Original.svg"
import pinterestSocial from "./../images/Pinterest-Original.svg"

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
							<div className="rightrating flxflexi flxcol">
								<div className="ratingrow">
									<div className="starbox flxrow flxfix">5 <i className="starsico-single-star"></i></div>
									<div className="starlines flxflexi">
										<div className="filledpart" style={{width: '100%'}}></div>
									</div>
									<div className="percentageright flxfix">100%</div>
								</div>
								<div className="ratingrow">
									<div className="starbox flxrow flxfix">4 <i className="starsico-single-star"></i></div>
									<div className="starlines flxflexi">
										<div className="filledpart" style={{width: '0%'}}></div>
									</div>
									<div className="percentageright flxfix">0%</div>
								</div>
								<div className="ratingrow">
									<div className="starbox flxrow flxfix">3 <i className="starsico-single-star"></i></div>
									<div className="starlines flxflexi">
										<div className="filledpart" style={{width: '0%'}}></div>
									</div>
									<div className="percentageright flxfix">0%</div>
								</div>
								<div className="ratingrow">
									<div className="starbox flxrow flxfix">2 <i className="starsico-single-star"></i></div>
									<div className="starlines flxflexi">
										<div className="filledpart" style={{width: '0%'}}></div>
									</div>
									<div className="percentageright flxfix">0%</div>
								</div>
								<div className="ratingrow">
									<div className="starbox flxrow flxfix">1 <i className="starsico-single-star"></i></div>
									<div className="starlines flxflexi">
										<div className="filledpart" style={{width: '0%'}}></div>
									</div>
									<div className="percentageright flxfix">0%</div>
								</div>
							</div>
						</div>	
						<div className="filterandserchwrap">
							<form action="">
								<div className="row">
									<div className="col-lg-6">
										<div className="form-group">
											<label htmlFor="">Search</label>
											<input type="text" className="input_text" placeholder="Search by name, email and product" />
										</div>
									</div>
									<div className="col-lg-6">
										<div className="form-group">
											<label htmlFor="">Review</label>
											<select className="input_text">
												<option>All Reviews</option>
												<option>All Reviews</option>
												<option>All Reviews</option>
											</select>
										</div>
									</div>
									<div className="col-lg-6">
										<div className="form-group">
											<label htmlFor="">Ratings</label>
											<select className="input_text">
												<option>All Rating</option>
												<option>1 Reting</option>
												<option>2 Reting</option>
												<option>3 Reting</option>
												<option>4 Reting</option>
												<option>5 Reting</option>
											</select>
										</div>
									</div>
									<div className="col-lg-6">
										<div className="form-group">
											<label htmlFor="">Filter</label>
											<select className="input_text">
												<option>Photo & Video Reviews</option>
												<option>Only Photo</option>
												<option>Only Video</option>
											</select>
										</div>
									</div>
									<div className="col-lg-12">
										<div className="btnbox">
											<input type="submit" value="Search" className="revbtn" />
										</div>
									</div>
								</div>
							</form>
						</div>	
						<div className="dividerblk"></div>
						<div className="reviewlistblocks">
							<div className="topactions flxrow">
								<div className="reviewcounttop">
									<span>1</span>Reviews found
								</div>
								<div className="rightbox ms-auto">
									<NiceSelect id="a-select" placeholder="Bulk Actions" className="sampleClass">
										<option value="OP1">Option 1</option>
										<option value="OP2">Option 2</option>
									</NiceSelect>
								</div>
								{/* <Dropdown>
									<Dropdown.Toggle variant="success" id="dropdown-basic">
										Dropdown Button
									</Dropdown.Toggle>

									<Dropdown.Menu>
										<Dropdown.Item href="#/action-1">Action</Dropdown.Item>
										<Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
										<Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
									</Dropdown.Menu>
								</Dropdown> */}
							</div>
							<div className="reviewbunch">
								<div className="reviewrowbox">
									<div className="topline">
										<div className="imagebox flxfix">
											<Image src={customerImage} width={100} height={100} ></Image>
										</div>
										<div className="rightinfo flxflexi">
											<div className="titlebox">
												<div className="checkmark">
													<i className="twenty-checkicon"></i>
												</div>
												<h4 className="fleflexi"><strong>Yash Vora</strong> about <strong>New t-shirt</strong></h4>
											</div>
											<div className="displayname">Display name: Yash Patel</div>
											<div class="ratingstars flxrow">
												<div class="inside_ratingstars">
													<div class="filledicon" style={{width:'52%'}}>
														<i class="starsico-stars"></i>
														</div>
													<div class="dficon">
														<i class="starsico-stars"></i>
													</div>
												</div>
												<div className="rating_time">3 hours ago</div>
												<div className="reviewstatus flxrow">
													<Image src={mailBlueIcon} width={14} height={14} ></Image>
													Received through review request
												</div>
											</div>
											<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since.</p>
										</div>
										<div className="rightactions flxfix flxcol">
											<div className="sociallinks flxrow">
												<a href="#">
													<Image src={facebookSocial} width={24} height={24} ></Image>
												</a>
												<a href="#">
													<Image src={redditSocial} width={24} height={24} ></Image>
												</a>
												<a href="#">
													<Image src={pinterestSocial} width={24} height={24} ></Image>
												</a>
											</div>
											<div className="bottombuttons">
												<NiceSelect id="statusreviewpublishornot" className="sampleClass">
													<option value="OP1" iconAttr='twenty-checkicon' className="twenty-checkicon" selected>Option 1</option>
													<option value="OP2">Option 2</option>
												</NiceSelect>
											</div>
										</div>
									</div>
								</div>
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
