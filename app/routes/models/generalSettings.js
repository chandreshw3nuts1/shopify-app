import mongoose from 'mongoose';
if (mongoose.models['general_settings']) {
  // Delete the existing model
  delete mongoose.models['general_settings'];
}

const generalSettingsSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    defaul_language: {type: String, default : "en" },
    multilingual_support: {type: Boolean, default : true },
},{
    timestamps: true
});

const  generalSettings = mongoose.model('general_settings', generalSettingsSchema);
export default generalSettings;
