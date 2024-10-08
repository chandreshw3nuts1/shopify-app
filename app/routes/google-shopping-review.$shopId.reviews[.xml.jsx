import { json } from '@remix-run/node'; // or '@remix-run/cloudflare'
import { create } from 'xmlbuilder2';  // Ensure xmlbuilder2 is installed: npm install xmlbuilder2
import productReviews from './models/productReviews';
import shopDetails from './models/shopDetails';
import settingsJson from './../utils/settings.json';
import { getShopifyProducts } from './../utils/common';

export const loader = async ({ params }) => {
	const { shopId } = params;
	const shopRecords = await shopDetails.findOne({ shop_id: shopId });
	if (!shopRecords) {
		throw new Response('Shop not found', { status: 404 });
	}
	const reviews = await fetchReviewsByShopId(shopRecords._id);
	const uniqueProductIds = reviews.map(review => review.product_id);

	const productIds = uniqueProductIds.map((item) => `"gid://shopify/Product/${item}"`);
	var mapProductDetails = await getShopifyProducts(shopRecords.myshopify_domain, productIds);
	// return mapProductDetails;
	// Generate XML content based on reviews or an empty template if no reviews are found
	const xmlContent = reviews && reviews.length > 0 ? generateXML(reviews, shopRecords) : generateEmptyXML(shopRecords);

	// Return XML response
	return new Response(xmlContent, {
		headers: {
			'Content-Type': 'application/xml',
		},
	});
};

// Function to fetch reviews by shop_id from MongoDB
const fetchReviewsByShopId = async (shop_id) => {
	const reviews = await productReviews.find({ shop_id: shop_id }).limit(50);
	;
	return reviews;
};

// Function to convert reviews data into XML format
const generateXML = (reviews, shopRecords) => {
	const doc = create({ version: '1.0', encoding: 'UTF-8' })
		.ele('feed', {
			'xmlns:vc': 'http://www.w3.org/2007/XMLSchema-versioning',
			'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
			'xsi:noNamespaceSchemaLocation': 'http://www.google.com/shopping/reviews/schema/product/2.3/product_reviews.xsd'
		})
		.ele('version').txt('2.3').up()
		.ele('aggregator')
			.ele('name').txt(settingsJson.app_name).up()
		.ele('publisher')
			.ele('name').txt(shopRecords.name).up()
		.up();

	const reviewsElement = doc.ele('reviews');

	reviews.forEach(review => {
		const productUrl = `https://${shopRecords.shop}/products/${review.product_url}`;
		
		const reviewElement = reviewsElement.ele('review');
		reviewElement.ele('review_id').txt(review._id);
		reviewElement.ele('reviewer')
			.ele('name').txt(`${review.first_name} ${review.last_name}` + ' '  || 'Anonymous').up()
		.up();
		reviewElement.ele('review_timestamp').txt(new Date(review.createdAt).toISOString());
		reviewElement.ele('content').txt(review.description);
		reviewElement.ele('review_url', { type: 'singleton' }).txt(productUrl);
		reviewElement.ele('ratings').ele('overall', { min: '1', max: '5' }).txt(review.rating);
		
		// Add product details
		const productElement = reviewElement.ele('products').ele('product');
		const productIdsElement = productElement.ele('product_ids');

		productIdsElement.ele('gtin').txt("7351730045005");
		productIdsElement.ele('mpn').txt("80351730045005");
		productIdsElement.ele('sku').txt("sku-009");


		productElement.ele('product_url').txt(productUrl);

		
	});

	return doc.end({ prettyPrint: true });
};

// Function to generate an empty XML structure
const generateEmptyXML = (shopRecords) => {
	const doc = create({ version: '1.0', encoding: 'UTF-8' })
		.ele('feed', {
			'xmlns:vc': 'http://www.w3.org/2007/XMLSchema-versioning',
			'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
			'xsi:noNamespaceSchemaLocation': 'http://www.google.com/shopping/reviews/schema/product/2.3/product_reviews.xsd'
		})
		.ele('version').txt('2.3').up()
		.ele('aggregator')
			.ele('name').txt(settingsJson.app_name).up()
		.ele('publisher')
			.ele('name').txt(shopRecords.name).up()
		.up()
		.ele('reviews'); // Empty reviews element

	return doc.end({ prettyPrint: true });
};
