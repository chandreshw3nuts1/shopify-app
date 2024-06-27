import CloseIcon from "../icons/CloseIcon";
import { Image } from "react-bootstrap";
import LongArrowLeft from "../icons/LongArrowLeft";
import LongArrowRight from "../icons/LongArrowRight";

const ReviewDetailModalWidget = () => {
    const SliderImage1 = "https://gossip-relationships-corporations-cottage.trycloudflare.com/images/slider-image-1.jpg";
    const SliderImage2 = "https://gossip-relationships-corporations-cottage.trycloudflare.com/images/slider-image-2.jpg";
    const SliderImage3 = "https://gossip-relationships-corporations-cottage.trycloudflare.com/images/slider-image-3.jpg";
    const SliderImage4 = "https://gossip-relationships-corporations-cottage.trycloudflare.com/images/slider-image-4.jpg";
    return (
        <>
            <div class="modal fade reviewdetailpopup" id="staticBackdrop" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <CloseIcon />
                        </button>
                        <div class="modal-body">
                            <div className="revdetailwrap flxrow">
                                <div className="imagesliderwrap">
                                    <div id="carouselExampleCaptions" class="carousel slide">
                                        <div class="carousel-indicators">
                                            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1">
                                                <Image src={SliderImage1} alt="" />
                                            </button>
                                            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="1" aria-label="Slide 2">
                                                <Image src={SliderImage2} alt="" />
                                            </button>
                                            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="2" aria-label="Slide 3">
                                                <Image src={SliderImage3} alt="" />
                                            </button>
                                            <button type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide-to="3" aria-label="Slide 4">
                                                <Image src={SliderImage4} alt="" />
                                            </button>
                                        </div>
                                        <div class="carousel-inner">
                                            <div class="carousel-item active">
                                                <div className="imagewrap">
                                                    <Image src={SliderImage1} alt="" />
                                                </div>
                                            </div>
                                            <div class="carousel-item">
                                                <div className="imagewrap">
                                                    <Image src={SliderImage2} alt="" />
                                                </div>
                                            </div>
                                            <div class="carousel-item">
                                                <div className="imagewrap">
                                                    <Image src={SliderImage3} alt="" />
                                                </div>
                                            </div>
                                            <div class="carousel-item">
                                                <div className="imagewrap">
                                                    <Image src={SliderImage4} alt="" />
                                                </div>
                                            </div>
                                        </div>
                                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true">
                                                <LongArrowLeft />
                                            </span>
                                        </button>
                                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true">
                                                <LongArrowRight />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className="rightinfowrap"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReviewDetailModalWidget;