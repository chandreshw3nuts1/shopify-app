import LongArrowRight from "../icons/LongArrowRight";
import ShareIcon from "../icons/ShareIcon";
import CopyIcon from "../icons/CopyIcon";


const ThankYouPage = ({shopRecords, discountText, discountCode, otherProps }) => {
    const { reviewFormSettingsModel, languageWiseReviewFormSettings, translations } = otherProps;

    const languageContent = (type) => {
        if (type && languageWiseReviewFormSettings[type] !== undefined && languageWiseReviewFormSettings[type] !== '') {
            return languageWiseReviewFormSettings[type];
        } else {
            return translations.reviewFormSettings[type];
        }
    }

	const shopUrl = "https://" + shopRecords.shop;

    return (
        <>

            <div className="modal-header">
                <div className="flxflexi">
                    <h1 className="modal-title">{languageContent('thankyouTitle')}</h1>
                    <div className="subtextbox">{languageContent('thankyouSubTitle')}</div>
                </div>
            </div>
            <div className="modal-body">
                <div className="thankyoubody">
                    {/* <div className="sharewithfriends">
                        <a href="#">
                            <span className="flxfix"><ShareIcon /></span>
                            <strong className="flxflexi">Share with friends and groups, they'll get <b>14%</b> of their first purchase</strong>
                        </a>
                    </div> */}
                    {discountCode &&
                        <div className="copycodewrap">
                            <div className="textline"> {languageContent('thankyouDiscountText').replace(/\[discount\]/g, discountText)}</div>
                            <div className="discountcodebox">
                                <div className="codebox" id="discount-code">{discountCode}</div>
                                <div className="copybtn">
                                    <button type="button" id="copy-button"><CopyIcon /></button>
                                    <span id="copy-message" style={{display: 'none'}}>Copied!</span>
                                </div>
                            </div>
                            <div className="textline">{translations.thankyouPageEmailText}</div>
                        </div>
                    }
                </div>
            </div>
            <div className="modal-footer">
                <a href={shopUrl} className="revbtn lightbtn nextbtn continueBtn">Continue <LongArrowRight /></a>
            </div>


        </>

    );

}

export default ThankYouPage;
