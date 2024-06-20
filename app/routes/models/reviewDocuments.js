import mongoose from 'mongoose';
if (mongoose.models['review_documents']) {
  // Delete the existing model
  delete mongoose.models['review_documents'];
}

const reviewDocumentsSchema = new mongoose.Schema({

    review_id: {type: mongoose.Schema.Types.ObjectId, ref: 'product_reviews', required: true },
    type: { type: String, required: true },
    url: { type: String, required: true },
    is_approve: { type: Boolean, required: true },
    is_cover: { type: Boolean, required: true },
},{
    timestamps: true
});

const  reviewDocuments = mongoose.model('review_documents', reviewDocumentsSchema);
export default reviewDocuments;
