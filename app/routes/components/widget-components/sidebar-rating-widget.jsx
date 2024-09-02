
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
                        position: fixed; 
                        transform: ${transform};
                        ${leftCss};
                        ${rightCss};
                        
                        top: ${top};
                        display: flex;
                        align-items: center;
                        background-color: ${props.sidebarReviewWidgetCustomizesModel.buttonBackgroundColor};
                        color: ${props.sidebarReviewWidgetCustomizesModel.buttonTextColor};
                        padding: 0px 10px 0px 0px;
                        border-radius: ${borderRadius};
                        cursor: pointer;
                        box-shadow: 2px 2px 5px rgba(0,0,0,0.3);
                        font-size : 18px;
                        z-index: 100000;
                    }
                    @media (max-width: 480px) {
                        #sidebar_popup_extension_widget .hide-sidebar-widget-on-mobile {
                            display: none;
                        }
                    }

				`}
            </style>
            <div class={`open-w3-float-modal ${hideOnMobileClass}`}>
                <div class="review-sidebar">
                    <div class="review-icon">
                        {props.CommonRatingComponent ? <props.CommonRatingComponent color={iconColor} /> : null}
                    </div>
                    <span class="review-text">{reviewText}</span>
                </div>
            </div>
        </>
    );
}

export default SidebarRatingWidget;
