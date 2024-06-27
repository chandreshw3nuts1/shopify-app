import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ItemRating  from './rating';
import ReviewItem  from './review-item';
import moment from 'moment';



import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  Link,
  InlineStack,
  Grid,
  List,
  LegacyCard,
  LegacyStack,
  Collapsible,
  TextContainer,
  Checkbox,
  Select
} from "@shopify/polaris";

const ProductReviewWidget = ({shopRecords, reviewItems, productsDetails,formParams}) => {
    
	return (
	  <>
        {
            formParams.page == 1 ? <div className="container">
              {formParams.productId != "" ? <div className="text-right mb-3">
                  <button className="btn btn-primary" id="show_create_review_modal" >Create Review</button>
              </div> : "" }
            
            <div className="main_review_block">
                <ReviewItem reviewItems={reviewItems} productsDetails={productsDetails} formParams = {formParams}/>
            </div>
            {formParams.hasMore == 1 ? <div className="load_more_review">
                <Link url="javascript:void(0)" id="load_more_review">Load more</Link>
            </div> : ""}
        </div> :

            <ReviewItem reviewItems={reviewItems} productsDetails={productsDetails} formParams = {formParams}/>

        }
        

	  </>
	  
	);
  
  }
  
  export default ProductReviewWidget;
