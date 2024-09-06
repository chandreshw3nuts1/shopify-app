import { getUploadDocument } from './../../../utils/documentPath';

const TestimonialsCarouselWidget = (props) => {
    const iconColor = (props.formParams.widget_icon_color != "rgba(0,0,0,0)" && props.formParams.widget_icon_color != "") ? props.formParams.widget_icon_color : props.generalAppearancesModel.starIconColor;
    const textColor = (props.formParams.widget_text_color != "rgba(0,0,0,0)" && props.formParams.widget_text_color != "") ? props.formParams.widget_text_color : '#ffffff';

    return (
        <>
            <style>
                {`
                    .w3-slider-wrapper .reviewer_name {
                        color: ${textColor} !important;
                    }
				`}
            </style>
            {props.reviewItems.length > 0 &&
                <div className="owl-carousel owl-theme">
                    <div className="testimonial-item">
                        <i className="fas fa-quote-left quote-icon"></i>
                        <p>"This is an amazing product!"</p>
                        <div className="rating">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star"></i>
                        </div>
                        <h4>John D.</h4>
                    </div>
                    <div className="testimonial-item">
                        <i className="fas fa-quote-left quote-icon"></i>
                        <p>"I absolutely love it!"</p>
                        <div className="rating">
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="fas fa-star"></i>
                            <i className="far fa-star"></i>
                        </div>
                        <h4>Sarah P.</h4>
                    </div>
                </div>
            }
        </>
    );
}

export default TestimonialsCarouselWidget;
