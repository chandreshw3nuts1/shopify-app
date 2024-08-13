import React, { useEffect, useRef } from 'react';
import settingsJson from './../../../utils/settings.json';
import ReviewVerifyIcon from '../icons/ReviewVerifyIcon';

export default function MasonryLayout(props) {
    const masonryContainerRef = useRef(null);
    let replyText, replyBackground, replyBackgroundOnHover, reviewsText, reviewsBackground, reviewsBackgroundOnHover = "";


    if (props.documentObj.widgetColor == 'custom') {
        replyText = props.documentObj.replyText;
        replyBackground = props.documentObj.replyBackground;
        replyBackgroundOnHover = props.documentObj.replyBackgroundOnHover;
        reviewsText = props.documentObj.reviewsText;
        reviewsBackground = props.documentObj.reviewsBackground;
        reviewsBackgroundOnHover = props.documentObj.reviewsBackgroundOnHover;
    } else if (props.documentObj.widgetColor == 'white') {

    }

    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://unpkg.com/masonry-layout@4/dist/masonry.pkgd.min.js";
        script.async = true;

        script.onload = () => {
            new window.Masonry(masonryContainerRef.current, {

            });
        };

        document.body.appendChild(script);

        // Cleanup: remove the script when the component is unmounted
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
                                                <img src={`${settingsJson.host_url}/app/images/sample-review-images/1.png`} alt="" />
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
                                            <p>I have been using these industry leading headphones by Sony, colour Midnight Blue, and trust me i find them worth every penny spent. Yes, i agree these headphones are highly expensive, some may say you can purchase Apple Airpods, Boss, Sennheiser, and other audio equipment options, but trust me nothing beats these bad boys.</p>
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
                                                    John H
                                                </h4>
                                                <div className='verifiedreview'>
                                                    <ReviewVerifyIcon /> {props.translator('verifiedPurchase')}
                                                </div>
                                            </div>
                                            {props.documentObj.reviewDates == 'show' &&
                                                <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                            }

                                        </div>


                                        <div className='review_bottomwrap'>
                                            <div className='product-container product-thumb-detail'>
                                                <div className='image flxfix'>
                                                    <img src={`${settingsJson.host_url}/app/images/product-default.png`} alt="" />
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
                                                        <ReviewVerifyIcon /> {props.translator('verifiedPurchase')}
                                                    </div>

                                                </div>
                                                {props.documentObj.reviewDates == 'show' &&
                                                    <div className='date' style={{ color: reviewsText }}>08/03/2024</div>
                                                }
                                            </div>
                                        </div>



                                        <div className='text_content'>
                                            <p>I have been using these industry leading headphones by Sony, colour Midnight Blue, and trust me i find them worth every penny spent. Yes, i agree these headphones are highly expensive, some may say you can purchase Apple Airpods, Boss, Sennheiser, and other audio equipment options, but trust me nothing beats these bad boys.</p>
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
                                                    <img src={`${settingsJson.host_url}/app/images/product-default.png`} alt="" />

                                                </div>
                                                <div className='text flxflexi'>
                                                    <p>Sample Product</p>
                                                </div>
                                            </div>
                                            <div className='review_imageswrap flxrow'>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/app/images/sample-review-images/1.png`} alt="" />
                                                </div>
                                                <div className='imagebox'>
                                                    <img src={`${settingsJson.host_url}/app/images/sample-review-images/1.png`} alt="" />
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
                    <div className={`w3grid-review-item frontreviewbox ${props.gridClassName}`}>
                        <div className='review-list-item'>
                            <div className='box-style custombg' style={{ backgroundColor: reviewsBackground }}>
                                <div className='review'>
                                    <div className='review_topbar flxrow'>
                                        <div className='mid_detail flxflexi' >
                                            <h4>John H</h4>

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
                                        <p>I have been using these industry leading headphones by Sony, colour Midnight Blue, and trust me i find them worth every penny spent. Yes, i agree these headphones are highly expensive, some may say you can purchase Apple Airpods, Boss, Sennheiser, and other audio equipment options, but trust me nothing beats these bad boys.</p>
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
                                                <img src={`${settingsJson.host_url}/app/images/product-default.png`} alt="" />
                                            </div>
                                            <div className='text flxflexi'>
                                                <p>Sample Product</p>
                                            </div>
                                        </div>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox'>
                                                <img src={`${settingsJson.host_url}/app/images/sample-review-images/1.png`} alt="" />
                                            </div>
                                            <div className='imagebox'>
                                                <img src={`${settingsJson.host_url}/app/images/sample-review-images/1.png`} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            </div >
        </>


    );
}
