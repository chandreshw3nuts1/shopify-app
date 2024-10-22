import CloseIcon from "../icons/CloseIcon";
import { Image } from "react-bootstrap";
import LongArrowLeft from "../icons/LongArrowLeft";
import LongArrowRight from "../icons/LongArrowRight";
import { getUploadDocument } from './../../../utils/documentPath';
import { formatDate, reviewersNameFormat } from './../../../utils/dateFormat';
import InfoIcon from "../icons/InfoIcon";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import PlayIcon from "../icons/PlayIcon";
import PauseIcon from "../icons/PauseIcon";
import ReviewVerifyIcon from "../icons/ReviewVerifyIcon";
import VerifyTransparencyPopup from "./components/VerifyTransparencyPopup";


const ReviewDetailModalWidget = ({ shopRecords, reviewDetails, productsDetails, formParams, generalAppearancesModel, CommonRatingComponent, otherProps }) => {
    const { translations, productReviewWidgetCustomizesModel, languageWiseProductWidgetSettings } = otherProps;
    return (
        <>
            <div className={`modal fade reviewdetailpopup ${reviewDetails.reviewDocuments.length > 0 ? '' : 'imagemissing'}`} id="staticBackdrop" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <CloseIcon />
                        </button>


                        <div className="modal-body">
                            <div className="revdetailwrap flxrow">
                                {reviewDetails.reviewDocuments.length > 0 &&
                                    <div className="imagesliderwrap">

                                        <div id="carouselExampleCaptions" className="carousel slide">
                                            {reviewDetails.reviewDocuments.length > 1 &&
                                                <div className="carousel-indicators">
                                                    {reviewDetails.reviewDocuments.map((media, i) => (
                                                        <button key={i} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={i} className={i == 0 ? "active" : ""} aria-current={i == 0 ? "true" : ""} aria-label="Slide 1">
                                                            {media.type === 'image' ? (
                                                                <Image src={getUploadDocument(media.url, shopRecords.shop_id)} alt="" />
                                                            ) : (
                                                                <Image src={getUploadDocument(media.thumbnail_name, shopRecords.shop_id)} alt="" />
                                                            )}
                                                        </button>
                                                    ))}

                                                </div>
                                            }
                                            <div className="carousel-inner">
                                                {reviewDetails.reviewDocuments.map((media, i) => (
                                                    <div key={i} className={`carousel-item ${i == 0 ? "active" : ""}`}>
                                                        <div className="imagewrap">
                                                            {media.type === 'image' ? (
                                                                <Image src={getUploadDocument(media.url, shopRecords.shop_id)} alt="" />
                                                            ) : (
                                                                <div className="videowrap">
                                                                    <video className="mainVideoPlayer">
                                                                        <source src={getUploadDocument(media.url, shopRecords.shop_id)} type="video/mp4" />
                                                                    </video>
                                                                    <button className="mainVideoPlayButton"><PlayIcon /></button>
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                            <button className={`carousel-control-prev ${reviewDetails.reviewDocuments.length < 2 ? 'disabled' : ''}`} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                                <span className="carousel-control-prev-icon" aria-hidden="true">
                                                    <LongArrowLeft />
                                                </span>
                                            </button>
                                            <button className={`carousel-control-next ${reviewDetails.reviewDocuments.length < 2 ? 'disabled' : ''}`} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                                <span className="carousel-control-next-icon" aria-hidden="true">
                                                    <LongArrowRight />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                }
                                <div className="rightinfowrap flxcol">
                                    <div className="top_detail flxfix">
                                        <div className="namerow flxrow">
                                            <div className='nametitle flxrow align-items-center'>
                                                <h3>
                                                    {reviewersNameFormat(reviewDetails.first_name, reviewDetails.last_name, shopRecords.reviewers_name_format)}
                                                </h3>

                                                {reviewDetails.verify_badge ? (
                                                    <>
                                                        {shopRecords.verified_review_style == "icon" ? (
                                                            <div className='verifiedreview'>
                                                                <ReviewVerifyIcon />
                                                            </div>
                                                        ) : (
                                                            <div className='verifiedreview'>
                                                                <ReviewVerifyIcon /> {translations.verifiedPurchase}
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {shopRecords.is_enable_review_not_verified &&
                                                            <div className='verifiedreview'>
                                                                {translations.unVerifiedPurchase}
                                                            </div>
                                                        }
                                                    </>
                                                )}

                                            </div>

                                            {((shopRecords.is_enable_future_purchase_discount && reviewDetails.reviewDocuments.length > 0) || (shopRecords.is_enable_import_from_external_source && reviewDetails.is_imported) || (shopRecords.is_enable_review_written_by_site_visitor && !reviewDetails.is_imported) || (shopRecords.is_enable_marked_verified_by_store_owner && reviewDetails.verify_badge)) &&
                                                <div className="infoicon open-transparency-popup-modal">
                                                    <InfoIcon />
                                                </div>
                                            }
                                        </div>

                                        {/* <div>{JSON.stringify(reviewDetails.reviewDocuments)}</div> */}
                                        <div className="reviewanddates">
                                            <div className={`ratingstars flxrow star-${reviewDetails.rating}`}>
                                                {CommonRatingComponent ? <CommonRatingComponent color={reviewDetails.rating >= 1 ? generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                {CommonRatingComponent ? <CommonRatingComponent color={reviewDetails.rating >= 2 ? generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                {CommonRatingComponent ? <CommonRatingComponent color={reviewDetails.rating >= 3 ? generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                {CommonRatingComponent ? <CommonRatingComponent color={reviewDetails.rating >= 4 ? generalAppearancesModel.starIconColor : "currentColor"} /> : null}
                                                {CommonRatingComponent ? <CommonRatingComponent color={reviewDetails.rating >= 5 ? generalAppearancesModel.starIconColor : "currentColor"} /> : null}

                                            </div>

                                            {productReviewWidgetCustomizesModel.reviewDates == 'show' &&
                                                <div className="datebox">
                                                    {formatDate(reviewDetails.createdAt, shopRecords.timezone, 'M/D/YYYY')}
                                                </div>
                                            }

                                        </div>
                                    </div>
                                    <div className="mid_detail flxflexi">
                                        <div className="reviewtext">
                                            <p>{reviewDetails.description}</p>
                                        </div>

                                        {productReviewWidgetCustomizesModel.itemType == 'show' && reviewDetails.variant_title && (
                                            <div className="text_content">
                                                <p className="reply-text">
                                                    <b> {languageWiseProductWidgetSettings.itemTypeTitle ? languageWiseProductWidgetSettings.itemTypeTitle : translations.productReviewConstomize.itemTypeTitle} </b>: {reviewDetails.variant_title}
                                                </p>
                                            </div>
                                        )}

                                        {reviewDetails.replyText &&
                                            <div className="text_content">
                                                <p className="reply-text">
                                                    <b>{shopRecords.name}</b> {translations.replied} :
                                                </p>
                                                <p>
                                                    {reviewDetails.replyText}
                                                </p>
                                            </div>}


                                        <div className="qawrap">
                                            {reviewDetails.reviewQuestionsAnswer.map((questionAns, qIndex) => (
                                                !questionAns.reviewQuestions.isHideAnswers && (
                                                    <div className="qaboxrow" key={qIndex}>
                                                        <div className="quationname">{questionAns.question_name}</div>
                                                        <div className="answername">{questionAns.answer}</div>
                                                    </div>
                                                )
                                            ))}

                                        </div>
                                    </div>

                                    {productsDetails.length > 0 && formParams.hideProductThumbnails == 'false' && (
                                        <div className="bottom_detail flxfix">
                                            <div className="productbox">
                                                <div className="imgbox flxfix">

                                                    {productsDetails[0]?.product_image &&
                                                        <Image src={productsDetails[0].product_image} alt={productsDetails[0].product_title} />
                                                    }

                                                </div>
                                                <div className="detailbox flxflexi">
                                                    <h6>{productsDetails[0].product_title}</h6>
                                                    <div className="prolink">
                                                        <a href={`https://${shopRecords.shop}/products/${productsDetails[0].product_handle}`} target="_blank" rel="noopener noreferrer">
                                                            {languageWiseProductWidgetSettings.productPageLinkTitle ? languageWiseProductWidgetSettings.productPageLinkTitle : translations.productReviewConstomize.productPageLinkTitle} <ArrowRightIcon />
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <VerifyTransparencyPopup shopRecords={shopRecords} reviewDetails={reviewDetails} />

                    </div>
                </div>
            </div>
        </>
    )
}

export default ReviewDetailModalWidget;