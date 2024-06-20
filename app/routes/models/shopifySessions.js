import mongoose from 'mongoose';
if (mongoose.models['shopify_sessions']) {
  // Delete the existing model
  delete mongoose.models['shopify_sessions'];
}

const shopifySessionsSchema = new mongoose.Schema({

    shop_id: {type: String, required: true },
    shop: {type: String, required: true },
    accessToken: { type: String, required: true },
    country_name: { type: String, required: true },
    email: { type: String, required: true },
    currency: { type: String, required: true },
    timezone: { type: String , required: true },
    shop_owner: { type: String,required: true  },
    name: { type: String, required: true },
},{
    timestamps: true
});

const  shopifySessions = mongoose.model('shopify_sessions', shopifySessionsSchema);
export default shopifySessions;
