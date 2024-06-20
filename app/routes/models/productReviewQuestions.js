import mongoose from 'mongoose';
if (mongoose.models['product_review_questions']) {
  // Delete the existing model
  delete mongoose.models['product_review_questions'];
}


const productReviewQuestionsSchema = new mongoose.Schema({
    review_id: {type: mongoose.Schema.Types.ObjectId, ref: 'product_reviews', required: true },
    question_id: {type: mongoose.Schema.Types.ObjectId, ref: 'custom_questions', required: true },
    answer: { type: String, required: true },
    question_name: { type: String, required: true },
    deletedAt: { type: Date, default: null }
},{
    timestamps: true
});

const  productReviewQuestions = mongoose.model('product_review_questions', productReviewQuestionsSchema);
export default productReviewQuestions;
