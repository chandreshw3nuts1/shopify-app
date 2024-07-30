import mongoose from 'mongoose';
if (mongoose.models['review_request_timing_settings']) {
  // Delete the existing model
  delete mongoose.models['review_request_timing_settings'];
}

const reviewRequestTimingSettingsSchema = new mongoose.Schema({
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    default_day_timing: {type: String },
    is_different_timing: {type: Boolean, default : false },
    default_order_timing: {type: String},
    domestic_day_timing: {type: String },
    domestic_order_timing: {type: String },
    international_day_timing: {type: String },
    international_order_timing: {type: String },
    fallback_timing: {type: String }
    
},{
    timestamps: true
});

const  reviewRequestTimingSettings = mongoose.model('review_request_timing_settings', reviewRequestTimingSettingsSchema);
export default reviewRequestTimingSettings;
