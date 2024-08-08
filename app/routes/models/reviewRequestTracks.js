import mongoose from 'mongoose';
if (mongoose.models['review_request_tracks']) {
	// Delete the existing model
	delete mongoose.models['review_request_tracks'];
}

const reviewRequestTracksSchema = new mongoose.Schema({

	shop_id: { type: mongoose.Schema.Types.ObjectId, ref: 'shop_details', required: true },
}, {
	timestamps: true
});

const reviewRequestTracks = mongoose.model('review_request_tracks', reviewRequestTracksSchema);
export default reviewRequestTracks;
