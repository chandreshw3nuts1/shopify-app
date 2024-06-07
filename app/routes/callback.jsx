import axios from "axios";
import {  redirect } from "@remix-run/node";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const shop = url.searchParams.get("shop");
  const state = url.searchParams.get("state");
  if (!code || !shop || !state) {
    throw new Error("Missing parameters");
  }

  try {

    const response = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }
    );
    return response.data.access_token;

  } catch (error) {
    console.error("Error exchanging code for access token:", error);
    throw new Error("Failed to authenticate with Shopify");
  }
};
 