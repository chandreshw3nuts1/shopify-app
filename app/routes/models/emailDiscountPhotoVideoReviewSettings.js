import mongoose from 'mongoose';
if (mongoose.models['email_discount_photo_video_review_settings']) {
    // Delete the existing model
    delete mongoose.models['email_discount_photo_video_review_settings'];
}

const emailDiscountPhotoVideoReviewSettingsSchema = new mongoose.Schema({
    shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    en: { "type": "Object" },
    fr: { "type": "Object" },
    es: { "type": "Object" },
    it: { "type": "Object" },
    de: { "type": "Object" },
    nl: { "type": "Object" },
    pt: { "type": "Object" },
    tr: { "type": "Object" },
    ru: { "type": "Object" },
    js: { "type": "Object" },
    cn1: { "type": "Object" },
    cn2: { "type": "Object" },
    sv: { "type": "Object" },
    da: { "type": "Object" },
    no: { "type": "Object" },
    fi: { "type": "Object" },
    ko: { "type": "Object" },
    he: { "type": "Object" },
    ar: { "type": "Object" },
    pl: { "type": "Object" },
    lt: { "type": "Object" },

}, {
    timestamps: true
});

const emailDiscountPhotoVideoReviewSettings = mongoose.model('email_discount_photo_video_review_settings', emailDiscountPhotoVideoReviewSettingsSchema);
export default emailDiscountPhotoVideoReviewSettings;
