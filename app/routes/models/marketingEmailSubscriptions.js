import mongoose from 'mongoose';
if (mongoose.models['marketing_email_subscriptions']) {
  // Delete the existing model
  delete mongoose.models['marketing_email_subscriptions'];
}

const marketingEmailSubscriptionsSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    email: {type: String, required: true },
    isSubscribed: {type: Boolean },
    isEmailConcent: {type: Boolean }
},{
    timestamps: true
});

const  marketingEmailSubscriptions = mongoose.model('marketing_email_subscriptions', marketingEmailSubscriptionsSchema);
export default marketingEmailSubscriptions;
