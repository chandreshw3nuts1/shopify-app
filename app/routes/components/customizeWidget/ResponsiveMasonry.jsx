import React, { useEffect, useRef } from 'react';
import settingsJson from './../../../utils/settings.json';
import ReviewVerifyIcon from '../icons/ReviewVerifyIcon';

export default function MasonryLayout(props) {
    const masonryContainerRef = useRef(null);
    let replyText, replyBackground, replyBackgroundOnHover, reviewsText, reviewsBackground, reviewsBackgroundOnHover = "";

    let verifiedBadgeBackgroundColor = settingsJson.productWidgetCustomize.verifiedBadgeBackgroundColor;

    if (props.documentObj.widgetColor == 'custom') {
        replyText = props.documentObj.replyText;
        replyBackground = props.documentObj.replyBackground;
        replyBackgroundOnHover = props.documentObj.replyBackgroundOnHover;
        reviewsText = props.documentObj.reviewsText;
        reviewsBackground = props.documentObj.reviewsBackground;
        reviewsBackgroundOnHover = props.documentObj.reviewsBackgroundOnHover;
        verifiedBadgeBackgroundColor = props.documentObj.verifiedBadgeBackgroundColor;
    } else if (props.documentObj.widgetColor == 'white') {

    }
    let reviewWidgetLayoutWidth = "100%";
    let gridClassName = 'full-grid';
    if (props.documentObj.widgetLayout == 'grid') {
        reviewWidgetLayoutWidth = "33.33%";
        gridClassName = 'grid-four-column';
    } else if (props.documentObj.widgetLayout == 'compact') {
        reviewWidgetLayoutWidth = "50%";
        gridClassName = 'grid-two-column';
    }
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js";
        script.async = true;

        script.onload = () => {
            // Initialize Masonry after the script is loaded
            const masonryInstance = new window.Masonry(masonryContainerRef.current, {
                itemSelector: '.w3grid-review-item', // Your grid item selector
                columnWidth: '.w3grid-review-item', // Define column width to match grid items
                percentPosition: true
            });

            setTimeout(() => {
                masonryInstance.layout();
            }, 5000);

        };

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

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
                    .w3grid-review-item {
						width: ${reviewWidgetLayoutWidth} !important;
						margin : 24px 0 0 0;
						padding: 0;
						box-sizing: border-box;
					}
					.w3grid-review-item.grid-two-column,
					.w3grid-review-item.grid-four-column { padding: 0 12px;}    
                `}
            </style>

            <div className={`main_review_block ${props.gridClassName}-wrap`} ref={masonryContainerRef} >

                {props.documentObj.widgetLayout == "grid" && (
                    <>
                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox' >
                                                <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                            </div>
                                        </div>
                                        <div className='review_topbar flxrow'>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingstars flxrow star-4'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                    <div className='ratingcount'>4.0</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text_content'>
                                            <p>Outstanding service and quality! The product exceeded my expectations, and the customer support was incredibly helpful.</p>
                                        </div>
                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}
                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            </p>
                                        </div>

                                        <div className='mid_detail flxflexi'>
                                            <div className='nametitle flxrow align-items-center'>
                                                <h4 style={{ color: reviewsText }}>
                                                    Sarah M.
                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox' >
                                                <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                            </div>
                                        </div>
                                        <div className='review_topbar flxrow'>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingstars flxrow star-4'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                    <div className='ratingcount'>4.0</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text_content'>
                                            <p>Good product overall, but the shipping took longer than expected. Would recommend with a note on delivery times.</p>
                                        </div>
                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}
                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>




                                        <div className='mid_detail flxflexi'>
                                            <div className='nametitle flxrow align-items-center'>
                                                <h4 style={{ color: reviewsText }}>
                                                    Alex B.
                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>12/04/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox' >
                                                <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                            </div>
                                        </div>
                                        <div className='review_topbar flxrow'>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingstars flxrow star-4'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                    <div className='ratingcount'>4.0</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text_content'>
                                            <p>Average experience. The product is decent, but the packaging was damaged upon arrival.</p>
                                        </div>
                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Black</p>
                                                </p>
                                            </div>
                                        )}

                                        <div className='mid_detail flxflexi'>
                                            <div className='nametitle flxrow align-items-center'>
                                                <h4 style={{ color: reviewsText }}>
                                                    John H
                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox' >
                                                <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                            </div>
                                        </div>
                                        <div className='review_topbar flxrow'>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingstars flxrow star-5'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                    <div className='ratingcount'>5.0</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text_content'>
                                            <p>Absolutely love it! The design is sleek and modern, and it works perfectly for my needs.</p>
                                        </div>
                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}
                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>




                                        <div className='mid_detail flxflexi'>
                                            <div className='nametitle flxrow align-items-center'>
                                                <h4 style={{ color: reviewsText }}>
                                                    Emily R.

                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox' >
                                                <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                            </div>
                                        </div>
                                        <div className='review_topbar flxrow'>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingstars flxrow star-4'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                    <div className='ratingcount'>4.0</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text_content'>
                                            <p>Great value for money! I'm very happy with my purchase and would definitely buy again.</p>
                                        </div>
                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  XL / Green</p>
                                                </p>
                                            </div>
                                        )}
                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>




                                        <div className='mid_detail flxflexi'>
                                            <div className='nametitle flxrow align-items-center'>
                                                <h4 style={{ color: reviewsText }}>
                                                    Michael S.
                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox' >
                                                <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                            </div>
                                        </div>
                                        <div className='review_topbar flxrow'>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingstars flxrow star-4'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                    <div className='ratingcount'>4.0</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text_content'>
                                            <p>The product arrived earlier than expected and works as advertised. Very satisfied with the purchase.
                                            </p>
                                        </div>
                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}

                                        <div className='mid_detail flxflexi'>
                                            <div className='nametitle flxrow align-items-center'>
                                                <h4 style={{ color: reviewsText }}>
                                                    Laura H.

                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox' >
                                                <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                            </div>
                                        </div>
                                        <div className='review_topbar flxrow'>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingstars flxrow star-2'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                    <div className='ratingcount'>2.0</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text_content'>
                                            <p>Disappointing. The item was broken when it arrived, and customer service was unresponsive.</p>
                                        </div>
                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}

                                        <div className='mid_detail flxflexi'>
                                            <div className='nametitle flxrow align-items-center'>
                                                <h4 style={{ color: reviewsText }}>
                                                    David K.

                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox' >
                                                <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                            </div>
                                        </div>
                                        <div className='review_topbar flxrow'>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingstars flxrow star-5'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                    <div className='ratingcount'>5.0</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text_content'>
                                            <p>Fantastic quality! The materials feel premium, and it looks even better in person.
                                            </p>
                                        </div>
                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}

                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>

                                        <div className='mid_detail flxflexi'>
                                            <div className='nametitle flxrow align-items-center'>
                                                <h4 style={{ color: reviewsText }}>
                                                    Jessica T.
                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox' >
                                                <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                            </div>
                                        </div>
                                        <div className='review_topbar flxrow'>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingstars flxrow star-3'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                    <div className='ratingcount'>3.0</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text_content'>
                                            <p>The product is just okay. It's not bad, but it's not great either. It does the job.</p>
                                        </div>
                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}

                                        <div className='mid_detail flxflexi'>
                                            <div className='nametitle flxrow align-items-center'>
                                                <h4 style={{ color: reviewsText }}>
                                                    Daniel L.
                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox' >
                                                <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                            </div>
                                        </div>
                                        <div className='review_topbar flxrow'>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingstars flxrow star-1'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                    <div className='ratingcount'>1.0</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='text_content'>
                                            <p>Not worth the price. The product feels cheap and didn't live up to the description.
                                            </p>
                                        </div>
                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}

                                        <div className='mid_detail flxflexi'>
                                            <div className='nametitle flxrow align-items-center'>
                                                <h4 style={{ color: reviewsText }}>
                                                    Olivia P.
                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>

                )}

                {props.documentObj.widgetLayout == "compact" && (
                    <>
                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar '>
                                            <div className='mid_detail flxrow' >
                                                <div className='nametitle flxrow align-items-center'>

                                                    <h4 style={{ color: reviewsText }}>
                                                        John H
                                                    </h4>
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>Outstanding service and quality! The product exceeded my expectations, and the customer support was incredibly helpful
                                                .</p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>
                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingstars flxrow star-5'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                                <div className='ratingcount'>5.0</div>
                                            </div>
                                        </div>
                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar '>
                                            <div className='mid_detail flxrow' >
                                                <div className='nametitle flxrow align-items-center'>

                                                    <h4 style={{ color: reviewsText }}>
                                                        Sarah M.

                                                    </h4>
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>Good product overall, but the shipping took longer than expected. Would recommend with a note on delivery times
                                                .</p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}

                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingstars flxrow star-4'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                                <div className='ratingcount'>4.0</div>
                                            </div>
                                        </div>
                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar '>
                                            <div className='mid_detail flxrow' >
                                                <div className='nametitle flxrow align-items-center'>

                                                    <h4 style={{ color: reviewsText }}>
                                                        Alex B.
                                                    </h4>
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>Average experience. The product is decent, but the packaging was damaged upon arrival
                                                .</p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>
                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingstars flxrow star-3'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                                <div className='ratingcount'>3.0</div>
                                            </div>
                                        </div>
                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar '>
                                            <div className='mid_detail flxrow' >
                                                <div className='nametitle flxrow align-items-center'>

                                                    <h4 style={{ color: reviewsText }}>
                                                        Emily R.

                                                    </h4>
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>Absolutely love it! The design is sleek and modern, and it works perfectly for my needs.
                                            </p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>
                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingstars flxrow star-5'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                                <div className='ratingcount'>5.0</div>
                                            </div>
                                        </div>
                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar '>
                                            <div className='mid_detail flxrow' >
                                                <div className='nametitle flxrow align-items-center'>

                                                    <h4 style={{ color: reviewsText }}>
                                                        Michael S.

                                                    </h4>
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>Not worth the price. The product feels cheap and didn't live up to the description
                                                .</p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}

                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingstars flxrow star-2'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                                <div className='ratingcount'>2.0</div>
                                            </div>
                                        </div>
                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar '>
                                            <div className='mid_detail flxrow' >
                                                <div className='nametitle flxrow align-items-center'>

                                                    <h4 style={{ color: reviewsText }}>
                                                        Laura H.

                                                    </h4>
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>Great value for money! I'm very happy with my purchase and would definitely buy again.
                                            </p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>
                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingstars flxrow star-5'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                                <div className='ratingcount'>5.0</div>
                                            </div>
                                        </div>
                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar '>
                                            <div className='mid_detail flxrow' >
                                                <div className='nametitle flxrow align-items-center'>

                                                    <h4 style={{ color: reviewsText }}>
                                                        David K.

                                                    </h4>
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>The product arrived earlier than expected and works as advertised. Very satisfied with the purchase.
                                            </p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            </p>
                                        </div>
                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingstars flxrow star-4'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                                <div className='ratingcount'>4.0</div>
                                            </div>
                                        </div>
                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar '>
                                            <div className='mid_detail flxrow' >
                                                <div className='nametitle flxrow align-items-center'>

                                                    <h4 style={{ color: reviewsText }}>
                                                        Jessica T.

                                                    </h4>
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>Disappointing. The item was broken when it arrived, and customer service was unresponsive.
                                            </p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>
                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingstars flxrow star-1'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                                <div className='ratingcount'>1.0</div>
                                            </div>
                                        </div>
                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                                </div>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar '>
                                            <div className='mid_detail flxrow' >
                                                <div className='nametitle flxrow align-items-center'>

                                                    <h4 style={{ color: reviewsText }}>
                                                        Daniel L.

                                                    </h4>
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>Fantastic quality! The materials feel premium, and it looks even better in person.
                                            </p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>
                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingstars flxrow star-4'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                                <div className='ratingcount'>4.0</div>
                                            </div>
                                        </div>
                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar '>
                                            <div className='mid_detail flxrow' >
                                                <div className='nametitle flxrow align-items-center'>

                                                    <h4 style={{ color: reviewsText }}>
                                                        Olivia P.
                                                    </h4>
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>The product is just okay. It's not bad, but it's not great either. It does the job.</p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                            </p>
                                        </div>
                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingstars flxrow star-4'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                                <div className='ratingcount'>4.0</div>
                                            </div>
                                        </div>
                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>


                )}

                {props.documentObj.widgetLayout == "list" && (
                    <>
                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar flxrow'>
                                            <div className='mid_detail nametitle  flxflexi' >
                                                <h4>John H.</h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                                

                                            </div>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingcount'>4.0</div>
                                                    <div className='ratingstars flxrow star-4'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text_content'>
                                            <p>Outstanding service and quality! The product exceeded my expectations, and the customer support was incredibly helpful.</p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>

                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar flxrow'>
                                            <div className='mid_detail nametitle flxflexi' >
                                                <h4>Sarah M.</h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }


                                            </div>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingcount'>3.0</div>
                                                    <div className='ratingstars flxrow star-3'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text_content'>
                                            <p>Good product overall, but the shipping took longer than expected. Would recommend with a note on delivery times.</p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar flxrow'>
                                            <div className='mid_detail nametitle flxflexi' >
                                                <h4>Alex B.</h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }


                                            </div>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingcount'>2.0</div>
                                                    <div className='ratingstars flxrow star-2'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text_content'>
                                            <p>Average experience. The product is decent, but the packaging was damaged upon arrival.</p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>

                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar flxrow'>
                                            <div className='mid_detail nametitle flxflexi' >
                                                <h4>Emily R.</h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }


                                            </div>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingcount'>5.0</div>
                                                    <div className='ratingstars flxrow star-5'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text_content'>
                                            <p>Absolutely love it! The design is sleek and modern, and it works perfectly for my needs.</p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            </p>
                                        </div>

                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar flxrow'>
                                            <div className='mid_detail nametitle flxflexi' >
                                                <h4>Michael S.</h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }


                                            </div>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingcount'>4.0</div>
                                                    <div className='ratingstars flxrow star-4'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text_content'>
                                            <p>Not worth the price. The product feels cheap and didn't live up to the description.
                                            </p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>

                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar flxrow'>
                                            <div className='mid_detail nametitle flxflexi' >
                                                <h4>Laura H.</h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }


                                            </div>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingcount'>4.0</div>
                                                    <div className='ratingstars flxrow star-4'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text_content'>
                                            <p>Great value for money! I'm very happy with my purchase and would definitely buy again.
                                            </p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar flxrow'>
                                            <div className='mid_detail nametitle flxflexi' >
                                                <h4>David K.</h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }


                                            </div>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingcount'>3.0</div>
                                                    <div className='ratingstars flxrow star-3'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text_content'>
                                            <p>The product arrived earlier than expected and works as advertised. Very satisfied with the purchase.
                                            </p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                                            </p>
                                        </div>

                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar flxrow'>
                                            <div className='mid_detail nametitle flxflexi' >
                                                <h4>Jessica T.</h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }


                                            </div>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingcount'>5.0</div>
                                                    <div className='ratingstars flxrow star-5'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text_content'>
                                            <p>The product arrived earlier than expected and works as advertised. Very satisfied with the purchase.
                                            </p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                            </p>
                                        </div>

                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar flxrow'>
                                            <div className='mid_detail nametitle flxflexi' >
                                                <h4>Daniel L.</h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }


                                            </div>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingcount'>1.0</div>
                                                    <div className='ratingstars flxrow star-1'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text_content'>
                                            <p>Disappointing. The item was broken when it arrived, and customer service was unresponsive.</p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/3.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                            <div className='review-list-item'>
                                <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                    <div className='review'>
                                        <div className='review_topbar flxrow'>
                                            <div className='mid_detail nametitle flxflexi' >
                                                <h4>Olivia P. </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon color={verifiedBadgeBackgroundColor} /> {props.translator('verifiedPurchase')}
                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }


                                            </div>
                                            <div className='star_reviews flxfix'>
                                                <div className='star-rating'>
                                                    <div className='ratingcount'>4.0</div>
                                                    <div className='ratingstars flxrow star-4'>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                        <i className="rating-star-rounded"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='text_content'>
                                            <p>Fantastic quality! The materials feel premium, and it looks even better in person.
                                            </p>
                                        </div>

                                        {props.documentObj.itemType == 'show' && (
                                            <div className="text_content" >
                                                <p className="" style={{ color: reviewsText }}>
                                                    <p><strong>{props.getPreviewText('itemTypeTitle', props.currentLanguage)}</strong> :  L / Blue</p>
                                                </p>
                                            </div>
                                        )}


                                        <div className="text_content reply-text" style={{ backgroundColor: replyBackground }}>
                                            <p style={{ color: replyText }}>
                                                <b>{props.shopRecords.name}</b> {props.translator('replied')} :
                                            </p>
                                            <p style={{ color: replyText }}>
                                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                            </p>
                                        </div>

                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/images/product-default.png`} alt="" />
                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/images/sample-review-images/2.png`} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </>

                )}


            </div >
        </>


    );
}
