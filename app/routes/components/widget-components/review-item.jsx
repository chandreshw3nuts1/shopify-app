import { getUploadDocument } from './../../../utils/documentPath';
import PlayIcon from '../icons/PlayIcon';
import { formatDate } from './../../../utils/dateFormat';
import ReviewVerifyIcon from '../icons/ReviewVerifyIcon';
import { displayNoOfCharacters } from './../../../utils/common';
const ReviewItem = (props) => {
    const { translations, floatingWidgetCustomizesModel, productReviewWidgetCustomizesModel, languageWiseProductWidgetSettings, settingsJson } = props.otherProps;
    let replyText = "",
        replyBackground = "",
        replyBackgroundOnHover = "",
        reviewsText = "",
        reviewsBackground = "",
        reviewsBackgroundOnHover = "";

    if (productReviewWidgetCustomizesModel.widgetColor == 'custom') {
        replyText = productReviewWidgetCustomizesModel.replyText;
        replyBackground = productReviewWidgetCustomizesModel.replyBackground;
        replyBackgroundOnHover = productReviewWidgetCustomizesModel.replyBackgroundOnHover;
        reviewsText = productReviewWidgetCustomizesModel.reviewsText;
        reviewsBackground = productReviewWidgetCustomizesModel.reviewsBackground;
        reviewsBackgroundOnHover = productReviewWidgetCustomizesModel.reviewsBackgroundOnHover;
    } else if (productReviewWidgetCustomizesModel.widgetColor == 'white') {

    }
    const widgetItemClass = props.formParams.is_modal_reviews == 'true' ? "widget_w3grid-review-item" : "product_widget_w3grid-review-item";

    let floatShowProductThumb = true;
    if (props.formParams?.is_modal_reviews && props.formParams.is_modal_reviews == 'true') {
        floatShowProductThumb = floatingWidgetCustomizesModel?.showProductThumb || false;
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
                            <div key={i} className={`w3grid-review-item frontreviewbox ${props.gridClassName} ${widgetItemClass}`} data-reviewid={review._id} >
                                <div className='review-list-item'>
                                    <div className="">
                                        <div className="box-style custombg" style={{ backgroundColor: reviewsBackground }}>
                                            <div className="review">

                                                {review.reviewDocuments && review.reviewDocuments.length > 0 &&
                                                    <div className='review_imageswrap flxrow'>
                                                        {review.reviewDocuments.slice(0, 1).map((media, i) => (
                                                            <div className='imagebox' key={i}>
                                                                {media.type === 'image' ? (
                                                                    <img style={{ width: '100%' }} src={getUploadDocument(media.url, props.shopRecords.shop_id)} />
                                                                ) : (
                                                                    <div className='videoth'>
                                                                        <div className='playicon'><PlayIcon /></div>
                                                                        <img style={{ width: '100%' }} src={getUploadDocument(media.thumbnail_name, props.shopRecords.shop_id)} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}

                                                        {review.reviewDocuments.length > 1 && (
                                                            <div className='more-count'>
                                                                <span>+{review.reviewDocuments.length - 1}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                }


                                                <div className='review_topbar'>
                                                    <div className='star_reviews flxfix'>
                                                        <div className="star-rating">
                                                            <div className={`ratingstars flxrow star-${review.rating}`}>
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                                {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                            </div>
                                                            <div className='ratingcount'>{review.rating}.0</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text_content">
                                                    <p style={{ color: reviewsText }}>
                                                        {displayNoOfCharacters(settingsJson.character_limit, review.description)}
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
                                                    <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                                        <p style={{ color: replyText }}>
                                                            <b>{props.shopRecords.name}</b> {translations.replied} :
                                                        </p>
                                                        <p style={{ color: replyText }}>
                                                            {review.replyText}
                                                        </p>
                                                    </div>
                                                }
                                                <div className='mid_detail flxflexi'>
                                                    <div className='nametitle flxrow align-items-center'>
                                                        <h4 style={{ color: reviewsText }}>
                                                            {review.display_name}
                                                        </h4>
                                                        {review.verify_badge &&
                                                            <div className='verifiedreview'>
                                                                <ReviewVerifyIcon /> {translations.verifiedPurchase}
                                                            </div>
                                                        }
                                                    </div>
                                                    {productReviewWidgetCustomizesModel.reviewDates == 'show' &&
                                                        <div className="date" style={{ color: reviewsText }}>{formatDate(review.createdAt, props.shopRecords.timezone, 'M/D/YYYY')}</div>
                                                    }
                                                </div>
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
                            <div key={i} className={`w3grid-review-item frontreviewbox ${props.gridClassName} ${widgetItemClass}`} data-reviewid={review._id} >
                                <div className='review-list-item'>
                                    <div className="">
                                        <div className="box-style custombg" style={{ backgroundColor: reviewsBackground }}>
                                            <div className="review">

                                                <div className='review_topbar'>
                                                    <div className='mid_detail flxrow'>
                                                        <div className='nametitle flxrow align-items-center'>
                                                            <h4 style={{ color: reviewsText }}>
                                                                {review.display_name}
                                                            </h4>
                                                            {review.verify_badge &&
                                                                <div className='verifiedreview'>
                                                                    <ReviewVerifyIcon /> {translations.verifiedPurchase}
                                                                </div>
                                                            }
                                                        </div>
                                                        {productReviewWidgetCustomizesModel.reviewDates == 'show' &&
                                                            <div className="date" style={{ color: reviewsText }}>{formatDate(review.createdAt, props.shopRecords.timezone, 'M/D/YYYY')}</div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="text_content">
                                                    <p style={{ color: reviewsText }}>
                                                        {displayNoOfCharacters(settingsJson.character_limit, review.description)}
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
                                                    <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                                        <p style={{ color: replyText }}>
                                                            <b>{props.shopRecords.name}</b> {translations.replied} :
                                                        </p>
                                                        <p style={{ color: replyText }}>
                                                            {review.replyText}
                                                        </p>
                                                    </div>
                                                }
                                                <div className='star_reviews flxfix'>
                                                    <div className="star-rating">
                                                        <div className={`ratingstars flxrow star-${review.rating}`}>
                                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 1 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 2 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 3 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 4 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                            {props.CommonRatingComponent ? <props.CommonRatingComponent color={review.rating >= 5 ? props.generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                        </div>
                                                        <div className='ratingcount'>{review.rating}.0</div>
                                                    </div>
                                                </div>
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
                                                    {review.reviewDocuments && review.reviewDocuments.length > 0 &&
                                                        <div className='review_imageswrap flxrow'>
                                                            {review.reviewDocuments.slice(0, 2).map((media, i) => (
                                                                <div className='imagebox' key={i}>
                                                                    {media.type === 'image' ? (
                                                                        <img style={{ width: '100%' }} src={getUploadDocument(media.url, props.shopRecords.shop_id)} />
                                                                    ) : (
                                                                        <div className='videoth'>
                                                                            <div className='playicon'><PlayIcon /></div>
                                                                            <img style={{ width: '100%' }} src={getUploadDocument(media.thumbnail_name, props.shopRecords.shop_id)} />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                            {review.reviewDocuments.length > 2 && (
                                                                <div className='more-count'>
                                                                    {`+${review.reviewDocuments.length - 2}`}
                                                                </div>
                                                            )}
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
                            <div key={i} className={`review-list-item frontreviewbox w3grid-review-item ${props.gridClassName} ${widgetItemClass}`} data-reviewid={review._id} >
                                <div className=''>
                                    <div className="">
                                        <div className="box-style custombg" style={{ backgroundColor: reviewsBackground }}>
                                            <div className="review">
                                                <div className='review_topbar flxrow'>
                                                    <div className='mid_detail flxflexi'>
                                                        <div className='nametitle flxrow align-items-center'>
                                                            <h4 style={{ color: reviewsText }}>
                                                                {review.display_name}
                                                            </h4>
                                                            {review.verify_badge &&
                                                                <div className='verifiedreview'>
                                                                    <ReviewVerifyIcon /> {translations.verifiedPurchase}
                                                                </div>
                                                            }
                                                        </div>
                                                        {productReviewWidgetCustomizesModel.reviewDates == 'show' &&
                                                            <div className="date" style={{ color: reviewsText }}>{formatDate(review.createdAt, props.shopRecords.timezone, 'M/D/YYYY')}</div>
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
                                                        {displayNoOfCharacters(settingsJson.character_limit, review.description)}
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
                                                    <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                                        <p style={{ color: replyText }}>
                                                            <b>{props.shopRecords.name}</b> {translations.replied} :
                                                        </p>
                                                        <p style={{ color: replyText }}>
                                                            {review.replyText}
                                                        </p>
                                                    </div>
                                                }
                                                {(props.formParams.hideProductThumbnails !== 'true' || review.reviewDocuments.length > 0) &&

                                                    <div className='review_bottomwrap'>
                                                        {(props.formParams.hideProductThumbnails != 'true' && floatShowProductThumb == true && review.productDetails) &&
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
                                                                            <img src={getUploadDocument(media.url, props.shopRecords.shop_id)} />
                                                                        ) : (
                                                                            <div className='videoth'>
                                                                                <div className='playicon'><PlayIcon /></div>
                                                                                <img style={{ width: '100%' }} src={getUploadDocument(media.thumbnail_name, props.shopRecords.shop_id)} />
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
