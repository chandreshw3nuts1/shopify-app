import mongoose from 'mongoose';
if (mongoose.models['product_review_widget_customizes']) {
    // Delete the existing model
    delete mongoose.models['product_review_widget_customizes'];
}

const productReviewWidgetCustomizesSchema = new mongoose.Schema({
    shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    widgetLayout: { type: String },
    widgetColor: { type: String },
    headerTextColor: { type: String },
    buttonBorderColor: { type: String },
    buttonTitleColor: { type: String },
    buttonBackgroundOnHover: { type: String },
    buttonTextOnHover: { type: String },
    buttonBackground: { type: String },
    reviewsText: { type: String },
    reviewsBackground: { type: String },
    reviewsBackgroundOnHover: { type: String },
    replyText: { type: String },
    replyBackground: { type: String },
    replyBackgroundOnHover: { type: String },
    verifiedBadgeBackgroundColor: { type: String },
    starsBarFill: { type: String },
    starsBarBackground: { type: String },
    reviewShadow: { type: String },
    cornerRadius: { type: String },
    headerLayout: { type: String },
    productReviewsWidget: { type: String },
    writeReviewButton: { type: String },
    itemType: { type: String },
    reviewDates: { type: String },
    defaultSorting: { type: String },
    showSortingOptions: { type: Boolean },
    showRatingsDistribution: { type: Boolean },

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
