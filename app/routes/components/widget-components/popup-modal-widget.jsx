import { displayNoOfCharacters } from './../../../utils/common';
import VideoPlayIcon from '../icons/VideoPlayIcon';
import { getUploadDocument } from './../../../utils/documentPath';
import CloseIcon from '../icons/CloseIcon';

const PopupModalWidget = (props) => {
    const iconColor = props.generalAppearancesModel.starIconColor;
    let hideOnMobileClass = "";
    if (props.popupModalWidgetCustomizesModel.hideOnMobile == true) {
        hideOnMobileClass = "hide-popup-widget-on-mobile";
    }

    return (
        <>
            <style>
                {`

                    #popup_modal_extension_widget .w3-popup-modal-widget .itemwrap {
                        border-radius: ${props.popupModalWidgetCustomizesModel.cornerRadius}px;
                    }

                    @media (max-width: 767px) {
                        #popup_modal_extension_widget .hide-popup-widget-on-mobile {
                            display: none;
                        }
                    }
                    

				`}
            </style>
            {props.reviewItems.length > 0 &&
                <div className={`w3-popup-modal-widget ${hideOnMobileClass} ${props.popupModalWidgetCustomizesModel.widgetPosition}`}>
                    {props.reviewItems.map((review, i) => (
                        <div key={i} id={`w3-popup-modal-content-${i + 1}`} className="popup-modal" >
                            <a href='#' className='closebtn w3-close-popups-modal'>
                                <CloseIcon />
                            </a>
                            <div className='itemwrap widget_w3grid-review-item' data-reviewid={review._id}>
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
                                                    <button className="play-pausess">
                                                        <VideoPlayIcon />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                }
                                <div className='bottom_meta'>
                                    <div className="reviewer_name">{review.display_name}</div>
                                    <div className={`ratingstars flxrow star-${review.rating}`}>
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? iconColor : "currentColor"} /> : null}
                                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? iconColor : "currentColor"} /> : null}
                                    </div>
                                    <div className="descriptionbox">{displayNoOfCharacters(40, review.description)}</div>

                                </div>
                                {review.productDetails &&
                                    <div className='review_bottomwrap'>
                                        <div className="product-container product-thumb-detail">
                                            <div className="imagepro flxfix">
                                                {review.productDetails?.images?.edges?.[0]?.node?.transformedSrc &&
                                                    <img src={review.productDetails.images.edges[0].node.transformedSrc} alt="Product" />
                                                }
                                            </div>
                                            <div className="textpro flxflexi">
                                                {review.productDetails.title}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            }

        </>
    );
}

export default PopupModalWidget;
