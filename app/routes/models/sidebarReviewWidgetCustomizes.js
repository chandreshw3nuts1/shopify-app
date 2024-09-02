import mongoose from 'mongoose';
if (mongoose.models['sidebar_review_widget_customizes']) {
    // Delete the existing model
    delete mongoose.models['sidebar_review_widget_customizes'];
}

const sidebarReviewWidgetCustomizesSchema = new mongoose.Schema({
    shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    isActive: { type: Boolean, default :false},
    widgetPosition: { type: String },
    widgetOrientation: { type: String },
    buttonText: { type: String },
    buttonBackgroundColor: { type: String },
    buttonTextColor: { type: String },
    hideOnMobile: { type: Boolean, default :false},
    isHomePage: { type: Boolean, default :true},
    isProductPage: { type: Boolean, default :true},
    isCartPage: { type: Boolean, default :true},
    isOtherPages: { type: Boolean, default :true},
}, {
    timestamps: true
});

const sidebarReviewWidgetCustomizes = mongoose.model('sidebar_review_widget_customizes', sidebarReviewWidgetCustomizesSchema);
export default sidebarReviewWidgetCustomizes;
