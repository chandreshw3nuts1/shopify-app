import mongoose from 'mongoose';
import { type } from 'os';
if (mongoose.models['email_review_request_settings']) {
  // Delete the existing model
  delete mongoose.models['email_review_request_settings'];
}

const emailReviewRequestSettingsSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    en :{type: Object },
    fr :{type: Object },
},{
    timestamps: true
});

const  emailReviewRequestSettings = mongoose.model('email_review_request_settings', emailReviewRequestSettingsSchema);
export default emailReviewRequestSettings;
