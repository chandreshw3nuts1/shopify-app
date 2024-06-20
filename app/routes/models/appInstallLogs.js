import mongoose from 'mongoose';
if (mongoose.models['app_install_logs']) {
  // Delete the existing model
  delete mongoose.models['app_install_logs'];
}

const appInstallLogsSchema = new mongoose.Schema({
    
    shop_id: {type: String, required: true },
    shop: {type: String, required: true },
    event_type: {type: String, required: true },
    email: { type: String, required: true },
    shop_owner: { type: String,required: true  },
    name: { type: String, required: true },
},{
    timestamps: true
});

const  appInstallLogs = mongoose.model('app_install_logs', appInstallLogsSchema);
export default appInstallLogs;
