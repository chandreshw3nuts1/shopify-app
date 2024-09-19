import { getUploadDocument } from './../../../utils/documentPath';
import VideoPlayIcon from '../icons/VideoPlayIcon';
import { displayNoOfCharacters } from './../../../utils/common';

const SnippetWidget = (props) => {
    const blockId = props.formParams.blockId;
    const iconColor = (props.formParams.widget_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_icon_color != "") ? props.formParams.widget_icon_color : props.generalAppearancesModel.starIconColor;
    const reviewerNameColor = (props.formParams.reviewer_name_color != "rgba(0,0,0,0)" && props.formParams.reviewer_name_color != "") ? props.formParams.reviewer_name_color : '#000000';
    const borderColor = (props.formParams.border_color != "rgba(0,0,0,0)" && props.formParams.border_color != "") ? props.formParams.border_color : '#000000';
    const showBorder = props.formParams.show_border == "true" ? `border : 1px solid ${borderColor};` : "";
    const hideArrowOnMobile = props.formParams.hide_arrow_mobile == "true" ? "none" : "block";
    const backgroundColor = (props.formParams.background_color != "rgba(0,0,0,0)" && props.formParams.background_color != "") ? props.formParams.background_color : '#ffffff';
    const textColor = (props.formParams.text_color != "rgba(0,0,0,0)" && props.formParams.text_color != "") ? props.formParams.text_color : '#000000';


    
    const fontSize = props.formParams.font_size;
    const iconSize = (props.formParams.font_size * 24) / 16;
    const iconMargin = (iconSize * 5) / 24;
    const widgetWidth = props.formParams.widget_width;
    const widgetAlignment = props.formParams.widget_alignment;
    const widthMapping = {
        'fill' : 100,
        'small' : 30,
        'medium' : 50,
        'large' : 75,
    }
    const alignmentMapping = {
        'left' : 'flex-start',
        'center' : 'center',
        'right' : 'flex-end',
    }

    return (
        <>
            <style>
                {`
                    
                    #snippet-widget-component${blockId} .w3-snippet-wrapper .reviewer_name {
                        color: ${reviewerNameColor} !important;
                    }
                    #snippet-widget-component${blockId} .w3-snippet-wrapper .itemwrap {
                        border-radius: ${props.formParams.border_radius}px;
                        ${showBorder}
                    }
                    #snippet-widget-component${blockId} .w3-snippet-wrapper .itemwrap .bottom_meta .reviewer_name,
                    #snippet-widget-component${blockId} .w3-snippet-wrapper .itemwrap .bottom_meta .descriptionbox {
                        font-size: ${fontSize}px !important;
                    }
                    #snippet-widget-component${blockId} .w3-snippet-wrapper .itemwrap .bottom_meta .ratingstars svg {
                        width: ${iconSize}px !important;
                        height: ${iconSize}px !important;
                    }
                    #snippet-widget-component${blockId} .w3-snippet-wrapper .itemwrap .bottom_meta .ratingstars svg + svg {
                        margin-left: -${iconMargin}px !important;
                    }
                    #snippet-widget-component${blockId} .w3-snippet-wrapper .w3-snippet-width {
                        max-width: ${widthMapping?.[widgetWidth] || '100'}% !important;
                    }
                    #snippet-widget-component${blockId} .w3-snippet-wrapper {
                        justify-content: ${alignmentMapping?.[widgetAlignment] || 'flex-start'} !important;
                    }

                    #snippet-widget-component${blockId} .w3-snippet-wrapper .itemwrap {
                        background-color : ${backgroundColor} !important;
                    }

                    #snippet-widget-component${blockId} .w3-snippet-wrapper .itemwrap .bottom_meta .descriptionbox {
                        color: ${textColor} !important;
                    }

                    @media (max-width: 767px) {
                        #snippet-widget-component${blockId} .w3-snippet-wrapper .owl-carousel .owl-nav  {
                            display: ${hideArrowOnMobile} !important;
                        }
                    }

                `}
            </style>
            {props.reviewItems.length > 0 &&

                <div className="w3-snippet-wrapper">
                    <div className='w3-snippet-width'>
                        <div className="owl-carousel">
                            {props.reviewItems.map((review, i) => (
                                <div key={i} className="item widget_w3grid-review-item" data-reviewid={review._id}>
                                    <div className='itemwrap'>
                                        {props.formParams.show_review_image == "true" &&
                                            <div className="img-video-content flxfix">
                                                {review.reviewDocuments.type === 'image' ? (
                                                    <div className='imagewrap'>
                                                        <img style={{ width: '100%' }} src={getUploadDocument(review.reviewDocuments.url, props.shopRecords.shop_id)} />
                                                    </div>
                                                ) : (

                                                    <div className='video-div'>
                                                        <img style={{ width: '100%' }} src={getUploadDocument(review.reviewDocuments.thumbnail_name, props.shopRecords.shop_id)} />
                                                        <div className='mainbtnplay'>
                                                            <button class="play-pausess">
                                                                <VideoPlayIcon />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                        <div className='bottom_meta flxflexi'>
                                            <div className='topflexbox'>
                                                <div class="reviewer_name">{review.display_name}</div>
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
                                            <div class="descriptionbox">{displayNoOfCharacters(props.formParams.no_of_chars, review.description)}</div>
                                            
                                        </div>
                                    </div>

                                </div >
                            ))}

                        </div>
                    </div>
                </div >
            }
        </>
    );
}

export default SnippetWidget;
