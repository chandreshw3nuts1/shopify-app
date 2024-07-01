import mongoose from 'mongoose';
if (mongoose.models['manual_request_products']) {
  // Delete the existing model
  delete mongoose.models['manual_request_products'];
}

const manualRequestProductsSchema = new mongoose.Schema({
    
    manual_request_id: {type: mongoose.Schema.Types.ObjectId, ref: 'manual_review_requests', required: true },
    product_id: {type: String, required: true },
    status: {type: String, required: true }
},{
    timestamps: true
});

const  manualRequestProducts = mongoose.model('manual_request_products', manualRequestProductsSchema);
export default manualRequestProducts;
