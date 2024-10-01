import { json } from '@remix-run/node'; // or '@remix-run/cloudflare'
import { create } from 'xmlbuilder2';  // Ensure xmlbuilder2 is installed: npm install xmlbuilder2
import productReviews from './models/productReviews';
import shopDetails from './models/shopDetails';

// Loader function that runs when the route is accessed
export const loader = async ({ params }) => {
	const { shopId } = params;
	const shopRecords = await shopDetails.findOne({ shop_id : shopId });
	const reviews = await fetchReviewsByShopId(shopRecords._id);

	// If no reviews found, return a 404 response
	if (!reviews || reviews.length === 0) {
		throw new Response('No reviews found', { status: 404 });
	}

	// Generate XML content based on reviews
	const xmlContent = generateXML(reviews);

	// Return XML response
	return new Response(xmlContent, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
};

// Function to fetch reviews by shop_id from MongoDB
const fetchReviewsByShopId = async (shop_id) => {
	// Use your MongoDB fetching logic here
	// Example:
	const reviews = await productReviews.find({ shop_id : shop_id });
	console.log(reviews.length);
	return reviews;
};

// Function to convert reviews data into XML format
const generateXML = (reviews) => {
	const doc = create({ version: '1.0', encoding: 'UTF-8' })
		.ele('feed', {
			xmlns: 'http://www.google.com/shopping/reviews/schema/product/2.3',
			'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
			'xsi:noNamespaceSchemaLocation': 'http://www.google.com/shopping/reviews/schema/product/2.3/product_reviews.xsd'
		})
		.ele('version').txt('2.3').up();

	const reviewsElement = doc.ele('reviews');

	reviews.forEach(review => {
		const reviewElement = reviewsElement.ele('review');
		reviewElement.ele('review_id').txt(review._id);
		reviewElement.ele('reviewer').ele('name').txt(review.first_name || 'Anonymous');
		reviewElement.ele('review_timestamp').txt(new Date(review.createdAt).toISOString());
		reviewElement.ele('content').txt(review.content);
		reviewElement.ele('ratings').ele('overall').txt(review.rating);
		// Add more elements as required by Google schema
	});

	return doc.end({ prettyPrint: true });
};
