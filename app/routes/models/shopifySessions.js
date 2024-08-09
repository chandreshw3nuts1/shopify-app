import mongoose from 'mongoose';
if (mongoose.models['shopify_sessions']) {
  // Delete the existing model
  delete mongoose.models['shopify_sessions'];
}

const shopifySessionsSchema = new mongoose.Schema({

    id: {type: String, required: true },
    shop: {type: String, required: true },
    accessToken: { type: String, required: true },
    state: { type: String, required: true },
    isOnline: { type: Boolean, required: true },
    scope: { type: String, required: true },
},{
    timestamps: true
});

const  shopifySessions = mongoose.model('shopify_sessions', shopifySessionsSchema);
export default shopifySessions;
