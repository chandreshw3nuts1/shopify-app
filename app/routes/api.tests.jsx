import { json } from "@remix-run/node";
import { GraphQLClient } from 'graphql-request';

export async function loader() {
    
  // const response =  await fetch('https://chandstest.myshopify.com/admin/api/2023-10/themes.json', {
  //   method: 'GET',
  //   headers: {
  //   'Content-Type': 'application/json',
  //   'X-Shopify-Access-Token' : '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'
  //   },
  // });

  // const responseBody = await response.json();
  //return responseBody;
  const REST_ENDPOINT = `https://chandstest.myshopify.com/admin/api/2023-01/webhooks.json`;

  const response =  await fetch(REST_ENDPOINT, {
    method: 'GET',
    headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token' : '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'
    },
  });

  // "gid://shopify/Theme/141201670382"
  const responseBody = await response.json();
  return responseBody;



  return json({
        name:"dsads"
    });
  }

  export async function action({ request }) {
    const method = request.method;

    switch(method){
        case "POST":

      //   const shopifyDomain = 'chandstest.myshopify.com';
      //   const apiKey = process.env.SHOPIFY_API_KEY;
      //   const password = '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';
      //   const productIds = ['123456789', '987654321']; // Example product IDs
      //   const queryParams = `ids=${productIds.join(',')}`;
      //   const apiUrl = `https://${apiKey}:${password}@${shopifyDomain}/admin/api/2023-10/products.json?${queryParams}`;
      // return json(apiUrl);



        const client = new GraphQLClient(`https://chandstest.myshopify.com/admin/api/2023-01/graphql.json`, {
          headers: {
            'X-Shopify-Access-Token': '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',
          },
        });
 
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
      const data = await client.request(query);
      
      return json(data.nodes[1]);

      
      
        return json({"message" : "hello", "method" : "POST"});
        case "PATCH":

          
          
            
        default:

        return json({"message" : "hello", "method" : "POST"});

    }
  }
  