import mongoose from 'mongoose';
if (mongoose.models['discount_codes']) {
  // Delete the existing model
  delete mongoose.models['discount_codes'];
}

const discountCodesSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    code: {type: String},
},{
    timestamps: true
});

const  discountCodes = mongoose.model('discount_codes', discountCodesSchema);
export default discountCodes;
