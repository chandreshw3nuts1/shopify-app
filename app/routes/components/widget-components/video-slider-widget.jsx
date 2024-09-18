import { getUploadDocument } from './../../../utils/documentPath';
import VideoPlayIcon from '../icons/VideoPlayIcon';
import StarBigIcon from '../icons/StarBigIcon';
import PlayNewIcon from '../icons/PlayNewIcon';
import PauseNewIcon from '../icons/PauseNewIcon';
import MutedNewIcon from '../icons/MutedNewIcon';
import UnmutedNewIcon from '../icons/UnmutedNewIcon';
import { reviewersNameFormat } from './../../../utils/dateFormat';
import ReviewVerifyIcon from '../icons/ReviewVerifyIcon';

const VideoSliderWidget = (props) => {
    const blockId = props.formParams.blockId;
    const iconColor = (props.formParams.widget_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_icon_color != "") ? props.formParams.widget_icon_color : props.generalAppearancesModel.starIconColor;
    const textColor = (props.formParams.widget_text_color != "rgba(0,0,0,0)" && props.formParams.widget_text_color != "") ? props.formParams.widget_text_color : '#ffffff';
    const borderColor = (props.formParams.border_color != "rgba(0,0,0,0)" && props.formParams.border_color != "") ? props.formParams.border_color : '#000000';
    const showBorder = props.formParams.show_border == "true" ? `border : ${props.formParams.border_width}px solid ${borderColor};` : "";
    const hideArrowOnMobile = props.formParams.hide_arrow_mobile == "true" ? "none" : "block";
    const playButtonColor = (props.formParams.play_button_color != "rgba(0,0,0,0)" && props.formParams.play_button_color != "") ? props.formParams.play_button_color : '#FFFFFF';

    return (
        <>
            <style>
                {`
                    #display-video-slider-widget-component${blockId} .w3-slider-wrapper .reviewer_name, #display-video-slider-widget-component${blockId} .w3-slider-wrapper .verifiedreview {
                        color: ${textColor} !important;
                    }

                    #display-video-slider-widget-component${blockId} .w3-slider-wrapper .itemwrap {
                        border-radius: ${props.formParams.border_radius}px;
                        ${showBorder}
                    }

                    #display-video-slider-widget-component${blockId} .w3-slider-wrapper .play-pause {
                        color: ${playButtonColor} !important;
                        border-color : ${playButtonColor} !important;
                    }

                    @media (max-width: 767px) {
                        #display-video-slider-widget-component${blockId} .w3-slider-wrapper .owl-carousel .owl-nav button.owl-prev, 
                        #display-video-slider-widget-component${blockId} .w3-slider-wrapper .owl-carousel .owl-nav button.owl-next {
                            display: ${hideArrowOnMobile};
                        }
                    }
				`}
            </style>
            {props.reviewItems.length > 0 &&
                <div className="w3-slider-wrapper">
                    <div className="owl-carousel">
                        {props.reviewItems.map((review, i) => (
                            <div key={i} className={`item ${review.reviewDocuments.type === 'image' ? "widget_w3grid-review-item image-item-for-slider" : ""}`} data-reviewid={review._id}>
                                <div className='itemwrap'>
                                    {review.reviewDocuments.type === 'image' ? (
                                        <div className='imagewrap'>
                                            <img style={{ width: '100%' }} src={getUploadDocument(review.reviewDocuments.url, props.shopRecords.shop_id)} />
                                        </div>
                                    ) : (
                                        <div className='video-div'>
                                            <div className='topmetabox'>
                                                <div className='reviewpopupbtn widget_w3grid-review-item' data-reviewid={review._id}>
                                                    <span><StarBigIcon /> Read review</span>
                                                </div>
                                                <div className='rightaction'>
                                                    <button className='muteunmute'>
                                                        <UnmutedNewIcon />
                                                    </button>
                                                    <button className='playpause'>
                                                        <PauseNewIcon />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='mainbtnplay'>
                                                <button class="play-pause">
                                                    <VideoPlayIcon />
                                                </button>
                                            </div>
                                            <video className='video-content'>
                                                <source src={getUploadDocument(review.reviewDocuments.url, props.shopRecords.shop_id)} type="video/mp4" />
                                            </video>
                                        </div>
                                    )}
                                    <div className='bottom_meta'>
                                        <div className='nameandverifywrap'>
                                            {props.formParams.show_name == "true" &&
                                                <div class="reviewer_name">{reviewersNameFormat(review.first_name, review.last_name, props.shopRecords.reviewers_name_format)}</div>
                                            }
                                            {review.verify_badge &&
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon />
                                                </div>
                                            }
                                        </div>

                                        {props.formParams.show_rating_icon == "true" &&
                                            <div className={`ratingstars flxrow star-${review.rating}`}>
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? iconColor : "currentColor"} /> : null}
                                            </div>
                                        }
                                    </div>
                                </div>

                            </div>
                        ))}

                    </div>
                </div>
            }
        </>
    );
}

export default VideoSliderWidget;
