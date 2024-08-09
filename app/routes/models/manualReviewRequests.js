import mongoose from 'mongoose';
if (mongoose.models['manual_review_requests']) {
  // Delete the existing model
  delete mongoose.models['manual_review_requests'];
}

const manualRequestProductsanualReviewRequestsSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    email: {type: String, required: true },
    first_name: {type: String },
    last_name: {type: String },
    customer_locale: {type: String, default : "en" },
    country_code: {type: String },
    product_ids: {type: Array },
    order_id: {type: String },
    order_number: {type: String },
    request_status: {type: String },
    total_order_amount: {type: Number }
     
},{
    timestamps: true
});

const  manualReviewRequests = mongoose.model('manual_review_requests', manualRequestProductsanualReviewRequestsSchema);
export default manualReviewRequests;
