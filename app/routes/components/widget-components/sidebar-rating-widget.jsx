
const SidebarRatingWidget = (props) => {
    const iconColor = props.sidebarReviewWidgetCustomizesModel.buttonTextColor;
    const reviewText = props.sidebarReviewWidgetCustomizesModel.buttonText != "" ? props.sidebarReviewWidgetCustomizesModel.buttonText : props.settingsJson.sidebarRatingWidgetCustomize.buttonText;
    var leftCss = "left: -41px;" , rightCss = "", borderRadius="0px 0px 10px 10px", top = "45%" , transform = "rotate(-90deg)";

    if(props.sidebarReviewWidgetCustomizesModel.widgetPosition== 'right'){
        rightCss = "right : -41px;";
        leftCss = "";
        borderRadius = "10px 10px 0px 0px";

        if(props.sidebarReviewWidgetCustomizesModel.widgetOrientation== 'ttb'){
            transform = "rotate(90deg)";
            borderRadius = "0px 0px 10px 10px";
        }

    } else {

        if(props.sidebarReviewWidgetCustomizesModel.widgetOrientation== 'ttb'){
            transform = "rotate(90deg)";
            borderRadius = "10px 10px 0px 0px";
        }
    }

    let hideOnMobileClass = "";
    if(props.sidebarReviewWidgetCustomizesModel.hideOnMobile == true){
        hideOnMobileClass = "hide-sidebar-widget-on-mobile";
    }
    return (
        <>
            <style>
                {`
				
                    #sidebar_popup_extension_widget .review-sidebar {
                        background-color: ${props.sidebarReviewWidgetCustomizesModel.buttonBackgroundColor};
                        color: ${props.sidebarReviewWidgetCustomizesModel.buttonTextColor};
                        
                    }
                    @media (max-width: 767px) {
                        #sidebar_popup_extension_widget .hide-sidebar-widget-on-mobile {
                            display: none;
                        }
                    }

				`}
            </style>
            <div className={`open-w3-float-modal ${hideOnMobileClass}`}>
                <div className="review-sidebar">
                    <div className="review-icon">
                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={iconColor} /> : null}
                    </div>
                    <span className="review-text">{reviewText}</span>
                </div>
            </div>
        </>
    );
}

export default SidebarRatingWidget;
