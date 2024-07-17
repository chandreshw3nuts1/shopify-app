import mongoose from 'mongoose';
if (mongoose.models['general_appearances']) {
  // Delete the existing model
  delete mongoose.models['general_appearances'];
}

const generalAppearancesSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    logo: {type: String },
    banner: {type: String },
    enabledEmailBanner: {type : Boolean, default : true}
},{
    timestamps: true
});

const  generalAppearances = mongoose.model('general_appearances', generalAppearancesSchema);
export default generalAppearances;
