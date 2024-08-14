import mongoose from 'mongoose';
if (mongoose.models['general_settings']) {
  // Delete the existing model
  delete mongoose.models['general_settings'];
}

const generalSettingsSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    defaul_language: {type: String, default : "en" },
    multilingual_support: {type: Boolean, default : true },
    reply_email: {type: String, default : "" },
    email_footer_enabled : {type : Boolean , default : false},
    en: { "type": "Object" },
    fr: { "type": "Object" },
    es: { "type": "Object" },
    it: { "type": "Object" },
    de: { "type": "Object" },
    nl: { "type": "Object" },
    pt: { "type": "Object" },
    tr: { "type": "Object" },
    ru: { "type": "Object" },
    ja: { "type": "Object" },
    cn1: { "type": "Object" },
    cn2: { "type": "Object" },
    sv: { "type": "Object" },
    da: { "type": "Object" },
    no: { "type": "Object" },
    fi: { "type": "Object" },
    ko: { "type": "Object" },
    he: { "type": "Object" },
    ar: { "type": "Object" },
    pl: { "type": "Object" },
    lt: { "type": "Object" },
},{
    timestamps: true
});

const  generalSettings = mongoose.model('general_settings', generalSettingsSchema);
export default generalSettings;
