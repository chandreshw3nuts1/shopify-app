import mongoose from 'mongoose';
if (mongoose.models['settings']) {
  // Delete the existing model
  delete mongoose.models['settings'];
}

const settingsSchema = new mongoose.Schema({
    autoPublishReview: { type: Boolean,  },
    reviewPublishMode: { type: String },
    shop_id: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('settings', settingsSchema);;
