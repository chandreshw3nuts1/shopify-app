import CloseIcon from "../icons/CloseIcon";
import { Image } from "react-bootstrap";
import LongArrowLeft from "../icons/LongArrowLeft";
import LongArrowRight from "../icons/LongArrowRight";
import { getUploadDocument } from './../../../utils/documentPath';
import StarBigIcon from "../icons/StarBigIcon";
import moment from 'moment';
import settingsJson from './../../../utils/settings.json';
import InfoIcon from "../icons/InfoIcon";
import ArrowRightIcon from "../icons/ArrowRightIcon";
import PlayIcon from "../icons/PlayIcon";

import {
    Text,
} from "@shopify/polaris";


const ReviewDetailModalWidget = ({ shopRecords, reviewDetails, productsDetails, formParams }) => {
    const videoIcon = `${settingsJson.host_url}/images/play-circle.png`;

    return (
        <>
            <div class={`modal fade reviewdetailpopup ${reviewDetails.reviewDocuments.length > 0 ? '' : 'imagemissing'}`} data-bs-backdrop="static" id="staticBackdrop" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <CloseIcon />
                        </button>


                        <div class="modal-body">
                            <div className="revdetailwrap flxrow">
                                {reviewDetails.reviewDocuments.length > 0 &&
                                    <div className="imagesliderwrap">

                                        <div id="carouselExampleCaptions" class="carousel slide">

                                            <div class="carousel-indicators">
                                                {reviewDetails.reviewDocuments.map((media, i) => (
                                                    <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to={i} class={i == 0 ? "active" : ""} aria-current={i == 0 ? "true" : ""} aria-label="Slide 1">
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
                                            <div class="carousel-inner">
                                                {reviewDetails.reviewDocuments.map((media, i) => (
                                                    <div class={`carousel-item ${i == 0 ? "active" : ""}`}>
                                                        <div className="imagewrap">
                                                            {media.type === 'image' ? (
                                                                <Image src={getUploadDocument(media.url)} alt="" />
                                                            ) : (
                                                                <div className="videowrap">
                                                                    <video>
                                                                        <source src={getUploadDocument(media.url)} type="video/mp4" />
                                                                    </video>
                                                                    <button><PlayIcon /></button>
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>
                                                ))}

                                            </div>
                                            <button class={`carousel-control-prev ${reviewDetails.reviewDocuments.length < 2 ? 'disabled' : ''}`} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                                <span class="carousel-control-prev-icon" aria-hidden="true">
                                                    <LongArrowLeft />
                                                </span>
                                            </button>
                                            <button class={`carousel-control-next ${reviewDetails.reviewDocuments.length < 2 ? 'disabled' : ''}`} type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                                <span class="carousel-control-next-icon" aria-hidden="true">
                                                    <LongArrowRight />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                }
                                <div className="rightinfowrap flxcol">
                                    <div className="top_detail flxfix">
                                        <div className="namerow flxrow">
                                            <h3>{reviewDetails.first_name} {reviewDetails.last_name}</h3>
                                            <div className="infoicon">
                                                <InfoIcon />
                                            </div>
                                        </div>
                                        {/* <div>{JSON.stringify(reviewDetails.reviewDocuments)}</div> */}
                                        <div className="reviewanddates">
                                            <div class={`ratingstars flxrow star-${reviewDetails.rating}`}>
                                                <StarBigIcon className="ratingstar" />
                                                <StarBigIcon className="ratingstar" />
                                                <StarBigIcon className="ratingstar" />
                                                <StarBigIcon className="ratingstar" />
                                                <StarBigIcon className="ratingstar" />
                                            </div>
                                            <div className="datebox">
                                                {moment(reviewDetails.created_at).format('M/D/YYYY')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mid_detail flxflexi">
                                        <div className="reviewtext">
                                            <p>{reviewDetails.description}</p>
                                        </div>
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
                                                            View Product <ArrowRightIcon />
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