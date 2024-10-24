import { json } from "@remix-run/node";
import { GraphQLClient } from 'graphql-request';
import settings from './models/settings';

export async function loader() {


	const client = new GraphQLClient(`https://chandstest.myshopify.com/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
		headers: {
			'X-Shopify-Access-Token': '',
		},
	});
	const graphqlQuery = `
{
  shop {
    name
    id
    locations(first: 10) {
      edges {
        node {
          id
          isPrimary
          name
        }
      }
    }
    myshopifyDomain
	ianaTimezone
    primaryDomain {
      host
      localization {
        alternateLocales
        country
        defaultLocale
      }
    }
    timezoneOffset
    email
    currencyCode
    domains {
      localization {
        country
      }
     
      url
    }
  }
}

  `;

	const response = await client.request(graphqlQuery);
	return response;


	if (0) {


		const orderId = "5860380246254";

		const REST_ENDPOINT = `https://chandstest.myshopify.com/admin/api/2024-04/graphql.json`;

			const query = `
				query  {
					order(id: "gid://shopify/Order/5860308222190") {
						id,
						customer {
							id,
							last_Name
							}
					}
				}
		  `;

		const response = await fetch(REST_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Access-Token': "",
			},
			body: JSON.stringify({ query }),
		});

		const responseBody = await response.json();
		return responseBody;


			

		// const REST_ENDPOINT = `https://chandstest.myshopify.com/admin/api/2024-04/orders/${orderId}.json`;

		// const response = await fetch(REST_ENDPOINT, {
		// 	method: 'GET',
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 		'X-Shopify-Access-Token': "",
		// 	},
		// 	// body: JSON.stringify({ query }),
		// });

		// const responseBody = await response.json();
		// return responseBody;
	}


	if (0) {

		const customerId = "7656714502382";
		const REST_ENDPOINT = `https://chandstest.myshopify.com/admin/api/2023-07/customers/${customerId}.json`;



		const apiUrl = `https://chandstest.myshopify.com/admin/api/2023-07/graphql.json`;

		const query = `
			query {
				customer(id: "gid://shopify/Customer/7547239694574") {
					id
					firstName
					lastName
				}
				}

	  `;

		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Access-Token': "",
			},
			body: JSON.stringify({ query }),
		});

		const responseBody = await response.json();
		return responseBody;
	}


	if (1) {

		const REST_ENDPOINT = `https://testchandsstore.myshopify.com/admin/api/2024-04/webhooks.json`;

		const response = await fetch(REST_ENDPOINT, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Access-Token': ''
			},
		});

		// "gid://shopify/Theme/141201670382"
		const responseBody = await response.json();
		return responseBody;
	}


	if (0) {

		const shop = 'chandstest.myshopify.com';
		const accessToken = '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';
		const responses = await fetch(`https://${shop}/admin/api/2023-01/sections.json`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'X-Shopify-Access-Token':'' 
			},
			body: JSON.stringify({
				section: {
					name: "w3-dynamic-section",
					settings: {
						heading: "Customer Reviews",
						text: "Here are some reviews from our customers."
					}
				}
			})
		});
		return responses.json();
		const newres = await responses.json();
		return newres;

	}



	return json({
		name: "dsads"
	});
}

export async function action({ request }) {
	const method = request.method;

	switch (method) {
		case "POST":
			const queryd = { shop_id: '6646e8ead0850811abf77da4' };
			const update = {
				$set: {
					reviewNotification: false,
				}
			};

			const options = {
				new: true,
				upsert: true,
			};
			const settingsRes = await settings.findOneAndUpdate(queryd, update, options);
			return settingsRes;
			return 1;
			//   const shopifyDomain = 'chandstest.myshopify.com';
			//   const apiKey = process.env.SHOPIFY_API_KEY;
			//   const password = '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';
			//   const productIds = ['123456789', '987654321']; // Example product IDs
			//   const queryParams = `ids=${productIds.join(',')}`;
			//   const apiUrl = `https://${apiKey}:${password}@${shopifyDomain}/admin/api/2023-10/products.json?${queryParams}`;
			// return json(apiUrl);



			const client = new GraphQLClient(`https://chandstest.myshopify.com/admin/api/2023-01/graphql.json`, {
				headers: {
					'X-Shopify-Access-Token': '',
				},
			});
			const query1 = `
{
  productByHandle(handle: "long-t") {
    id
    title
    descriptionHtml
    handle
    images(first: 5) {
      edges {
        node {
          src
          altText
        }
      }
    }
    variants(first: 5) {
      edges {
        node {
          id
          title
          price
        }
      }
    }
  }
}`;
			const query = `{
          nodes(ids: ["gid://shopify/Product/8461148881134", "gid://shopify/Product/8461148520686"]) {
              ... on Product {
              id
              title
              description
              images(first: 1) {
                  edges {
                      node {
                          id
                          transformedSrc(maxWidth: 100, maxHeight: 100)
                      }
                  }
              }
          }
        }
      }
  `;
			const data = await client.request(query1);

			return json(data);



			return json({ "message": "hello", "method": "POST" });
		case "PATCH":




		default:

			return json({ "message": "hello", "method": "POST" });

	}
}
