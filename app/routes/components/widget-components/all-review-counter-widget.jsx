import settingsJson from "./../../../utils/settings.json";
const AllReviewWidget = (props) => {
    const blockId = props.formParams.blockId;

    const iconColor = (props.formParams.widget_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_icon_color != "") ? props.formParams.widget_icon_color : props.generalAppearancesModel.starIconColor;
    const textColor = (props.formParams.widget_text_color != "rgba(0,0,0,0)" && props.formParams.widget_text_color != "") ? props.formParams.widget_text_color : '#000000';
    const contentBackgroundColor = (props.formParams.widget_background_color != "rgba(0,0,0,0)" && props.formParams.widget_background_color != "") ? props.formParams.widget_background_color : '#ffffff';
    const contentSecondaryBackgroundColor = (props.formParams.widget_secondary_background_color != "rgba(0,0,0,0)" && props.formParams.widget_secondary_background_color != "") ? props.formParams.widget_secondary_background_color : '#878383';
    const contentSecondaryTextColor = (props.formParams.widget_secondary_text_color != "rgba(0,0,0,0)" && props.formParams.widget_secondary_text_color != "") ? props.formParams.widget_secondary_text_color : '#ffffff';
    const contentBorderColor = (props.formParams.widget_border_color != "rgba(0,0,0,0)" && props.formParams.widget_border_color != "") ? props.formParams.widget_border_color : '#c2c7ce';

    let widgetText = props.formParams.widget_text;

    const openReviewsModalClass = props.formParams.open_float_reviews == 'true' && props.formParams.totalReviews > 0 ? "open-w3-float-modal" : "";

    return (
        <>
            <style>
                {`
					#display-all-review-widget-component${blockId} .trustbadgereview svg {
                        width: ${props.formParams.font_size >= 40 ? 64 : props.formParams.font_size * 1.6}px !important;
                        height: ${props.formParams.font_size >= 40 ? 64 : props.formParams.font_size * 1.6}px !important;
					}
                    #display-all-review-widget-component${blockId} .trustbadgereview svg + svg {
                        margin-left: -${props.formParams.font_size / 4}px !important;
                    }
                     
                    #display-all-review-widget-component${blockId} .trustbadgereview .review-badge {
                        border-radius: ${props.formParams.border_radius}px;
                        overflow: hidden;
                        text-align: center;
                        cursor : pointer;
                        border : 1px solid ${contentBorderColor};
                    }

                    #display-all-review-widget-component${blockId} .trustbadgereview .review-content .total-reviews::before {
                        background: ${textColor};
                    }

                    #display-all-review-widget-component${blockId} .trustbadgereview .review-content {
                        background-color: ${contentBackgroundColor} !important;
                        padding: 10px;
                    }

                    #display-all-review-widget-component${blockId} .trustbadgereview .average-rating {
                        font-weight: bold;
                        font-size: ${props.formParams.font_size}px !important;
                        color: ${textColor} !important;
                    }

                    #display-all-review-widget-component${blockId} .trustbadgereview .total-reviews {
                        font-size: ${props.formParams.font_size}px !important;
                        color: ${textColor} !important;
                    }

                    #display-all-review-widget-component${blockId} .trustbadgereview .powered-by {
                        background-color: ${contentSecondaryBackgroundColor}; /* Light background for the footer */
                        color: ${contentSecondaryTextColor}; /* Light background for the footer */
                    }

                    #display-all-review-widget-component${blockId} .trustbadgereview .powered-by a {
                        color: ${contentSecondaryTextColor}; /* Light background for the footer */
                        text-decoration: none;
                        font-weight: bold;
                    }

                    #display-all-review-widget-component${blockId} .trustbadgereview .powered-by a:hover {
                        text-decoration: underline;
                    }
				`}
            </style>
            <div className={`form-group trustbadgereview ${props.formParams.widget_alignment == "fill_container" && props.formParams.totalReviews > 0 ? openReviewsModalClass : ""} ${props.formParams.widget_alignment} ${props.formParams.widget_layout}`}>
                {props.formParams.totalReviews > 0 ? (
                    <>
                        <div class={`review-badge ${props.formParams.widget_alignment != "fill_container" ? openReviewsModalClass : ""}`}>
                            <div class="review-content">
                                <div className="topreviewpart">
                                    {props.formParams.show_rating_icon == 'true' &&
                                        <div className="iconwrap">
                                            <>
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={props.formParams.averageRating >= 1 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={props.formParams.averageRating >= 2 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={props.formParams.averageRating >= 3 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={props.formParams.averageRating >= 4 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={props.formParams.averageRating >= 5 ? iconColor : "currentColor"} /> : null}
                                            </>
                                        </div>
                                    }
                                    {props.formParams.widget_layout === 'horizontal' &&
                                        <>
                                            {props.formParams.show_rating == 'true' &&
                                                <span class="average-rating">{props.formParams.displayRverageRating}/5</span>
                                            }
                                        </>
                                    }
                                </div>

                                <div class="rating">
                                    {props.formParams.show_rating == 'true' && props.formParams.widget_layout !== 'horizontal' &&
                                        <span class="average-rating">{props.formParams.displayRverageRating}/5</span>
                                    }

                                    {props.formParams.show_review == 'true' &&
                                        <span class="total-reviews">{props.formParams.totalReviews} {widgetText}</span>

                                    }
                                </div>
                            </div>

                            {props.formParams.show_branding == 'true' &&
                                <div class="powered-by">
                                    Powered by <a href="#">{settingsJson.app_name}</a>
                                </div>
                            }
                        </div>
                    </>
                ) : (
                    <>

                        <div class={`review-badge`}>
                            <div class="review-content">
                                <div className="topreviewpart">
                                    {props.formParams.show_rating_icon == 'true' &&
                                        <div className="iconwrap">
                                            <>
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color="currentColor" /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color="currentColor" /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color="currentColor" /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color="currentColor" /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color="currentColor" /> : null}
                                            </>
                                        </div>
                                    }
                                    {props.formParams.widget_layout === 'horizontal' &&
                                        <>
                                            {props.formParams.show_rating == 'true' &&
                                                <span class="average-rating">0.0/5</span>
                                            }
                                        </>
                                    }
                                </div>

                                <div class="rating">
                                    {props.formParams.show_rating == 'true' && props.formParams.widget_layout !== 'horizontal' &&
                                        <span class="average-rating">0.0/5</span>
                                    }

                                    {props.formParams.show_review == 'true' &&
                                        <span class="total-reviews">0 {widgetText}</span>

                                    }
                                </div>
                            </div>

                            {props.formParams.show_branding == 'true' &&
                                <div class="powered-by">
                                    Powered by <a href="#">{settingsJson.app_name}</a>
                                </div>
                            }
                        </div>
                    </>
                )}


            </div>
        </>
    );
}

export default AllReviewWidget;
