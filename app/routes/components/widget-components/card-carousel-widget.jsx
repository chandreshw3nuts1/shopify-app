import { getUploadDocument } from './../../../utils/documentPath';
import VideoPlayIcon from '../icons/VideoPlayIcon';
import { displayNoOfCharacters } from './../../../utils/common';
import { reviewersNameFormat } from './../../../utils/dateFormat';
import ReviewVerifyIcon from '../icons/ReviewVerifyIcon';

const CardCarouselWidget = (props) => {
    const blockId = props.formParams.blockId;
    const iconColor = (props.formParams.widget_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_icon_color != "") ? props.formParams.widget_icon_color : props.generalAppearancesModel.starIconColor;

    const reviewerNameColor = (props.formParams.reviewer_name_color != "rgba(0,0,0,0)" && props.formParams.reviewer_name_color != "") ? props.formParams.reviewer_name_color : '#000000';
    const borderColor = (props.formParams.border_color != "rgba(0,0,0,0)" && props.formParams.border_color != "") ? props.formParams.border_color : '#000000';
    // const dotBackgroundColor = (props.formParams.dot_background_color != "rgba(0,0,0,0)" && props.formParams.dot_background_color != "") ? props.formParams.dot_background_color : '#cccccc';
    const arrowIconColor = (props.formParams.arrow_icon_color != "rgba(0,0,0,0)" && props.formParams.arrow_icon_color != "") ? props.formParams.arrow_icon_color : '#595959';
    const arrowBgIconColor = (props.formParams.arrow_bg_color != "rgba(0,0,0,0)" && props.formParams.arrow_bg_color != "") ? props.formParams.arrow_bg_color : '#ffffff';
    // const quotesIconColor = (props.formParams.quotes_icon_color != "rgba(0,0,0,0)" && props.formParams.quotes_icon_color != "") ? props.formParams.quotes_icon_color : '#cccccc';
    // const hideDots = props.formParams.show_pagination_dots == "true" ? "block" : "none";
    const showBorder = props.formParams.show_border == "true" ? `border : ${props.formParams.border_width}px solid ${borderColor};` : "";
    const textColor = (props.formParams.text_color != "rgba(0,0,0,0)" && props.formParams.text_color != "") ? props.formParams.text_color : '#000000';
    const textBgColor = (props.formParams.text_bg_color != "rgba(0,0,0,0)" && props.formParams.text_bg_color != "") ? props.formParams.text_bg_color : '#ffffff';
    const widgetBgIconColor = (props.formParams.widget_bg_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_bg_icon_color != "") ? props.formParams.widget_bg_icon_color : '#ffffff';



    return (
        <>
            <style>
                {`
                    
                    #card-carousel-widget-component${blockId} .w3-card-slider-wrapper .reviewer_name, #card-carousel-widget-component${blockId} .w3-card-slider-wrapper .verifiedreview {
                        color: ${reviewerNameColor} !important;
                    }
                    #card-carousel-widget-component${blockId} .w3-card-slider-wrapper .itemwrap {
                        border-radius: ${props.formParams.border_radius}px;
                        ${showBorder}
                    }

                    #card-carousel-widget-component${blockId} .w3-card-slider-wrapper .owl-carousel .owl-nav button.owl-prev, 
                    #card-carousel-widget-component${blockId} .w3-card-slider-wrapper .owl-carousel .owl-nav button.owl-next {
                        color: ${arrowIconColor};
                        background-color : ${arrowBgIconColor} !important;
                    }
                    #card-carousel-widget-component${blockId} .w3-card-slider-wrapper .itemwrap  .bottom_meta {
                        background-color : ${textBgColor} !important;
                    }
                    #card-carousel-widget-component${blockId} .w3-card-slider-wrapper .itemwrap  .bottom_meta .ratingstars {
                        background-color : ${widgetBgIconColor} !important;
                    }
                    #card-carousel-widget-component${blockId} .w3-card-slider-wrapper .itemwrap .bottom_meta .review_description {
                        color: ${textColor} !important;
                    }

				`}
            </style>
            {props.reviewItems.length > 0 &&
                <div className="w3-card-slider-wrapper">
                    <div className="owl-carousel">
                        {props.reviewItems.map((review, i) => (
                            <div key={i} className="item widget_w3grid-review-item" data-reviewid={review._id}>
                                <div className='itemwrap'>
                                    {review.reviewDocuments.type === 'image' ? (
                                        <div className='imagewrap'>
                                            <img style={{ width: '100%' }} src={getUploadDocument(review.reviewDocuments.url, props.shopRecords.shop_id)} />
                                        </div>
                                    ) : (

                                        <div className='video-div'>
                                            <img style={{ width: '100%' }} src={getUploadDocument(review.reviewDocuments.thumbnail_name, props.shopRecords.shop_id)} />

                                            <div className='mainbtnplay'>
                                                <button className="play-pausess">
                                                    <VideoPlayIcon />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                    <div className='bottom_meta'>
                                        <div className='ratingstars_wrap'>
                                            <div className={`ratingstars flxrow star-${review.rating}`}>
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? iconColor : "currentColor"} /> : null}
                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? iconColor : "currentColor"} /> : null}
                                            </div>
                                        </div>
                                        <div className='nameandverifywrap'>
                                            <div className="reviewer_name">{reviewersNameFormat(review.first_name, review.last_name, props.shopRecords.reviewers_name_format)}</div>
                                            {review.verify_badge &&
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon />
                                                </div>
                                            }    
                                        </div>
                                        <div className="review_description">{displayNoOfCharacters(props.formParams.no_of_chars, review.description)}</div>

                                        
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

export default CardCarouselWidget;
