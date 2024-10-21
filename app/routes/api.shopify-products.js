import { json } from '@remix-run/node';
import { getAllShopifyProducts } from "./../utils/common";

export const action = async ({ request }) => {
	const requestBody = await request.json();

	if (requestBody.actionType == "customProducts") {
		if (!requestBody?.shopId) {
			return json({ error: 'Missing shop details' }, { status: 400 });
		}

		try {
			var products = await getAllShopifyProducts(requestBody.shopId, [] , requestBody.searchTitle);

			return json(products);
		} catch (error) {
			console.error(error);
			return json({ error: 'Failed to fetch products' }, { status: 500 });
		}


	} else {

		const storeName = requestBody.storeName;
		const accessToken = requestBody.accessToken;
		const searchTitle = requestBody.searchTitle;

		if (!storeName || !accessToken) {
			return json({ error: 'Missing storeName or accessToken' }, { status: 400 });
		}

		try {
			const products = await fetchAllProducts(storeName, accessToken, searchTitle);
			return json(products);
		} catch (error) {
			console.error(error);
			return json({ error: 'Failed to fetch products' }, { status: 500 });
		}
	}

};

async function fetchAllProducts(storeName, accessToken, searchTitle) {

	const apiUrl = `https://${storeName}/admin/api/2023-01/graphql.json`;
	const products = [];
	let hasNextPage = true;
	let cursor = null;

	while (hasNextPage) {
		const query = `
		query ($cursor: String, $query: String) {
          products(first: 50, after: $cursor, query: $query) {
			edges {
			  node {
				id
				title
				handle
				status
				images(first: 10) {
				  edges {
					node {
					  id
					  originalSrc
					  transformedSrc(maxWidth: 200, maxHeight: 200)
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
		const variables = {
			cursor,
			query: searchTitle ? `title:*${searchTitle}*` : null,
		};
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
				handle: productEdge.node.handle,
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
