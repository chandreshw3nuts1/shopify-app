import mongoose from 'mongoose';
if (mongoose.models['product_review_widget_customizes']) {
    // Delete the existing model
    delete mongoose.models['product_review_widget_customizes'];
}

const productReviewWidgetCustomizesSchema = new mongoose.Schema({
    shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    headerTextColor: { type: String },
    buttonBorderColor: { type: String },
    buttonTitleColor: { type: String },
    en: { "type": "Object" },
    fr: { "type": "Object" },
    es: { "type": "Object" },
    it: { "type": "Object" },
    de: { "type": "Object" },
    nl: { "type": "Object" },
    pt: { "type": "Object" },
    tr: { "type": "Object" },
    ru: { "type": "Object" },
    js: { "type": "Object" },
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

}, {
    timestamps: true
});

const productReviewWidgetCustomizes = mongoose.model('product_review_widget_customizes', productReviewWidgetCustomizesSchema);
export default productReviewWidgetCustomizes;
