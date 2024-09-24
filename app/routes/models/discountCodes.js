import mongoose from 'mongoose';
if (mongoose.models['discount_codes']) {
  // Delete the existing model
  delete mongoose.models['discount_codes'];
}

const discountCodesSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    review_id: {type: mongoose.Schema.Types.ObjectId, ref: 'product_reviews', required: true },
    email: {type: String},
    code_used: {type: Boolean, default: false },
    code: {type: String},
    value_type: {type: String},
    discount_value: {type: Number},
    expire_on_date: {type: String},
    is_reminder_sent: {type: Boolean, default: false},

    
},{
    timestamps: true
});

const  discountCodes = mongoose.model('discount_codes', discountCodesSchema);
export default discountCodes;
