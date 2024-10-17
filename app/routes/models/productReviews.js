import mongoose from 'mongoose';
if (mongoose.models['product_reviews']) {
  // Delete the existing model
  delete mongoose.models['product_reviews'];
}

const productReviewsSchema = new mongoose.Schema({

    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    display_name: { type: String, required: true },
    email: { type: String, required: true },
    rating: { type: Number, required: true },
    product_id: { type: Number, required: true },
    variant_title: { type: String },
    product_title: { type: String },
    product_url: { type: String },
    status: { type: String, required: true },
    description: { type: String,required: true },
    customer_locale: { type: String, default: 'en' },
    replyText: { type: String},
    replied_at: { type: Date},
    is_review_request: { type: Boolean, default: false },
    is_imported: { type: Boolean, default: false },
    imported_app: { type: String },
    tag_as_feature: { type: Boolean, default: false },
    verify_badge: { type: Boolean, default: false },
    add_to_carousel: { type: Boolean, default: false },
    video_slider: { type: Boolean, default: false },
    discount_code_id : { type: String, default : null},
    is_reminder_sent: { type: Boolean, default: false },
    is_resend_review_submitted: { type: Boolean, default: false },
},{
    timestamps: true
});

const  productReviews = mongoose.model('product_reviews', productReviewsSchema);
export default productReviews;
