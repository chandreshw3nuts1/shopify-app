import CloseIcon from "../icons/CloseIcon";
import { Image } from "react-bootstrap";
import LongArrowLeft from "../icons/LongArrowLeft";
import LongArrowRight from "../icons/LongArrowRight";
import { getUploadDocument } from './../../../utils/documentPath';
import StarBigIcon from "../icons/StarBigIcon";
import { formatDate } from './../../../utils/dateFormat';
import settingsJson from './../../../utils/settings.json';
import InfoIcon from "../icons/InfoIcon";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import PlayIcon from "../icons/PlayIcon";
import PauseIcon from "../icons/PauseIcon";
import ReviewVerifyIcon from "../icons/ReviewVerifyIcon";

const ReviewDetailModalWidget = ({ shopRecords, reviewDetails, productsDetails, formParams, generalAppearancesModel, CommonRatingComponent, otherProps }) => {
    const { translations, productReviewWidgetCustomizesModel, languageWiseProductWidgetSettings } = otherProps;

    return (
        <>
            <div className={`modal fade reviewdetailpopup ${reviewDetails.reviewDocuments.length > 0 ? '' : 'imagemissing'}`} data-bs-backdrop="static" id="staticBackdrop" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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

                                            <div className="carousel-indicators">
                                                {reviewDetails.reviewDocuments.map((media, i) => (
                                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={i} className={i == 0 ? "active" : ""} aria-current={i == 0 ? "true" : ""} aria-label="Slide 1">
                                                        {media.type === 'image' ? (
                                                            <Image src={getUploadDocument(media.url)} alt="" />
                                                        ) : (
                                                            // <Image src={videoIcon} alt="" />
                                                            <video>
                                                                <source src={getUploadDocument(media.url)} type="video/mp4" />
                                                            </video>
                                                        )}
                                                    </button>
                                                ))}

                                            </div>
                                            <div className="carousel-inner">
                                                {reviewDetails.reviewDocuments.map((media, i) => (
                                                    <div className={`carousel-item ${i == 0 ? "active" : ""}`}>
                                                        <div className="imagewrap">
                                                            {media.type === 'image' ? (
                                                                <Image src={getUploadDocument(media.url)} alt="" />
                                                            ) : (
                                                                <div className="videowrap">
                                                                    <video id="mainVideoPlayer">
                                                                        <source src={getUploadDocument(media.url)} type="video/mp4" />
                                                                    </video>
                                                                    <button id="mainVideoPlayButton"><PlayIcon /></button>
                                                                    <button id="mainVideoPauseButton" style={{ display: 'none' }} ><PauseIcon /></button>
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
                                                <h3>{reviewDetails.first_name} {reviewDetails.last_name}</h3>

                                                {reviewDetails.verify_badge &&
                                                    <div className='verifiedreview'>
                                                        <ReviewVerifyIcon /> {translations.verifiedPurchase}
                                                    </div>
                                                }

                                            </div>
                                            <div className="infoicon">
                                                <InfoIcon />
                                            </div>
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
                                                    <Image src={productsDetails[0].images.edges[0].node.transformedSrc} alt={productsDetails[0].title} />
                                                </div>
                                                <div className="detailbox flxflexi">
                                                    <h6>{productsDetails[0].title}</h6>
                                                    <div className="prolink">
                                                        <a href={`https://${shopRecords.shop}/products/${productsDetails[0].handle}`} target="_blank" rel="noopener noreferrer">
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
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReviewDetailModalWidget;