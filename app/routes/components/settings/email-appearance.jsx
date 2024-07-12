
import SingleImageUpload from "./ImageUpload";
const EmailAppearance = (props) => {
    return (
        <div className="row">
            <div className="col-lg-6">
                <div className="whitebox h-100">
                    <div className="form-group m-0">
                        <label htmlFor="">Logo</label>
                        <SingleImageUpload />
                        <div className="inputnote">You can upload an image in JPG, PNG format up to 5MB. For best compatibility, upload an image size of 1200px by 630px.</div>
                    </div>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="whitebox h-100 flxcol">
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" name="EnableEmailBanners" id="EnableEmailBanners" />
                        <label class="form-check-label" for="EnableEmailBanners">
                            Enable email banners
                            <span>Display email banners for all emails sent to customers</span>
                        </label>
                    </div>
                    <div className="form-group m-0">
                        <label htmlFor="">Appearance</label>
                        <select name="" id="" className='input_text'>
							<option value="">Sharp</option>
							<option value="">Slightly Rounded</option>
							<option value="">Rounded</option>
							<option value="">Extra Rounded</option>
						</select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmailAppearance;