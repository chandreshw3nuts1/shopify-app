import { useEffect, useState, useCallback , useRef} from "react";
import { useLoaderData } from "@remix-run/react";
import style from "./RatingSummary.module.css";
// import StarRating from './StarRating';
import RatingIcons from './RatingIcons';

const RatingSummary = ({ ratingData}) => {
	const totalReviews = ratingData.reduce((acc, item) => acc + item.count, 0);
	const averageRating = (ratingData.reduce((acc, item) => acc + item.stars * item.count, 0) / totalReviews).toFixed(1); 
	const percentageReview = (100 * averageRating) / 5;

	let five_start_percent = 0;
	let four_start_percent = 0;
	let three_start_percent = 0;
	let two_start_percent = 0;
	let one_start_percent = 0;
	ratingData.forEach(item => {
		if(item.stars == 5){
			five_start_percent = Math.round((item.count /totalReviews) * 100);
		} else if(item.stars == 4) {
			four_start_percent = Math.round((item.count /totalReviews) * 100);
		} else if(item.stars == 3) {
			three_start_percent = Math.round((item.count /totalReviews) * 100);
		} else if(item.stars == 2) {
			two_start_percent = Math.round((item.count /totalReviews) * 100);
		} else if(item.stars == 1) {
			one_start_percent = Math.round((item.count /totalReviews) * 100);
		}
	});
  return (
    <div className="totalreviewdisplay flxrow">
		<div className="lefttotal flxfix flxcol">
			<h4>Reviews</h4>
			<p>Export all reviews to .csv file</p>
			<div className="bottomdetail mt-auto">
				<h6>{averageRating}</h6>
				<div className="reviewcount">{totalReviews} Reviews</div>
				<div className="ratingstars flxrow">
					<div className="inside_ratingstars">
						<div className="filledicon" style={{width: `${percentageReview}%` }}>
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
					<div className="filledpart" style={{width: `${five_start_percent}%`}}></div>
				</div>
				<div className="percentageright flxfix">{five_start_percent}%</div>
			</div>
			<div className="ratingrow">
				<div className="starbox flxrow flxfix">4 <i className="starsico-single-star"></i></div>
				<div className="starlines flxflexi">
					<div className="filledpart" style={{width: `${four_start_percent}%`}}></div>
				</div>
				<div className="percentageright flxfix">{four_start_percent}%</div>
			</div>
			<div className="ratingrow">
				<div className="starbox flxrow flxfix">3 <i className="starsico-single-star"></i></div>
				<div className="starlines flxflexi">
					<div className="filledpart" style={{width: `${three_start_percent}%`}}></div>
				</div>
				<div className="percentageright flxfix">{three_start_percent}%</div>
			</div>
			<div className="ratingrow">
				<div className="starbox flxrow flxfix">2 <i className="starsico-single-star"></i></div>
				<div className="starlines flxflexi">
					<div className="filledpart" style={{width: `${two_start_percent}%`}}></div>
				</div>
				<div className="percentageright flxfix">{two_start_percent}%</div>
			</div>
			<div className="ratingrow">
				<div className="starbox flxrow flxfix">1 <i className="starsico-single-star"></i></div>
				<div className="starlines flxflexi">
					<div className="filledpart" style={{width: `${one_start_percent}%`}}></div>
				</div>
				<div className="percentageright flxfix">{one_start_percent}%</div>
			</div>
		</div>
	</div>
  );
};

export default RatingSummary;
