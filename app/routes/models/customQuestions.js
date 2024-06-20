import mongoose from 'mongoose';
if (mongoose.models['custom_questions']) {
  // Delete the existing model
  delete mongoose.models['custom_questions'];
}

const answerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    val: { type: String, required: true }
});

const customQuestionsSchema = new mongoose.Schema({
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    question: { type: String, required: true },
    answers: [answerSchema],
    isHideAnswers: { type: Boolean, required: false },
    isMakeRequireQuestion: { type: Boolean, required: false },

},{
    timestamps: true
});

const  customQuestions = mongoose.model('custom_questions', customQuestionsSchema);
export default customQuestions;
