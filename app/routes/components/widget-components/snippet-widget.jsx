import { getUploadDocument } from './../../../utils/documentPath';
import VideoPlayIcon from '../icons/VideoPlayIcon';

const SnippetWidget = (props) => {
    const blockId = props.formParams.blockId;
    const iconColor = (props.formParams.widget_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_icon_color != "") ? props.formParams.widget_icon_color : props.generalAppearancesModel.starIconColor;
    const reviewerNameColor = (props.formParams.reviewer_name_color != "rgba(0,0,0,0)" && props.formParams.reviewer_name_color != "") ? props.formParams.reviewer_name_color : '#000000';
    const borderColor = (props.formParams.border_color != "rgba(0,0,0,0)" && props.formParams.border_color != "") ? props.formParams.border_color : '#000000';
    const showBorder = props.formParams.show_border == "true" ? `border : ${props.formParams.border_width}px solid ${borderColor};` : "";

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

                    #snippet-widget-component${blockId} .w3-snippet-wrapper .owl-carousel .owl-nav button.owl-prev, 
                    

				`}
            </style>
            {props.reviewItems.length > 0 &&
                <div className="w3-snippet-wrapper">
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
                                                <button class="play-pausess">
                                                    <VideoPlayIcon />
                                                </button>
                                            </div>

                                        </div>
                                    )}

                                    <div className='bottom_meta'>
                                        <div class="reviewer_name">{review.display_name}</div>
                                        <div className={`ratingstars flxrow star-${review.rating}`}>
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? iconColor : "currentColor"} /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? iconColor : "currentColor"} /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? iconColor : "currentColor"} /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? iconColor : "currentColor"} /> : null}
                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? iconColor : "currentColor"} /> : null}
                                        </div>
                                    </div>
                                </div>

                            </div >
                        ))}

                    </div >
                </div >
            }
        </>
    );
}

export default SnippetWidget;
