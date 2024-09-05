import mongoose from 'mongoose';
if (mongoose.models['floating_widget_customizes']) {
    // Delete the existing model
    delete mongoose.models['floating_widget_customizes'];
}

const floatingWidgetCustomizesSchema = new mongoose.Schema({
    shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    title: { type: String},
    backgroundColor: { type: String },
    textColor: { type: String },
    showProductThumb: { type: Boolean, default : true}
}, {
    timestamps: true
});

const floatingWidgetCustomizes = mongoose.model('floating_widget_customizes', floatingWidgetCustomizesSchema);
export default floatingWidgetCustomizes;
