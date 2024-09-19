import { useLoaderData } from "@remix-run/react";
import { decryptData } from './../utils/common';
import shopDetails from './models/shopDetails';
import marketingEmailSubscriptions from './models/marketingEmailSubscriptions';
import generalSettings from './models/generalSettings';
import shopifySessions from './models/shopifySessions';
import React from 'react';

export const loader = async ({ params, request }) => {
    try {
        const url = new URL(request.url);
        const encryptedData = url.searchParams.get("data");
        const secretKey = process.env.SECRET_KEY;
        const { shop_id, email } = decryptData(decodeURIComponent(encryptedData), secretKey);

        const shopRecords = await shopDetails.findOne({ shop_id: shop_id });
        if (shopRecords) {

            await marketingEmailSubscriptions.updateOne(
                { shop_id: shopRecords._id, email: email },
                {
                    $set: {
                        shop_id: shopRecords._id,
                        isSubscribed: false,
                    }
                },
                { upsert: true }
            );
            const generalSettingsModel = await generalSettings.findOne({ shop_id: shopRecords._id }).select('unsubscribing_type');
            if (generalSettingsModel.unsubscribing_type == 'unsubscribe_marking_email') {
                let customerId = 0;
                const shopSessionRecords = await shopifySessions.findOne({ shop: shopRecords.shop });

                const customerApiUrl = `https://${shopRecords.shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/customers/search.json?query=email:${email}`;
                const response = await fetch(customerApiUrl, {
                    method: 'GET',
                    headers: {
                        'X-Shopify-Access-Token': shopSessionRecords.accessToken,
                    }
                });

                const customerResponse = await response.json();

                if (customerResponse.customers && customerResponse.customers.length > 0) {
                    customerId = customerResponse.customers[0].id;
                }
                if (customerId) {
                    const customerApiUrl = `https://${shopRecords.shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/customers/${customerId}.json`;
                    const response = await fetch(customerApiUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Shopify-Access-Token': shopSessionRecords.accessToken,
                        },
                        body: JSON.stringify({
                            customer: {
                                email_marketing_consent: {
                                    state: 'unsubscribed', // Change to 'unsubscribed'
                                    opt_in_level: 'single_opt_in'
                                }
                            }
                        })
                    });
                }
            }

        }
        return { shopRecords };
    } catch (error) {
    }
    return {};
};

const UnsubscribePage = () => {
    const { shopRecords } = useLoaderData();
    return (
        <>
            <style>
                {`
					* {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                        }

                        body {
                        font-family: 'Roboto', sans-serif;
                        background-color: #f4f7fc;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        color: #333;
                        }

                        .container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        }

                        .card {
                        background-color: white;
                        padding: 40px;
                        border-radius: 12px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        text-align: center;
                        max-width: 400px;
                        width: 100%;
                        }

                        .icon svg {
                        margin-bottom: 20px;
                        }

                        h1 {
                        font-size: 28px;
                        margin-bottom: 16px;
                        color: #333;
                        }

                        p {
                        font-size: 16px;
                        color: #666;
                        margin-bottom: 32px;
                        }

                        .button {
                        display: inline-block;
                        padding: 12px 24px;
                        background-color: #4CAF50;
                        color: white;
                        text-decoration: none;
                        font-size: 16px;
                        border-radius: 8px;
                        transition: background-color 0.3s ease;
                        }

                        .button:hover {
                        background-color: #45a049;
                        }

					
				`}
            </style>
            <div className="container">
                <div className="card">
                    <div className="icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
                            <path fill="#4CAF50" d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.59 7.58l-6.7 7.7c-.2.2-.46.3-.73.3h-.02a1.03 1.03 0 0 1-.71-.3l-3.3-3.3a1.02 1.02 0 1 1 1.44-1.44l2.6 2.6 6.01-6.9a1.02 1.02 0 1 1 1.5 1.38z" />
                        </svg>
                    </div>
                    <h1>Unsubscribed Successfully</h1>
                    <p>You have been successfully unsubscribed from our mailing list. We are sorry to see you go!</p>
                    <a href={`https://${shopRecords.shop}`} className="button">Go Back to Home page</a>
                </div>
            </div >

        </>
    );
};

export default UnsubscribePage;
