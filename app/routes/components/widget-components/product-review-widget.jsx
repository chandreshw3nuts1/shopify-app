import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ItemRating  from './rating';
import ReviewItem  from './review-item';
import moment from 'moment';
import StarBigIcon from "../icons/StarBigIcon";
import ArrowDownIcon from '../icons/ArrowDownIcon';
import FullStarGrIcon from "../icons/FullStarGrIcon";
import FilterIcon from "../icons/FilterIcon";
import AllStarBigIcon from "../icons/AllStarBigIcon";

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

const ProductReviewWidget = ({shopRecords, reviewItems ,formParams}) => {
  
  console.log(reviewItems.length);
  return (
	  <>
      <div className="review_widget_main">
        {
            formParams.page == 1 ? <div className="container">
              {formParams.productId != "" ? 
              <div className="review_top_actions">
                <div className="left_actions flxfix">
                  <div className="section_title">Customer Reviews</div>
                  <div className="star-rating">
                    <div class="dropdown">
                      <button class="dropdown-toggle starbtn" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <div class={`ratingstars flxrow star-4`}>
                          <StarBigIcon className="ratingstar" />
                          <StarBigIcon className="ratingstar" />
                          <StarBigIcon className="ratingstar" />
                          <StarBigIcon className="ratingstar" />
                          <StarBigIcon className="ratingstar" />
                        </div>
                        <div className='ratingcount'>0 out of <span>5</span></div>
                        <div className="arrowright">
                          <ArrowDownIcon/>
                        </div>
                      </button>
                      <ul class="dropdown-menu">
                        <div className="stardetaildd">
                          <div className="stardetailrow flxrow">
                            <div className="sratnumber">5</div>
                            <div className="starsicons flxrow star-5"><AllStarBigIcon /></div>
                            <div className="processbar"><div className="activebar" style={{width:"66.66%"}}></div></div>
                            <div className="reviewgiven">(2)</div>
                          </div>
                          <div className="stardetailrow flxrow">
                            <div className="sratnumber">4</div>
                            <div className="starsicons flxrow star-4"><AllStarBigIcon /></div>
                            <div className="processbar"><div className="activebar"></div></div>
                            <div className="reviewgiven">(0)</div>
                          </div>
                          <div className="stardetailrow flxrow">
                            <div className="sratnumber">3</div>
                            <div className="starsicons flxrow star-3"><AllStarBigIcon /></div>
                            <div className="processbar"><div className="activebar"></div></div>
                            <div className="reviewgiven">(0)</div>
                          </div>
                          <div className="stardetailrow flxrow">
                            <div className="sratnumber">2</div>
                            <div className="starsicons flxrow star-2"><AllStarBigIcon /></div>
                            <div className="processbar"><div className="activebar"></div></div>
                            <div className="reviewgiven">(0)</div>
                          </div>
                          <div className="stardetailrow flxrow">
                            <div className="sratnumber">1</div>
                            <div className="starsicons flxrow star-1"><AllStarBigIcon /></div>
                            <div className="processbar"><div className="activebar" style={{width:"33.33%"}}></div></div>
                            <div className="reviewgiven">(1)</div>
                          </div>
                        </div>
                      </ul>
                    </div>
                  </div>
                  <div className="totalreviewcount">
                    <span>28,712</span> global ratings
                  </div>
                </div>
                <div className="right_actions btnwrap flxflexi flxrow justify-content-end">
                  <div className="dropdown dropdown-center">
                    <button class="dropdown-toggle revbtn lightbtn wbigbtn noafter" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <FullStarGrIcon />
                      05
                      <div className="arrowright">
                        <ArrowDownIcon/>
                      </div>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li><a class="dropdown-item" href="#">01</a></li>
                      <li><a class="dropdown-item" href="#">02</a></li>
                      <li><a class="dropdown-item" href="#">03</a></li>
                      <li><a class="dropdown-item" href="#">04</a></li>
                      <li><a class="dropdown-item" href="#">05</a></li>
                    </ul>
                  </div>
                  <div className="dropdown">
                    <button class="dropdown-toggle revbtn lightbtn wbigbtn noafter" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <FilterIcon/>
                      Sort By
                      <div className="arrowright">
                        <ArrowDownIcon/>
                      </div>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li><a class="dropdown-item" href="#">Action</a></li>
                      <li><a class="dropdown-item" href="#">Another action</a></li>
                      <li><a class="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                  </div>
                  <button className="revbtn wbigbtn" id="show_create_review_modal" >Create Review</button>
                </div>
              </div> : "" }
            
            <div className="main_review_block">
                <ReviewItem reviewItems={reviewItems} formParams = {formParams} shopRecords={shopRecords}/>
            </div>
            {formParams.hasMore == 1 ? 
              <div className="load_more_review">
                <a href="javascript:void(0)" url="javascript:void(0)" id="load_more_review" className="revbtn">Load more</a>
              </div> : 
              ""
            }
        </div> :

            <ReviewItem reviewItems={reviewItems} formParams = {formParams} shopRecords={shopRecords}/>

        }
      </div>
	  </>
	  
	);
  
  }
  
  export default ProductReviewWidget;
