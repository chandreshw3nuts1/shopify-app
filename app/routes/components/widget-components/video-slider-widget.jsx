import { getUploadDocument } from './../../../utils/documentPath';

const VideoSliderWidget = (props) => {
    const iconColor = (props.formParams.widget_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_icon_color != "") ? props.formParams.widget_icon_color : props.generalAppearancesModel.starIconColor;
    const textColor = (props.formParams.widget_text_color != "rgba(0,0,0,0)" && props.formParams.widget_text_color != "") ? props.formParams.widget_text_color : '#ffffff';

    return (
        <>
            <style>
                {`
                    .w3-slider-wrapper .reviewer_name {
                        color: ${textColor} !important;
                    }
				`}
            </style>
            {props.reviewItems.length > 0 &&
                <div className="w3-slider-wrapper">
                    <div className="owl-carousel">
                        {props.reviewItems.map((review, i) => (
                            <div key={i} className="item common_widget_review_item" data-reviewid={review._id}>
                                {review.reviewDocuments.type === 'image' ? (
                                    <img style={{ width: '100%' }} src={getUploadDocument(review.reviewDocuments.url)} />
                                ) : (
                                    <div className='video-div'>
                                        <button class="play-pause">Play Icon</button>

                                        <video controls className='video-content'>
                                            <source src={getUploadDocument(review.reviewDocuments.url)} type="video/mp4" />
                                        </video>
                                    </div>
                                )}
                                {props.formParams.show_name == "true" &&
                                    <div class="reviewer_name">{review.display_name}</div>
                                }

                                {props.formParams.show_rating == "true" &&
                                    <div className={`ratingstars flxrow star-${review.rating}`}>
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? iconColor : "currentColor"} /> : null}
                                    </div>
                                }


                            </div>
                        ))}

                    </div>
                </div>
            }
        </>
    );
}

export default VideoSliderWidget;
