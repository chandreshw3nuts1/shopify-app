import { useEffect, useState, useCallback } from "react";
import ReviewItem from './review-item';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import FullStarGrIcon from "../icons/FullStarGrIcon";
import FilterIcon from "../icons/FilterIcon";
import AllStarBigIcon from "../icons/AllStarBigIcon";

const ProductReviewWidget = ({ shopRecords, reviewItems, formParams, generalAppearancesModel, CommonRatingComponent }) => {

	let five_start_percent, five_start_count = 0;
	let four_start_percent, four_start_count = 0;
	let three_start_percent, three_start_count = 0;
	let two_start_percent, two_start_count = 0;
	let one_start_percent, one_start_count = 0;
	formParams.mapRatting.forEach(item => {
		if (item.stars == 5) {
			five_start_count = item.count;
			five_start_percent = Math.round((item.count / formParams.totalReviewItems) * 100);

		} else if (item.stars == 4) {
			four_start_count = item.count;
			four_start_percent = Math.round((item.count / formParams.totalReviewItems) * 100);

		} else if (item.stars == 3) {
			three_start_count = item.count;
			three_start_percent = Math.round((item.count / formParams.totalReviewItems) * 100);

		} else if (item.stars == 2) {
			two_start_count = item.count;
			two_start_percent = Math.round((item.count / formParams.totalReviewItems) * 100);

		} else if (item.stars == 1) {
			one_start_count = item.count;
			one_start_percent = Math.round((item.count / formParams.totalReviewItems) * 100);

		}
	});

	
	return (
		<>
			{
				formParams.page == 1 ? <div className="container">

					<div className="review_top_actions" style={{fontFamily: generalAppearancesModel.widgetFont}}>
						<div className="left_actions flxfix">
							<div className="section_title">Customer Reviews</div>
							<div className="star-rating">
								<div className="dropdown">
									<button className="dropdown-toggle starbtn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
										<div className={`ratingstars flxrow star-${formParams.averageRating}`}>
											<div>
												{CommonRatingComponent ? <CommonRatingComponent color={formParams.averageRating >= 1 ? generalAppearancesModel.starIconColor : "currentColor"} /> : null}
												{CommonRatingComponent ? <CommonRatingComponent color={formParams.averageRating >= 2 ? generalAppearancesModel.starIconColor : "currentColor"} /> : null}
												{CommonRatingComponent ? <CommonRatingComponent color={formParams.averageRating >= 3 ? generalAppearancesModel.starIconColor : "currentColor"} /> : null}
												{CommonRatingComponent ? <CommonRatingComponent color={formParams.averageRating >= 4 ? generalAppearancesModel.starIconColor : "currentColor"} /> : null}
												{CommonRatingComponent ? <CommonRatingComponent color={formParams.averageRating >= 5 ? generalAppearancesModel.starIconColor : "currentColor"} /> : null}
											</div>


										</div>
										{formParams.totalReviewItems > 0 &&
											<>
												<div className='ratingcount'>{formParams.averageRating} out of <span>5</span></div>
												<div className="arrowright">
													<ArrowDownIcon />
												</div>
											</>
										}
									</button>
									{formParams.totalReviewItems > 0 &&
										<>
											<ul className="dropdown-menu">
												<div className="stardetaildd">
													<div className="stardetailrow flxrow">
														<div className="sratnumber" data-review={five_start_count}>5</div>
														<div className="starsicons flxrow star-5">

															<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="5" />

														</div>
														<div className="processbar"><div className="activebar" style={{ width: `${five_start_percent}%` }}></div></div>
														<div className="reviewgiven">({five_start_count})</div>
													</div>
													<div className="stardetailrow flxrow">
														<div className="sratnumber" data-review={four_start_count}>4</div>
														<div className="starsicons flxrow star-4">
															<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="4" />

														</div>
														<div className="processbar"><div className="activebar" style={{ width: `${four_start_percent}%` }}></div></div>
														<div className="reviewgiven">({four_start_count})</div>
													</div>
													<div className="stardetailrow flxrow">
														<div className="sratnumber" data-review={three_start_count}>3</div>
														<div className="starsicons flxrow star-3">
															<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="3" />

														</div>
														<div className="processbar"><div className="activebar" style={{ width: `${three_start_percent}%` }}></div></div>
														<div className="reviewgiven">({three_start_count})</div>
													</div>
													<div className="stardetailrow flxrow">
														<div className="sratnumber" data-review={two_start_count}>2</div>
														<div className="starsicons flxrow star-2">
															<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="2" />

														</div>
														<div className="processbar"><div className="activebar" style={{ width: `${two_start_percent}%` }}></div></div>
														<div className="reviewgiven">({two_start_count})</div>
													</div>
													<div className="stardetailrow flxrow">
														<div className="sratnumber" data-review={one_start_count}>1</div>
														<div className="starsicons flxrow star-1">
															<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="1" />

														</div>
														<div className="processbar"><div className="activebar" style={{ width: `${one_start_percent}%` }}></div></div>
														<div className="reviewgiven">({one_start_count})</div>
													</div>
												</div>
												<input type="hidden" id="ratting_wise_filter" value={formParams.filterByRatting} />
											</ul>
										</>
									}
								</div>
							</div>
							{formParams.totalReviewItems > 0 &&
								<div className="totalreviewcount">
									<span>{formParams.totalReviewItems}</span> global ratings
								</div>
							}
						</div>
						<div className="right_actions btnwrap flxflexi flxrow justify-content-end">
							<div className="dropdown dropdown-center d-none">
								<button className="dropdown-toggle revbtn lightbtn wbigbtn noafter" type="button" data-bs-toggle="dropdown" aria-expanded="false">
									<FullStarGrIcon />
									05
									<div className="arrowright">
										<ArrowDownIcon />
									</div>
								</button>
								<ul className="dropdown-menu dropdown-menu-end">
									<li><a className="dropdown-item" href="#">01</a></li>
									<li><a className="dropdown-item" href="#">02</a></li>
									<li><a className="dropdown-item" href="#">03</a></li>
									<li><a className="dropdown-item" href="#">04</a></li>
									<li><a className="dropdown-item" href="#">05</a></li>
								</ul>
							</div>
							<div className="dropdown">
								<button className="dropdown-toggle revbtn lightbtn wbigbtn noafter" type="button" data-bs-toggle="dropdown" aria-expanded="false">
									<FilterIcon />
									Sort By
									<div className="arrowright">
										<ArrowDownIcon />
									</div>
								</button>
								{formParams.totalReviewItems > 0 &&
									<>	<ul className="dropdown-menu dropdown-menu-end">
										<li><a className="dropdown-item sort_by_filter" data-sort="tag_as_feature" href="#">Featured</a></li>
										<li><a className="dropdown-item sort_by_filter" data-sort="newest" href="#">Newest</a></li>
										<li><a className="dropdown-item sort_by_filter" data-sort="highest_ratings" href="#">Highest Rating</a></li>
										<li><a className="dropdown-item sort_by_filter" data-sort="lowest_ratings" href="#">Lowest Rating</a></li>
									</ul>
										<input type="hidden" id="sort_by_filter" value={formParams.sortBy} />
									</>
								}
							</div>
							{formParams.productId != "" ? <button className="revbtn wbigbtn" id="show_create_review_modal" >Create Review</button> : ""}
						</div>
					</div>

					{reviewItems.length > 0 ?
						<div className="main_review_block">

							<ReviewItem reviewItems={reviewItems} formParams={formParams} shopRecords={shopRecords} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={CommonRatingComponent} />

						</div>
						:
						<>
							<div className="text-center">
								<label >Be the first to </label>
								{formParams.productId != "" ? <a className="" href="#" id="show_create_review_modal" > Write a review</a> : ""}
							</div>

						</>
					}
					{formParams.hasMore == 1 ?
						<div className="load_more_review">
							<a href="javascript:void(0)" url="javascript:void(0)" id="load_more_review" className="revbtn">Load more</a>
						</div> :
						""
					}
				</div > :

					<ReviewItem reviewItems={reviewItems} formParams={formParams} shopRecords={shopRecords} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={CommonRatingComponent} />

			}
		</>

	);

}

export default ProductReviewWidget;
