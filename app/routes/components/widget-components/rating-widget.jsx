
const RatingWidget = (props) => {

    const iconColor = (props.formParams.widget_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_icon_color !="")  ? props.formParams.widget_icon_color : props.generalAppearancesModel.starIconColor;
    const textColor = props.formParams.widget_text_color != "rgba(0,0,0,0)" ? props.formParams.widget_text_color : '#000000';
    var widgetText = "";
    if (props.formParams.hide_text == 'false') {
        if (props.formParams.widget_text != "") {
            widgetText = props.formParams.widget_text;
            widgetText = widgetText.replace(/\[count\]/g, props.formParams.totalReviews);
            widgetText = widgetText.replace(/\[rating\]/g, props.formParams.averageRating);
        } else {
            widgetText = `(${props.formParams.totalReviews})`;
        }
    }
    const openReviewsModalClass = props.formParams.open_float_reviews == 'true' && props.formParams.totalReviews > 0  ? "open-w3-float-modal" : ""; 
    return (
        <>
            <style>
                {`
					.custom-rating-div svg {
						font-size: 48px !important;
					}
                    .custom-rating-div  {
						text-align: ${props.formParams.widget_alignment} !important;
                        cursor : pointer;
					}
                    .custom-rating-text {
						font-size: ${props.formParams.font_size}px !important;
                        color: ${textColor} !important;
                    }
				`}
            </style>
            <div className={`form-group custom-rating-div ${openReviewsModalClass}`}>

                {props.formParams.totalReviews > 0 ?
                    <>
                        {props.formParams.widget_layout == "all" ?
                            (
                                <>
                                    {props.CommonRatingComponent ? <props.CommonRatingComponent color={props.formParams.averageRating >= 1 ? iconColor : "currentColor"} /> : null}
                                    {props.CommonRatingComponent ? <props.CommonRatingComponent color={props.formParams.averageRating >= 2 ? iconColor : "currentColor"} /> : null}
                                    {props.CommonRatingComponent ? <props.CommonRatingComponent color={props.formParams.averageRating >= 3 ? iconColor : "currentColor"} /> : null}
                                    {props.CommonRatingComponent ? <props.CommonRatingComponent color={props.formParams.averageRating >= 4 ? iconColor : "currentColor"} /> : null}
                                    {props.CommonRatingComponent ? <props.CommonRatingComponent color={props.formParams.averageRating >= 5 ? iconColor : "currentColor"} /> : null}
                                </>

                            ) :
                            (
                                <>
                                    {props.CommonRatingComponent ? <props.CommonRatingComponent color={iconColor} /> : null}

                                </>

                            )}
                        <div className="custom-rating-text">
                            {widgetText}
                        </div>
                    </>
                    :
                    <>
                        {props.formParams.show_empty_stars == "true" &&
                            <>
                                {props.formParams.widget_layout == "all" ?
                                    (
                                        <>
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={"currentColor"} /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={"currentColor"} /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={"currentColor"} /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={"currentColor"} /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={"currentColor"} /> : null}
                                        </>
                                    ) :
                                    (
                                        <>
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={"currentColor"} /> : null}
                                        </>
                                    )}
                                <div className="custom-rating-text">
                                    {widgetText}
                                </div>
                            </>
                        }
                    </>
                }
            </div>
        </>
    );
}

export default RatingWidget;