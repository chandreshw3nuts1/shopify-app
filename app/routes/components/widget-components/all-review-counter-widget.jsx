
const AllReviewWidget = (props) => {

    const iconColor = (props.formParams.widget_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_icon_color != "") ? props.formParams.widget_icon_color : props.generalAppearancesModel.starIconColor;
    const textColor = (props.formParams.widget_text_color != "rgba(0,0,0,0)"  && props.formParams.widget_text_color != "" )? props.formParams.widget_text_color : '#ffffff';
    const contentBackgroundColor = (props.formParams.widget_background_color != "rgba(0,0,0,0)" && props.formParams.widget_background_color !="") ? props.formParams.widget_background_color : '#878383';
    let widgetText = props.formParams.widget_text;

    const openReviewsModalClass = props.formParams.open_float_reviews == 'true' && props.formParams.totalReviews > 0 ? "open-w3-float-modal" : "";
    return (
        <>
            <style>
                {`
					.custom-all-rating-div svg {
                        width: ${props.formParams.font_size >= 40 ? 64 : props.formParams.font_size * 1.6}px !important;
                        height: ${props.formParams.font_size >= 40 ? 64 : props.formParams.font_size * 1.6}px !important;
					}
                    .custom-all-rating-div svg + svg {
                        margin-left: -${props.formParams.font_size / 4}px !important;
                    }
                     
                    .custom-all-rating-div .review-badge {
                        border-radius: ${props.formParams.border_radius}px;
                        overflow: hidden;
                        text-align: center;
                        font-family: Arial, sans-serif;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .custom-all-rating-div .review-content {
                        background-color: ${contentBackgroundColor} !important;
                        padding: 10px;
                    }

                    .custom-all-rating-div .average-rating {
                        font-weight: bold;
                        font-size: ${props.formParams.font_size}px !important;
                        color: ${textColor} !important;
                    }

                    .custom-all-rating-div .total-reviews {
                        display: block;
                        margin-top: 2px;
                        font-size: ${props.formParams.font_size}px !important;
                        color: ${textColor} !important;
                    }

                    .custom-all-rating-div.powered-by {
                        background-color: #f9f9f9; /* Light background for the footer */
                        color: #999;
                        padding: 5px 0;
                        font-size: 10px;
                        border-top: 1px solid #ddd;
                    }

                    .custom-all-rating-div .powered-by a {
                        color: #000;
                        text-decoration: none;
                        font-weight: bold;
                    }

                    .custom-all-rating-div .powered-by a:hover {
                        text-decoration: underline;
                    }
				`}
            </style>
            <div className={`form-group custom-all-rating-div ${openReviewsModalClass} ${props.formParams.widget_alignment}`}>
                {props.formParams.totalReviews > 0 ? (
                    <>
                        <div class="review-badge">
                            <div class="review-content">
                                {props.formParams.show_rating_icon &&
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

                                <div class="rating">
                                    {props.formParams.show_rating &&
                                        <span class="average-rating">{props.formParams.displayRverageRating}/5</span>
                                    }

                                    {props.formParams.show_review &&
                                        <span class="total-reviews">{props.formParams.totalReviews} {widgetText}</span>

                                    }
                                </div>
                            </div>

                            {props.formParams.show_branding &&
                                <div class="powered-by">
                                    Powered by <a href="#">YourBrand</a>
                                </div>
                            }
                        </div>
                    </>
                ) : (
                    <>
                        <div class="review-badge">
                            <div class="review-content">
                                <div className="iconwrap">
                                    <>
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color="currentColor" /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color="currentColor" /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color="currentColor" /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color="currentColor" /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color="currentColor" /> : null}
                                    </>
                                </div>
                                <div class="rating">
                                    <span class="average-rating">0.0/5</span>
                                    <span class="total-reviews">0 {widgetText}</span>
                                </div>
                            </div>
                            <div class="powered-by">
                                Powered by <a href="#">YourBrand</a>
                            </div>
                        </div>
                    </>
                )}


            </div>
        </>
    );
}

export default AllReviewWidget;
