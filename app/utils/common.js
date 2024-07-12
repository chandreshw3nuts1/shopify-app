import { mongoConnection } from './mongoConnection';
import { GraphQLClient } from "graphql-request";
import customQuestions from './../routes/models/customQuestions';
import emailReviewRequestSettings from './../routes/models/emailReviewRequestSettings';
import settingJson from './../utils/settings.json';

export async function findOneRecord(collection = "", params = {}) {
	try {


		if (collection && params) {
			const db = await mongoConnection();

			const response = await db.collection(collection).findOne(params);
			return response;
		}

	} catch (error) {
		console.error('Error fetching findOneRecord record:', error);
	}
}

export async function getShopDetailsByShop(shop) {
	try {
		return await findOneRecord("shop_details", { "shop": shop });
	} catch (error) {
		console.error('Error fetching shop record by shop:', error);
	}
}


export async function getCustomQuestions(params = {}) {
	try {
		return await customQuestions.find(params);
	} catch (error) {
		console.error('Error fetching custom question record :', error);
	}
}



export async function getShopifyProducts(shop, productIds = [], imageSize = 60) {
	try {
		const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shop });
		const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
			headers: {
				'X-Shopify-Access-Token': shopSessionRecords.accessToken,
			},
		});

		const query = `{
			nodes(ids: [${productIds}]) {
				... on Product {
					id
					title
					handle
					description
					images(first: 1) {
						edges {
							node {
								id
								transformedSrc(maxWidth: ${imageSize}, maxHeight: ${imageSize})
							}
						}
					}
				}
			}
		} `;

		var shopifyProducts = await client.request(query);

		var mapProductDetails = [];
		if (shopifyProducts.nodes.length > 0) {
			shopifyProducts = shopifyProducts.nodes;
			shopifyProducts.forEach(node => {
				if (node) {
					mapProductDetails.push(node);
				}
			});
		}

		return mapProductDetails;


	} catch (error) {
		console.error('Error fetching custom question record :', error);
	}
}



export async function fetchAllProducts(storeName, accessToken) {
	const apiUrl = `https://${storeName}.myshopify.com/admin/api/2023-01/graphql.json`;
	const products = [];
	let hasNextPage = true;
	let cursor = null;

	while (hasNextPage) {
		const query = `
		query ($cursor: String) {
		  products(first: 250, after: $cursor) {
			edges {
			  node {
				id
				title
				images(first: 10) {
				  edges {
					node {
					  id
					  originalSrc
					  transformedSrc(maxWidth: 60, maxHeight: 60)
					}
				  }
				}
			  }
			  cursor
			}
			pageInfo {
			  hasNextPage
			}
		  }
		}
	  `;

		const variables = { cursor };
		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Access-Token': accessToken,
			},
			body: JSON.stringify({ query, variables }),
		});

		const data = await response.json();
		if (data.errors) {
			console.error('GraphQL errors:', data.errors);
			break;
		}

		const productEdges = data.data.products.edges;
		productEdges.forEach(productEdge => {

			products.push({
				id: productEdge.node.id.split('/').pop(),
				title: productEdge.node.title,
				images: productEdge.node.images.edges.map(imageEdge => ({
					id: imageEdge.node.id,
					originalSrc: imageEdge.node.originalSrc,
					transformedSrc: imageEdge.node.transformedSrc,
				})),
			});
		});

		hasNextPage = data.data.products.pageInfo.hasNextPage;
		if (hasNextPage) {
			cursor = productEdges[productEdges.length - 1].cursor;
		}
	}

	return products;
}



export async function getLanguageWiseContents(type, replaceVars, shop_id, locale = 'en') {
	const emailReviewRequestSettingsModel = await emailReviewRequestSettings.findOne({ shop_id: shop_id });
	const emailReviewRequestSettingJsonData = emailReviewRequestSettingsModel[locale] ? emailReviewRequestSettingsModel[locale] : {};

	const transalationFile = `${settingJson.host_url}/locales/${locale}/translation.json`;
	const responseFile = await fetch(transalationFile);
	const transalationContent = await responseFile.json();
	const transalationReviewRequest = transalationContent.reviewRequestEmail;

	const emailContents = await replaceEmailReviewRequest(replaceVars, emailReviewRequestSettingJsonData, transalationReviewRequest);
	return emailContents;

}

export async function replaceEmailReviewRequest(replaceVars, emailReviewRequestSettingJsonData, transalationReviewRequest) {

	console.log(replaceVars);
	console.log(emailReviewRequestSettingJsonData);
	console.log(transalationReviewRequest);
	var subject = replacePlaceholders(emailReviewRequestSettingJsonData.subject && emailReviewRequestSettingJsonData.subject !== ""
		? emailReviewRequestSettingJsonData.subject
		: transalationReviewRequest.subject, replaceVars);

	var body = replacePlaceholders(emailReviewRequestSettingJsonData.body && emailReviewRequestSettingJsonData.body !== ""
		? emailReviewRequestSettingJsonData.body
		: transalationReviewRequest.body, replaceVars);

	var buttonText = emailReviewRequestSettingJsonData.buttonText && emailReviewRequestSettingJsonData.buttonText !== ""
		? emailReviewRequestSettingJsonData.buttonText
		: transalationReviewRequest.buttonText;

	return { subject, body, buttonText };
}

function replacePlaceholders(text, replaceVars) {
	text = text.replace(/\[name\]/g, replaceVars.name || '');
	text = text.replace(/\[order_number\]/g, replaceVars.order_number || '');
	text = text.replace(/\[last_name\]/g, replaceVars.last_name || '');

	return text;
}
