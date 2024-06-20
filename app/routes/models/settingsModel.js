import mongoose from 'mongoose';
if (mongoose.models['settings']) {
  // Delete the existing model
  delete mongoose.models['settings'];
}

const settingsSchema = new mongoose.Schema({
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    autoPublishReview: { type: Boolean },
    reviewPublishMode: { type: String },
    reviewNotification: { type: Boolean },
    addOnsiteReview: { type: Boolean },
    
},{
  timestamps: true
});


const  settings = mongoose.model('settings', settingsSchema);
export default settings;