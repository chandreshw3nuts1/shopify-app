import mongoose from 'mongoose';
if (mongoose.models['general_appearances']) {
  // Delete the existing model
  delete mongoose.models['general_appearances'];
}

const generalAppearancesSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    logo: {type: String },
    banner: {type: String },
    enabledEmailBanner: {type : Boolean, default : true},
    starIcon: {type : String},
    cornerRadius: {type : String},
    widgetFont: {type : String},
    appBranding: {type : String, Default : "show"},
    starIconColor: {type : String},
    emailBackgroundColor: {type : String},
    contentBackgroundColor: {type : String},
    emailTextColor: {type : String},
    buttonBackgroundColor: {type : String},
    buttonBorderColor: {type : String},
    buttonTitleColor: {type : String},
    fontType: {type : String},
    fontSize: {type : String},
    emailAppearance : {type : String}
    

},{
    timestamps: true
});

const  generalAppearances = mongoose.model('general_appearances', generalAppearancesSchema);
export default generalAppearances;
