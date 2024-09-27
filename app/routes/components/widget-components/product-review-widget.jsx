import { useEffect, useState, useCallback } from "react";
import ReviewItem from './review-item';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import FullStarGrIcon from "../icons/FullStarGrIcon";
import FilterIcon from "../icons/FilterIcon";
import AllStarBigIcon from "../icons/AllStarBigIcon";

const ProductReviewWidget = ({ shopRecords, reviewItems, formParams, generalAppearancesModel, CommonRatingComponent, otherProps }) => {
	const { translations, productReviewWidgetCustomizesModel, languageWiseProductWidgetSettings } = otherProps;
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
	let globalReviewText = "";
	if (formParams.totalReviewItems > 1) {
		globalReviewText = languageWiseProductWidgetSettings.reviewPlural ? languageWiseProductWidgetSettings.reviewPlural : translations.productReviewConstomize.reviewPlural
	} else {
		globalReviewText = languageWiseProductWidgetSettings.reviewSingular ? languageWiseProductWidgetSettings.reviewSingular : translations.productReviewConstomize.reviewSingular

	}
	let headerTextColor = "",
		buttonBorderColor = "",
		buttonTitleColor = "",
		buttonBackgroundOnHover = "",
		buttonTextOnHover = "",
		buttonBackground = "",
		starsBarBackground = "",
		starsBarFill = "";

	if (productReviewWidgetCustomizesModel.widgetColor == 'custom') {
		headerTextColor = productReviewWidgetCustomizesModel.headerTextColor;
		buttonBorderColor = `1px solid ${productReviewWidgetCustomizesModel.buttonBorderColor}`;
		buttonTitleColor = productReviewWidgetCustomizesModel.buttonTitleColor;
		buttonBackground = productReviewWidgetCustomizesModel.buttonBackground;
		buttonBackgroundOnHover = productReviewWidgetCustomizesModel.buttonBackgroundOnHover;
		buttonTextOnHover = productReviewWidgetCustomizesModel.buttonTextOnHover;
		starsBarBackground = productReviewWidgetCustomizesModel.starsBarBackground;
		starsBarFill = productReviewWidgetCustomizesModel.starsBarFill;
	} else if (productReviewWidgetCustomizesModel.widgetColor == 'white') {
		headerTextColor = '#ffffff';
		buttonBorderColor = `1px solid #ffffff`;
		buttonTextOnHover = '#000000';
	}
	let reviewWidgetLayoutWidth = "100%";
	let gridClassName = 'full-grid';
	if (productReviewWidgetCustomizesModel.widgetLayout == 'grid') {
		reviewWidgetLayoutWidth = "33.33%";
		gridClassName = 'grid-four-column';
	} else if (productReviewWidgetCustomizesModel.widgetLayout == 'compact') {
		reviewWidgetLayoutWidth = "50%";
		gridClassName = 'grid-two-column';
	}
	// console.log(productReviewWidgetCustomizesModel.headerLayout);
	const minimalHeader = productReviewWidgetCustomizesModel.headerLayout === 'minimal';
	const compactHeader = productReviewWidgetCustomizesModel.headerLayout === 'compact';
	const expandedHeader = productReviewWidgetCustomizesModel.headerLayout === 'expanded';

	return (
		<>
			<style>
				{`
					.custombtn:hover {
						background-color: ${buttonBackgroundOnHover} !important;
						color : ${buttonTextOnHover} !important;
					}
					.review_top_actions .stardetaildd .stardetailrow .processbar .activebar {
						background-color: ${starsBarFill} !important;
					}

					.review_top_actions .stardetaildd .stardetailrow .processbar {
						background-color: ${starsBarBackground} !important;
					}

					.w3grid-review-item {
						width: ${reviewWidgetLayoutWidth};
						margin : 24px 0 0 0;
						padding: 0;
						box-sizing: border-box;
					}
					.w3grid-review-item.grid-two-column,
					.w3grid-review-item.grid-four-column { padding: 0 12px;}
				`}
			</style>
			{
				formParams.page == 1 ? <div className="">

					<div className={` review_top_actions ${minimalHeader ? 'minimalheader' : 'otherheaderlayout'} ${compactHeader ? 'compactheader' : ''} ${expandedHeader ? 'expandedheader' : ''}`} style={{ fontFamily: generalAppearancesModel.widgetFont }}>
						<div className={`left_actions flxfix ${minimalHeader ? '' : 'sidebyside'}`}>
							<div className="leftpart">
								<div className="section_title" style={{ color: headerTextColor }}>{languageWiseProductWidgetSettings.reviewHeaderTitle ? languageWiseProductWidgetSettings.reviewHeaderTitle : translations.productReviewConstomize.reviewHeaderTitle}</div>
								{CommonRatingComponent && !minimalHeader &&
									<div className="bigcountavarage flxrow">
										<CommonRatingComponent color={formParams.averageRating >= 1 ? generalAppearancesModel.starIconColor : "currentColor"} />
										<div className="averagetext">{formParams.averageRating}</div>
									</div>
								}
								{formParams.totalReviewItems > 0 && !minimalHeader &&
									<div className="totalreviewcount" style={{ color: headerTextColor }}>
										<span>{formParams.totalReviewItems}</span> {globalReviewText}
									</div>
								}
							</div>
							<div className="rightpart">
								{(formParams.totalReviewItems > 0 && productReviewWidgetCustomizesModel.showRatingsDistribution) && !minimalHeader &&
									<div className="stardetaildd">
										<div className="stardetailrow flxrow product_widget_stardetailrow">
											<div className="sratnumber d-none" data-review={five_start_count}>5</div>
											<div className="starsicons flxrow star-5">

												<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="5" />

											</div>
											<div className="processbar"><div className="activebar" style={{ width: `${five_start_percent}%` }}></div></div>
											<div className="reviewgiven">({five_start_count})</div>
										</div>
										<div className="stardetailrow flxrow product_widget_stardetailrow">
											<div className="sratnumber d-none" data-review={four_start_count}>4</div>
											<div className="starsicons flxrow star-4">
												<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="4" />

											</div>
											<div className="processbar"><div className="activebar" style={{ width: `${four_start_percent}%` }}></div></div>
											<div className="reviewgiven">({four_start_count})</div>
										</div>
										<div className="stardetailrow flxrow product_widget_stardetailrow">
											<div className="sratnumber d-none" data-review={three_start_count}>3</div>
											<div className="starsicons flxrow star-3">
												<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="3" />

											</div>
											<div className="processbar"><div className="activebar" style={{ width: `${three_start_percent}%` }}></div></div>
											<div className="reviewgiven">({three_start_count})</div>
										</div>
										<div className="stardetailrow flxrow product_widget_stardetailrow">
											<div className="sratnumber d-none" data-review={two_start_count}>2</div>
											<div className="starsicons flxrow star-2">
												<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="2" />

											</div>
											<div className="processbar"><div className="activebar" style={{ width: `${two_start_percent}%` }}></div></div>
											<div className="reviewgiven">({two_start_count})</div>
										</div>
										<div className="stardetailrow flxrow product_widget_stardetailrow">
											<div className="sratnumber d-none" data-review={one_start_count}>1</div>
											<div className="starsicons flxrow star-1">
												<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="1" />

											</div>
											<div className="processbar"><div className="activebar" style={{ width: `${one_start_percent}%` }}></div></div>
											<div className="reviewgiven">({one_start_count})</div>
										</div>
										<input type="hidden" id="ratting_wise_filter" value={isNaN(formParams.filterByRatting) ? "" : formParams.filterByRatting} />
									</div>
								}
								{minimalHeader &&
									<div className="star-rating">
										<div className="dropdown">
											<button className="dropdown-toggle starbtn" style={{ color: headerTextColor }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
														<div className='ratingcount' style={{ color: headerTextColor }}  >{formParams.averageRating} {translations.out_of} <span>5</span></div>
														{productReviewWidgetCustomizesModel.showRatingsDistribution &&
															<div className="arrowright">
																<ArrowDownIcon />
															</div>
														}
													</>
												}
											</button>
											{(formParams.totalReviewItems > 0 && productReviewWidgetCustomizesModel.showRatingsDistribution) &&
												<>
													<ul className="dropdown-menu">
														<div className="stardetaildd">
															<div className="stardetailrow flxrow product_widget_stardetailrow">
																<div className="sratnumber d-none" data-review={five_start_count}>5</div>
																<div className="starsicons flxrow star-5">

																	<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="5" />

																</div>
																<div className="processbar"><div className="activebar" style={{ width: `${five_start_percent}%` }}></div></div>
																<div className="reviewgiven">({five_start_count})</div>
															</div>
															<div className="stardetailrow flxrow product_widget_stardetailrow">
																<div className="sratnumber d-none" data-review={four_start_count}>4</div>
																<div className="starsicons flxrow star-4">
																	<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="4" />

																</div>
																<div className="processbar"><div className="activebar" style={{ width: `${four_start_percent}%` }}></div></div>
																<div className="reviewgiven">({four_start_count})</div>
															</div>
															<div className="stardetailrow flxrow product_widget_stardetailrow">
																<div className="sratnumber d-none" data-review={three_start_count}>3</div>
																<div className="starsicons flxrow star-3">
																	<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="3" />

																</div>
																<div className="processbar"><div className="activebar" style={{ width: `${three_start_percent}%` }}></div></div>
																<div className="reviewgiven">({three_start_count})</div>
															</div>
															<div className="stardetailrow flxrow product_widget_stardetailrow">
																<div className="sratnumber d-none" data-review={two_start_count}>2</div>
																<div className="starsicons flxrow star-2">
																	<AllStarBigIcon CommonRatingComponent={CommonRatingComponent} color={generalAppearancesModel.starIconColor} starRate="2" />

																</div>
																<div className="processbar"><div className="activebar" style={{ width: `${two_start_percent}%` }}></div></div>
																<div className="reviewgiven">({two_start_count})</div>
															</div>
															<div className="stardetailrow flxrow product_widget_stardetailrow">
																<div className="sratnumber d-none" data-review={one_start_count}>1</div>
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
								}
							</div>

							{formParams.totalReviewItems > 0 && minimalHeader &&
								<div className="totalreviewcount" style={{ color: headerTextColor }}>
									<span>{formParams.totalReviewItems}</span> {globalReviewText}
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
							{productReviewWidgetCustomizesModel.showSortingOptions &&
								<div className="dropdown">
									<button className="dropdown-toggle revbtn lightbtn wbigbtn noafter custombtn" style={{ border: buttonBorderColor, color: buttonTitleColor, backgroundColor: buttonBackground }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
										<FilterIcon />
										{translations.sort_by}
										{formParams.totalReviewItems > 0 &&
											<div className="arrowright">
												<ArrowDownIcon />
											</div>
										}
									</button>
									{formParams.totalReviewItems > 0 &&
										<>	<ul className="dropdown-menu dropdown-menu-end">
											<li><a className="dropdown-item sort_by_filter" data-sort="tag_as_feature" href="#">{translations.featured}</a></li>
											<li><a className="dropdown-item sort_by_filter" data-sort="newest" href="#">{translations.newest}</a></li>
											<li><a className="dropdown-item sort_by_filter" data-sort="highest_ratings" href="#">{translations.highest_rating}</a></li>
											<li><a className="dropdown-item sort_by_filter" data-sort="lowest_ratings" href="#">{translations.lowest_rating}</a></li>
										</ul>
											<input type="hidden" id="sort_by_filter" value={formParams.sortBy} />
										</>
									}
								</div>
							}

							{(formParams.productId != "" && productReviewWidgetCustomizesModel.writeReviewButton == 'show') ? <button className="revbtn wbigbtn custombtn" id="show_create_review_modal" style={{ border: buttonBorderColor, color: buttonTitleColor, backgroundColor: buttonBackground }}>{languageWiseProductWidgetSettings.writeReviewButtonTitle ? languageWiseProductWidgetSettings.writeReviewButtonTitle : translations.productReviewConstomize.writeReviewButtonTitle}</button> : ""}
						</div>
					</div>




					{reviewItems.length > 0 ?
						<div className={`main_review_block ${gridClassName}-wrap`}>

							<ReviewItem reviewItems={reviewItems} formParams={formParams} shopRecords={shopRecords} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={CommonRatingComponent} otherProps={otherProps} gridClassName={gridClassName} />

						</div>
						:
						<>
							{(formParams.productId != "" && productReviewWidgetCustomizesModel.writeReviewButton == 'show') &&
								<div className="text-center" style={{ color: headerTextColor }}>
									<h4 >{languageWiseProductWidgetSettings.noReviewsTitleFirstPart ? languageWiseProductWidgetSettings.noReviewsTitleFirstPart : translations.productReviewConstomize.noReviewsTitleFirstPart}
										<a className="" href="#" id="show_create_review_modal" style={{ color: headerTextColor }} > {languageWiseProductWidgetSettings.noReviewsTitleLastPart ? languageWiseProductWidgetSettings.noReviewsTitleLastPart : translations.productReviewConstomize.noReviewsTitleLastPart}</a></h4>
								</div>
							}
						</>
					}
					{formParams.hasMore == 1 ?
						<div className="load_more_review ">
							<a href="#" id="load_more_review" className="revbtn custombtn" style={{ border: buttonBorderColor, color: buttonTitleColor, backgroundColor: buttonBackground }}>{languageWiseProductWidgetSettings.showMoreReviewsTitle ? languageWiseProductWidgetSettings.showMoreReviewsTitle : translations.productReviewConstomize.showMoreReviewsTitle}</a>
							<a href="#" id="w3loadingmorerws" className="revbtn custombtn" style={{ border: buttonBorderColor, color: buttonTitleColor, backgroundColor: buttonBackground, display: "none" }}>{translations.loadingText}</a>
						</div> :
						""
					}
				</div > :

					<ReviewItem reviewItems={reviewItems} formParams={formParams} shopRecords={shopRecords} generalAppearancesModel={generalAppearancesModel} CommonRatingComponent={CommonRatingComponent} otherProps={otherProps} gridClassName={gridClassName} />

			}
		</>

	);

}

export default ProductReviewWidget;
