import QuoteStyle1Icon from '../icons/QuoteStyle1Icon';
import QuoteStyle2Icon from '../icons/QuoteStyle2Icon';
import QuoteStyle3Icon from '../icons/QuoteStyle3Icon';
import QuoteStyle4Icon from '../icons/QuoteStyle4Icon';
import QuoteStyle5Icon from '../icons/QuoteStyle5Icon';
import { displayNoOfCharacters } from './../../../utils/common';
import { reviewersNameFormat } from './../../../utils/dateFormat';
import ReviewVerifyIcon from '../icons/ReviewVerifyIcon';

const TestimonialsCarouselWidget = (props) => {
    const blockId = props.formParams.blockId;
    console.log(props.shopRecords);
    const iconColor = (props.formParams.widget_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_icon_color != "") ? props.formParams.widget_icon_color : props.generalAppearancesModel.starIconColor;
    const textColor = (props.formParams.text_color != "rgba(0,0,0,0)" && props.formParams.text_color != "") ? props.formParams.text_color : '#000000';
    const reviewerNameColor = (props.formParams.reviewer_name_color != "rgba(0,0,0,0)" && props.formParams.reviewer_name_color != "") ? props.formParams.reviewer_name_color : '#000000';
    const selectedDotColor = (props.formParams.selected_dot_color != "rgba(0,0,0,0)" && props.formParams.selected_dot_color != "") ? props.formParams.selected_dot_color : '#000000';
    const dotBackgroundColor = (props.formParams.dot_background_color != "rgba(0,0,0,0)" && props.formParams.dot_background_color != "") ? props.formParams.dot_background_color : '#cccccc';
    const arrowIconColor = (props.formParams.arrow_icon_color != "rgba(0,0,0,0)" && props.formParams.arrow_icon_color != "") ? props.formParams.arrow_icon_color : '#000000';
    const quotesIconColor = (props.formParams.quotes_icon_color != "rgba(0,0,0,0)" && props.formParams.quotes_icon_color != "") ? props.formParams.quotes_icon_color : '#cccccc';
    const hideDots = props.formParams.show_pagination_dots == "true" ? "block" : "none";
    const hideArrowOnMobileDots = props.formParams.hide_arrow_mobile == "true" ? "none" : "block";

    let QuoteMarksIconComponent = "";
    if (props.formParams.quote_marks_icon_style == "style_1") {
        QuoteMarksIconComponent = QuoteStyle1Icon;
    } else if (props.formParams.quote_marks_icon_style == "style_2") {
        QuoteMarksIconComponent = QuoteStyle2Icon;
    } else if (props.formParams.quote_marks_icon_style == "style_3") {
        QuoteMarksIconComponent = QuoteStyle3Icon;
    } else if (props.formParams.quote_marks_icon_style == "style_4") {
        QuoteMarksIconComponent = QuoteStyle4Icon;
    } else if (props.formParams.quote_marks_icon_style == "style_5") {
        QuoteMarksIconComponent = QuoteStyle5Icon;
    }

    return (
        <>
            <style>
                {`
                    
                    #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .reviewer_name {
                        color: ${reviewerNameColor} !important;
                    }
                        
                    #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .review_description {
                        font-size: ${props.formParams.font_size}px !important;
                        color: ${textColor} !important;
                    }
                    #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .owl-carousel .owl-nav button.owl-prev, 
                    #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .owl-carousel .owl-nav button.owl-next {
                        color: ${arrowIconColor};
                        border-color : ${arrowIconColor} !important;
                    }
                    #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .review_description {
                        font-size: ${props.formParams.font_size}px !important;
                        color: ${textColor} !important;
                    }

                    #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .owl-dots {
                        display: ${hideDots};
                    }

                    #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .owl-dots .owl-dot {
                        background-color: ${dotBackgroundColor};
                    }

                    #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .owl-dots .owl-dot.active {
                        background-color: ${selectedDotColor};
                    }
                    #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .quote_class {
                        color: ${quotesIconColor};
                    }

                    @media (max-width: 767px) {
                        #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .owl-carousel .owl-nav button.owl-prev, 
                        #testimonials-carousel-widget-component${blockId} .w3-testimonial-slider-wrapper .owl-carousel .owl-nav button.owl-next {
                            display: ${hideArrowOnMobileDots};
                        }
                    }
                        

				`}
            </style>
            {props.reviewItems.length > 0 &&
                <div className="w3-testimonial-slider-wrapper">
                    <div className="owl-carousel">
                        {props.reviewItems.map((review, i) => (
                            <div className="itemwrap widget_w3grid-review-item" data-reviewid={review._id}>
                                <div className="quote_class">
                                    {QuoteMarksIconComponent && <QuoteMarksIconComponent />}
                                </div>
                                <div class="review_description">{displayNoOfCharacters(props.formParams.no_of_chars, review.description)}</div>
                                <div className='bottom_meta'>
                                    <div className="ratingstars">
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? iconColor : "currentColor"} /> : null}
                                    </div>
                                    <div class="reviewer_name">{reviewersNameFormat(review.first_name, review.last_name, props.shopRecords.reviewers_name_format)}</div>
                                    {review.verify_badge &&
                                        <div className='verifiedreview'>
                                            <ReviewVerifyIcon />
                                        </div>
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            }
        </>
    );
}

export default TestimonialsCarouselWidget;
