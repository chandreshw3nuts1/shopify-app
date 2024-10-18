import mongoose from 'mongoose';
if (mongoose.models['product_groups']) {
  // Delete the existing model
  delete mongoose.models['product_groups'];
}

const productGroupsSchema = new mongoose.Schema({
    
    shop_id: {type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
    product_ids: {type: Array },
    group_name: {type: String }
},{
    timestamps: true
});

const  productGroups = mongoose.model('product_groups', productGroupsSchema);
export default productGroups;
