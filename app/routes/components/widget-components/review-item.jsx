import ItemRating  from './rating';
import moment from 'moment';
import StarBigIcon from "../icons/StarBigIcon";

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

const ReviewItem = ({ reviewItems, productsDetails }) => {
	return (
	  <>
        
        
        {reviewItems.length == 0 ? (
            <p>No reviews found.</p>
        ) : (
        reviewItems.map((review, i) => (
            <div className="review-list-item frontreviewbox" key={i} >
                <div className='row'>
                    <div className="col">
                        <div className="box-style">
                            <div className="review">
                                <div className='review_topbar flxrow'>
                                    {/* <div className='profileicon flxfix'>1</div> */}
                                    <div className='mid_detail flxflexi'>
                                        <Text variant="headingXl" as="h4">
                                            {review.first_name} {review.last_name}
                                        </Text>
                                        <div className="date">{moment(review.created_at).format('M/D/YYYY')}</div>
                                    </div>
                                    <div className='star_reviews flxfix'>
                                        <div className="star-rating">
                                            <div className='ratingcount'>{review.rating}.0</div>
                                            <div class={`ratingstars flxrow star-${review.rating}`}>
                                                <StarBigIcon className="ratingstar" />
                                                <StarBigIcon className="ratingstar" />
                                                <StarBigIcon className="ratingstar" />
                                                <StarBigIcon className="ratingstar" />
                                                <StarBigIcon className="ratingstar" />
                                            </div>
                                            {/* <ItemRating noOfRating ={review.rating}/> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="text_content">
                                    <p>
                                        {review.description}
                                    </p>
                                </div>
                                {/* {review.images.map((images, imkey) => (
                                    <img src="https://via.placeholder.com/100" key={imkey} alt="User Image" className="review-image" />
                                    )
                                )} */}
                                <div className="product-container imageorvideowrap">
                                    <div className='columnbox'>
                                        <div className="image">
                                            <img src={productsDetails[i].images.edges[0].node.transformedSrc} />
                                        </div>
                                        <div className="text">
                                            <p>{productsDetails[i].title}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ))
        )}

	  </>
	  
	);
  
  }
  
  export default ReviewItem;
