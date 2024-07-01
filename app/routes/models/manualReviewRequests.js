import mongoose from 'mongoose';
if (mongoose.models['manual_review_requests']) {
  // Delete the existing model
  delete mongoose.models['manual_review_requests'];
}

const manualRequestProductsanualReviewRequestsSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    email: {type: String, required: true }
},{
    timestamps: true
});

const  manualReviewRequests = mongoose.model('manual_review_requests', manualRequestProductsanualReviewRequestsSchema);
export default manualReviewRequests;
