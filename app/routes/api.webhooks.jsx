import { json } from "@remix-run/node";
import { GraphQLClient } from 'graphql-request';
import crypto from 'crypto';

export async function loader() {
  return json({
        name:"dsads"
    });
  }

  export async function action({ request }) {
    console.log('============= action app uninstall');
    const hmacHeader = request.headers.get('X-Shopify-Hmac-Sha256');
    const rawBody = await request.text();
    const generatedHmac = crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
      .update(rawBody, 'utf8')
      .digest('base64');
    if (generatedHmac !== hmacHeader) {
      return new Response('Unauthorized', { status: 401 });
    }
    const body = JSON.parse(rawBody);
    const shop = body.myshopify_domain;
  
    console.log(`App uninstalled from shop: ${shop}`);
    console.log(body);
    console.log(`App uninstalled from shop: ${shop}`);

  // Perform your clean-up tasks here, such as:
  // - notify to admin
  // - Revoking access tokens
  // - Canceling subscriptions
  // maintain log history
  return json({ message: 'Webhook received' });
  }
  