import Masonry from 'react-masonry-css';
import { getUploadDocument } from './../../../utils/documentPath';
import PlayIcon from '../icons/PlayIcon';
import { formatDate } from './../../../utils/dateFormat';

const ReviewItem = (props) => {
    const { translations, productReviewWidgetCustomizesModel, languageWiseProductWidgetSettings } = props.otherProps;
    let replyText, replyBackground, replyBackgroundOnHover, reviewsText, reviewsBackground, reviewsBackgroundOnHover = "";

    if (productReviewWidgetCustomizesModel.widgetColor == 'custom') {
        replyText = productReviewWidgetCustomizesModel.replyText;
        replyBackground = productReviewWidgetCustomizesModel.replyBackground;
        replyBackgroundOnHover = productReviewWidgetCustomizesModel.replyBackgroundOnHover;
        reviewsText = productReviewWidgetCustomizesModel.reviewsText;
        reviewsBackground = productReviewWidgetCustomizesModel.reviewsBackground;
        reviewsBackgroundOnHover = productReviewWidgetCustomizesModel.reviewsBackgroundOnHover;
    } else if (productReviewWidgetCustomizesModel.widgetColor == 'white') {

    }

    return (
        <>
            <style>
                {`
                    .reply-text:hover {
                        background-color: ${replyBackgroundOnHover} !important;
                    }
                    .custombg:hover {
                        background-color: ${reviewsBackgroundOnHover} !important;
                    }
                    
                `}
            </style>

            {props.reviewItems.length > 0 && (
                <>
                    {productReviewWidgetCustomizesModel.widgetLayout == "grid" && (
                        props.reviewItems.map((review, i) => (
                            <div key={i} className="w3grid-review-item " data-reviewid={review._id} >
                                <div className='row'>
                                    <div className="col">
                                        <div className="box-style custombg" style={{ backgroundColor: reviewsBackground }}>
                                            <div className="review">

                                                {review.reviewDocuments && review.reviewDocuments.length > 0 &&
                                                    <div className='review_imageswrap flxrow'>
                                                        {review.reviewDocuments.slice(0, 1).map((media, i) => (
                                                            <div className='imagebox' key={i}>
                                                                {media.type === 'image' ? (
                                                                    <img style={{ width: '100%' }} src={getUploadDocument(media.url)} />
                                                                ) : (
                                                                    <div className='videoth'>
                                                                        <div className='playicon'><PlayIcon /></div>
                                                                        <video>
                                                                            <source src={getUploadDocument(media.url)} type="video/mp4" />
                                                                        </video>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}

                                                        {review.reviewDocuments.length > 1 && (
                                                            <div className='additional-media-indicator'>
                                                                <span>+{review.reviewDocuments.length - 1}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                }


                                                <div className='review_topbar'>
                                                    <div className='mid_detail flxflexi'>
                                                        <h4 style={{ color: reviewsText }}>
                                                            {review.display_name}
                                                        </h4>
                                                        {productReviewWidgetCustomizesModel.reviewDates == 'show' &&
                                                            <div className="date" style={{ color: reviewsText }}>{formatDate(review.created_at, props.shopRecords.timezone, 'M/D/YYYY')}</div>
                                                        }
                                                    </div>
                                                    <div className='star_reviews flxfix'>
                                                        <div className="star-rating">
                                                            <div className={`ratingstars flxrow star-${review.rating}`}>


                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text_content">
                                                    <p style={{ color: reviewsText }}>
                                                        {review.description}
                                                    </p>
                                                </div>
                                                {productReviewWidgetCustomizesModel.itemType == 'show' && review.variant_title && (
                                                    <div className="text_content" >
                                                        <p className="reply-text" style={{ color: reviewsText }}>
                                                            <b> {languageWiseProductWidgetSettings.itemTypeTitle ? languageWiseProductWidgetSettings.itemTypeTitle : translations.productReviewConstomize.itemTypeTitle} </b>: {review.variant_title}
                                                        </p>
                                                    </div>
                                                )}
                                                {review.replyText &&
                                                    <div className="text_content">
                                                        <p className="reply-text" style={{ color: replyText, backgroundColor: replyBackground }}>
                                                            <b>{props.shopRecords.name}</b> {translations.replied} :
                                                        </p>
                                                        <p>
                                                            {review.replyText}
                                                        </p>
                                                    </div>
                                                }
                                                <div className='review_bottomwrap'>
                                                    {(props.formParams.hideProductThumbnails != 'true') &&
                                                        <div className="product-container product-thumb-detail">
                                                            <div className="image flxfix">
                                                                <img src={review.productDetails.images.edges[0].node.transformedSrc} />
                                                            </div>
                                                            <div className="text flxflexi">
                                                                <p style={{ color: reviewsText }}>{review.productDetails.title}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}

                    {productReviewWidgetCustomizesModel.widgetLayout == "compact" && (
                        props.reviewItems.map((review, i) => (
                            <div key={i} className="w3grid-review-item " data-reviewid={review._id} >
                                <div className='row'>
                                    <div className="col">
                                        <div className="box-style custombg" style={{ backgroundColor: reviewsBackground }}>
                                            <div className="review">

                                                {review.reviewDocuments && review.reviewDocuments.length > 0 &&
                                                    <div className='review_imageswrap flxrow'>
                                                        {review.reviewDocuments.slice(0, 1).map((media, i) => (
                                                            <div className='imagebox' key={i}>
                                                                {media.type === 'image' ? (
                                                                    <img style={{ width: '100%' }} src={getUploadDocument(media.url)} />
                                                                ) : (
                                                                    <div className='videoth'>
                                                                        <div className='playicon'><PlayIcon /></div>
                                                                        <video>
                                                                            <source src={getUploadDocument(media.url)} type="video/mp4" />
                                                                        </video>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                }


                                                <div className='review_topbar'>
                                                    <div className='mid_detail flxflexi'>
                                                        <h4 style={{ color: reviewsText }}>
                                                            {review.display_name}
                                                        </h4>
                                                        {productReviewWidgetCustomizesModel.reviewDates == 'show' &&
                                                            <div className="date" style={{ color: reviewsText }}>{formatDate(review.created_at, props.shopRecords.timezone, 'M/D/YYYY')}</div>
                                                        }
                                                    </div>
                                                    <div className='star_reviews flxfix'>
                                                        <div className="star-rating">
                                                            <div className={`ratingstars flxrow star-${review.rating}`}>


                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text_content">
                                                    <p style={{ color: reviewsText }}>
                                                        {review.description}
                                                    </p>
                                                </div>
                                                {productReviewWidgetCustomizesModel.itemType == 'show' && review.variant_title && (
                                                    <div className="text_content" >
                                                        <p className="reply-text" style={{ color: reviewsText }}>
                                                            <b> {languageWiseProductWidgetSettings.itemTypeTitle ? languageWiseProductWidgetSettings.itemTypeTitle : translations.productReviewConstomize.itemTypeTitle} </b>: {review.variant_title}
                                                        </p>
                                                    </div>
                                                )}
                                                {review.replyText &&
                                                    <div className="text_content">
                                                        <p className="reply-text" style={{ color: replyText, backgroundColor: replyBackground }}>
                                                            <b>{props.shopRecords.name}</b> {translations.replied} :
                                                        </p>
                                                        <p>
                                                            {review.replyText}
                                                        </p>
                                                    </div>
                                                }
                                                <div className='review_bottomwrap'>
                                                    {(props.formParams.hideProductThumbnails != 'true') &&
                                                        <div className="product-container product-thumb-detail">
                                                            <div className="image flxfix">
                                                                <img src={review.productDetails.images.edges[0].node.transformedSrc} />
                                                            </div>
                                                            <div className="text flxflexi">
                                                                <p style={{ color: reviewsText }}>{review.productDetails.title}</p>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>


                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}

                    {productReviewWidgetCustomizesModel.widgetLayout == "list" && (
                        props.reviewItems.map((review, i) => (
                            <div key={i} className="review-list-item frontreviewbox" data-reviewid={review._id} >
                                <div className='row'>
                                    <div className="col">
                                        <div className="box-style custombg" style={{ backgroundColor: reviewsBackground }}>
                                            <div className="review">
                                                <div className='review_topbar flxrow'>
                                                    <div className='mid_detail flxflexi'>
                                                        <h4 style={{ color: reviewsText }}>
                                                            {review.display_name}
                                                        </h4>
                                                        {productReviewWidgetCustomizesModel.reviewDates == 'show' &&
                                                            <div className="date" style={{ color: reviewsText }}>{formatDate(review.created_at, props.shopRecords.timezone, 'M/D/YYYY')}</div>
                                                        }
                                                    </div>
                                                    <div className='star_reviews flxfix'>
                                                        <div className="star-rating">
                                                            <div className='ratingcount'>{review.rating}.0</div>
                                                            <div className={`ratingstars flxrow star-${review.rating}`}>


                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text_content">
                                                    <p style={{ color: reviewsText }}>
                                                        {review.description}
                                                    </p>
                                                </div>

                                                {productReviewWidgetCustomizesModel.itemType == 'show' && review.variant_title && (
                                                    <div className="text_content" >
                                                        <p className="reply-text" style={{ color: reviewsText }}>
                                                            <b> {languageWiseProductWidgetSettings.itemTypeTitle ? languageWiseProductWidgetSettings.itemTypeTitle : translations.productReviewConstomize.itemTypeTitle} </b>: {review.variant_title}
                                                        </p>
                                                    </div>
                                                )}
                                                {review.replyText &&
                                                    <div className="text_content">
                                                        <p className="reply-text" style={{ color: replyText, backgroundColor: replyBackground }}>
                                                            <b>{props.shopRecords.name}</b> {translations.replied} :
                                                        </p>
                                                        <p>
                                                            {review.replyText}
                                                        </p>
                                                    </div>}
                                                {(props.formParams.hideProductThumbnails !== 'true' || review.reviewDocuments.length > 0) &&

                                                    <div className='review_bottomwrap'>
                                                        {(props.formParams.hideProductThumbnails != 'true' && review.productDetails) &&
                                                            <div className="product-container product-thumb-detail">
                                                                <div className="image flxfix">
                                                                    <img src={review.productDetails.images.edges[0].node.transformedSrc} />
                                                                </div>
                                                                <div className="text flxflexi">
                                                                    <p style={{ color: reviewsText }}>{review.productDetails.title}</p>
                                                                </div>
                                                            </div>
                                                        }

                                                        {review.reviewDocuments &&
                                                            <div className='review_imageswrap flxrow'>

                                                                {review.reviewDocuments.map((media, i) => (
                                                                    <div className='imagebox' key={i}>
                                                                        {media.type === 'image' ? (
                                                                            <img src={getUploadDocument(media.url)} />
                                                                        ) : (
                                                                            <div className='videoth'>
                                                                                <div className='playicon'><PlayIcon /></div>
                                                                                <video>
                                                                                    <source src={getUploadDocument(media.url)} type="video/mp4" />
                                                                                </video>
                                                                            </div>
                                                                        )}

                                                                    </div>
                                                                ))}

                                                            </div>}
                                                    </div>
                                                }

                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    )}

                </>

            )}

        </>

    );

}

export default ReviewItem;
