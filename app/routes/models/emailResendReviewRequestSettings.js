import mongoose from 'mongoose';
if (mongoose.models['email_resend_review_request_settings']) {
  // Delete the existing model
  delete mongoose.models['email_resend_review_request_settings'];
}

const emailResendReviewRequestSettingsSchema = new mongoose.Schema({

  shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
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
}, {
  timestamps: true
});

const emailResendReviewRequestSettings = mongoose.model('email_resend_review_request_settings', emailResendReviewRequestSettingsSchema);
export default emailResendReviewRequestSettings;