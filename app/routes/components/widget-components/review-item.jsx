import ItemRating  from './rating';
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

const ReviewItem = ({ reviewItems, productsDetails }) => {
	return (
	  <>
        
        
        {reviewItems.length == 0 ? (
            <p>No reviews found.</p>
        ) : (
        reviewItems.map((review, i) => (
            <div className="row review-list-item" key={i} >
                <div className="col">
                    <div className="box-style">
                        <div className="review">
                            <Text variant="headingXl" as="h4">
                                {review.first_name} {review.last_name}
                            </Text>
                           
                            <div className="date">{moment(review.created_at).format('M/D/YYYY')}</div>
                            <div className="star-rating">
                                <ItemRating noOfRating ={review.rating}/>
                            </div>

                            <div className="content">
                                {review.description}
                            </div>
                            {/* {review.images.map((images, imkey) => (
                                <img src="https://via.placeholder.com/100" key={imkey} alt="User Image" className="review-image" />
                                )
                            )} */}
                            <hr/>
                            <div className="product-container">

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
            ))
        )}

	  </>
	  
	);
  
  }
  
  export default ReviewItem;
