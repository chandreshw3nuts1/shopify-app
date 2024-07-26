import mongoose from 'mongoose';
if (mongoose.models['shop_details']) {
  // Delete the existing model
  delete mongoose.models['shop_details'];
}

const shopDetailsSchema = new mongoose.Schema({

    shop_id: {type: String, required: true },
    shop: {type: String, required: true },
    country_name: { type: String, required: true },
    email: { type: String, required: true },
    currency: { type: String, required: true },
    currency_symbol: { type: String, required: true },
    timezone: { type: String , required: true },
    shop_owner: { type: String,required: true  },
    name: { type: String, required: true },
},{
    timestamps: true
});

const  shopDetails = mongoose.model('shop_details', shopDetailsSchema);
export default shopDetails;
