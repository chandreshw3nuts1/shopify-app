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
    product_id: { type: String, required: true },
    product_title: { type: String },
    product_url: { type: String },
    status: { type: String, required: true },
    description: { type: String,required: true },
    is_review_request: { type: Boolean, default: false },
    tag_as_feature: { type: Boolean, default: false },
    verify_badge: { type: Boolean, default: false },
    add_to_carousel: { type: Boolean, default: false },
    
    
},{
    timestamps: true
});

const  productReviews = mongoose.model('product_reviews', productReviewsSchema);
export default productReviews;