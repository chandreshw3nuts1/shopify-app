
const VideoSliderError = (props) => {

    return (
        <>
            <style>
                {`
                    .video-slider-widget-error {
                        border: 1px solid #ccc;
                        border-radius: 10px;
                        background-color: #ffeaea;
                        padding: 20px;
                        position: relative;
                        max-width: 600px;
                        margin: 0 auto;
                        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
                    }

                    .video-slider-widget-error .widget-title {
                        position: absolute;
                        top: -15px;
                        left: 15px;
                        background-color: #e9f0ff;
                        padding: 5px 10px;
                        border: 1px solid #3a7afe;
                        border-radius: 5px;
                        font-weight: bold;
                        color: #3a7afe;
                    }

                    .video-slider-widget-error .widget-content {
                        text-align: center;
                    }

                    .video-slider-widget-error .error-message {
                        font-size: 18px;
                        font-weight: bold;
                        color: #a30000;
                        margin-bottom: 10px;
                    }
                

                    .video-slider-widget-error .editor-note {
                        font-size: 12px;
                        color: #888;
                        margin-top: 20px;
                    }

				`}
            </style>
            <div className="video-slider-widget-error">

                <div className="widget-content">
                    <p className="error-message">
                        You must have at least 3 photo/video reviews to use the Video Slider Widget
                    </p>
                    <p className="editor-note">*This error is only visible in the Shopify editor</p>
                </div>
            </div>

        </>
    );
}

export default VideoSliderError;
