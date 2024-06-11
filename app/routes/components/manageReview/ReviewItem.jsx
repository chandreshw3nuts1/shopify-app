import {  useState } from "react";
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
import { Dropdown, DropdownButton } from 'react-bootstrap';
const dropdownButtonStyle = {
	backgroundColor: '#4CAF50', // Green background
	color: 'white', // White text
	border: 'none', // Remove border
  };

  

import {
    Layout,
    Page,
    LegacyCard,
    Spinner,
    Card,Select, TextField, Button, FormLayout,Image, Link
  } from "@shopify/polaris";

export default function ReviewItem({filteredReviews, setFilteredReviews, filteredReviewsTotal}) {

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

	const handleRatingStatusChange = async (statusValue, index) => {
		console.log(index);

		console.log(filteredReviews[index]);

		const updateData = {
			actionType: "changeReviewStatus",
			value: statusValue,
			oid: filteredReviews[index]._id,
		};
		await fetch('/api/manage-review', {
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


    return(
		<>
			
			<div className="reviewlistblocks">
				<div className="topactions flxrow">
					<div className="reviewcounttop">
						<span>{filteredReviewsTotal}</span>Reviews found
					</div>
					<div className="rightbox ms-auto">
						<NiceSelect id="a-select" placeholder="Bulk Actions" className="sampleClass">
							<option value="OP1">Option 1</option>
							<option value="OP2">Option 2</option>
						</NiceSelect>
					</div>
				</div>
				
				{filteredReviews.map((result, index) => (
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
										<h4 className="fleflexi"><strong>{result.first_name} {result.last_name}</strong> about <strong>New t-shirt</strong></h4>
									</div>
									<div className="displayname">Display name: {result.first_name}</div>
									<div class="ratingstars flxrow">
										<div class="inside_ratingstars">
											<div class="filledicon" style={{width:`${result.rating*20}%`}}>
												<i class="starsico-stars"></i>
												</div>
											<div class="dficon">
												<i class="starsico-stars"></i>
											</div>
										</div>
										<div className="rating_time">{formatTimeAgo(result.created_at)}</div>
										<div className="reviewstatus flxrow">
											<Image src={mailBlueIcon} width={14} height={14} ></Image>
											Received through review request
										</div>
									</div>

										<div className="timeline-body">
											<div className="row">
												{result.reviewQuestions.map((revItem, rIndex) => (
													<div className="col-md-3">
														<div className="small text-muted">q22</div>
														<span>{revItem.answer}</span>
													</div>
												))}

											</div>
										</div>


									<p>{result.description}</p>
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
										
										<DropdownButton  id="dropdown-basic-button" onSelect={(e) => handleRatingStatusChange(e, index)} title={result.status == 'publish' ? "Published" : "Unpublished"}>
											<Dropdown.Item eventKey="publish" className="custom-dropdown-item">Publish</Dropdown.Item>
											<Dropdown.Item eventKey="unpublish" className="custom-dropdown-item">Unpublish</Dropdown.Item>
										</DropdownButton>
										
									</div>
									
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</>
    )
}