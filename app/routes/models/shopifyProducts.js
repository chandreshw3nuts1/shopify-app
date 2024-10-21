import mongoose from 'mongoose';
if (mongoose.models['shopify_products']) {
  // Delete the existing model
  delete mongoose.models['shopify_products'];
}

const shopifyProductsSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    product_id: {type: Number, required: true },
    product_title: {type: String, required: true },
    product_handle: {type: String, required: true },
    product_image: {type: String, required: true },
},{
    timestamps: true
});

const  shopifyProducts = mongoose.model('shopify_products', shopifyProductsSchema);
export default shopifyProducts;
