import { displayNoOfCharacters } from './../../../utils/common';
import VideoPlayIcon from '../icons/VideoPlayIcon';
import { getUploadDocument } from './../../../utils/documentPath';

const PopupModalWidget = (props) => {
    const iconColor = props.generalAppearancesModel.starIconColor;
    console.log(props.popupModalWidgetCustomizesModel);
    return (
        <>
            <style>
                {`
				
                    

				`}
            </style>
            {props.reviewItems.length > 0 &&
                <div className="w3-popup-modal-widget">
                    {props.reviewItems.map((review, i) => (
                        <div key={i} id={`w3-popup-modal-content-${i + 1}`} className="popup-modal">
                            <div className='itemwrap'>
                                {props.popupModalWidgetCustomizesModel.showProductThumb &&
                                    <div className="img-video-content">
                                        {review.reviewDocuments.type === 'image' ? (
                                            <div className='imagewrap'>
                                                <img src={getUploadDocument(review.reviewDocuments.url, props.shopRecords.shop_id)} />
                                            </div>
                                        ) : (

                                            <div className='video-div'>
                                                <img src={getUploadDocument(review.reviewDocuments.thumbnail_name, props.shopRecords.shop_id)} />

                                                <div className='mainbtnplay'>
                                                    <button class="play-pausess">
                                                        <VideoPlayIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }
                                <div className='bottom_meta'>
                                    <div class="reviewer_name">{review.display_name}</div>
                                    <div className={`ratingstars flxrow star-${review.rating}`}>
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? iconColor : "currentColor"} /> : null}
                                    </div>
                                    <div class="reviewer_description">{displayNoOfCharacters(50, review.description)}</div>

                                </div>
                                <div className='review_bottomwrap'>
                                    <div className="product-container product-thumb-detail">
                                        <div className="image flxfix">
                                            <img src={review.productDetails.images.edges[0].node.transformedSrc} />
                                        </div>
                                        <div className="text flxflexi">
                                            <p >{review.productDetails.title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            }

        </>
    );
}

export default PopupModalWidget;