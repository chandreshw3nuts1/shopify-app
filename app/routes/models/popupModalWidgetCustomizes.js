import mongoose from 'mongoose';
if (mongoose.models['popup_modal_widget_customizes']) {
    // Delete the existing model
    delete mongoose.models['popup_modal_widget_customizes'];
}

const popupModalWidgetCustomizesSchema = new mongoose.Schema({
    shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    isActive: { type: Boolean, default: false },
    widgetPosition: { type: String, default: "bottom_left" },
    cornerRadius: { type: String, default: "4" },
    minimumRatingDisplay: { type: String, default: "all" },
    initialDelay: { type: String, default: "5" },
    delayBetweenPopups: { type: String, default: "5" },
    popupDisplayTime: { type: String, default: "5" },
    maximumPerPage: { type: String, default: "20" },
    showProductThumb: { type: Boolean, default: true },
    hideOnMobile: { type: Boolean, default: false },
    isHomePage: { type: Boolean, default: true },
    isProductPage: { type: Boolean, default: true },
    isCartPage: { type: Boolean, default: true },
    isOtherPages: { type: Boolean, default: true },
}, {
    timestamps: true
});

const popupModalWidgetCustomizes = mongoose.model('popup_modal_widget_customizes', popupModalWidgetCustomizesSchema);
export default popupModalWidgetCustomizes;
