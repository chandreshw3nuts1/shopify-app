import { json } from "@remix-run/node";
import { GraphQLClient } from 'graphql-request';
import ReactDOMServer from 'react-dom/server';
import ProductReviewWidget from './components/widget-components/product-review-widget';
import CreateReviewModalWidget from './components/widget-components/create-review-modal-widget';
import { getShopDetailsByShop } from './../utils/common';
import { mongoConnection } from './../utils/mongoConnection';

    export async function loader() {

        return json({
            title:"hii there",
            body:"hii bodybodybodybodybody"
        });
    }

    export async function action({ request }) {
        
        try{
            const formData = await request.formData();

            
            const shop = formData.get('shop_domain');
            
            const shopRecords =await getShopDetailsByShop(shop);
            const db = await mongoConnection();
            const reviewItems =  await db.collection('product-reviews').find({"shop_id" : shopRecords._id}).toArray();;
            const client = new GraphQLClient(`https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`, {
                headers: {
                    'X-Shopify-Access-Token': shopRecords.accessToken,
                },
            });
            let  productsDetails = [];
            if (reviewItems.length > 0) {
                
                const productIds = reviewItems.map((item) =>  `"gid://shopify/Product/${item.product_id}"`);
               
                const query = `{
                    nodes(ids: [${productIds}]) {
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
                } `;
                productsDetails = await client.request(query);
                if(productsDetails.nodes.length > 0) {
                    productsDetails = productsDetails.nodes;
                }
                //console.log(productsDetails.products.edges[0].node.images.edges[0].node.transformedSrc);
    
            }
           
      

            const dynamicComponent = <ProductReviewWidget shopRecords={shopRecords} reviewItems={reviewItems} productsDetails={productsDetails} />;
            const htmlContent = ReactDOMServer.renderToString(dynamicComponent);
            
            const dynamicModalComponent = <CreateReviewModalWidget shopRecords={shopRecords} />;
            const htmlModalContent = ReactDOMServer.renderToString(dynamicModalComponent);
            
            return json({
                title:"hii there",
                body:htmlContent,
                htmlModalContent :htmlModalContent
            });
        } catch(error){
            console.log(error);
            
        }

    }
  