import ItemRating  from './rating';
import moment from 'moment';
import StarBigIcon from "../icons/StarBigIcon";
import {getUploadDocument} from './../../../utils/documentPath';
import PlayIcon from '../icons/PlayIcon';


import {
  Text,
} from "@shopify/polaris";

const ReviewItem = ({ reviewItems, formParams, shopRecords}) => {
	return (
	  <>
        
        
        {reviewItems.length > 0  &&
            reviewItems.map((review, i) => (
                <div className="review-list-item frontreviewbox" data-reviewid={review._id} >
                    <div className='row'>
                        <div className="col">
                            <div className="box-style">
                                <div className="review">
                                    <div className='review_topbar flxrow'>
                                        <div className='mid_detail flxflexi'>
                                            <Text variant="headingXl" as="h4">
                                                {review.display_name}
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
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text_content">
                                        <p>
                                            {review.description}
                                        </p>
                                    </div>

                                    {review.replyText && 
                                    <div className="text_content">
                                        <p>
                                            <b>{shopRecords.name}</b> Replied :
                                        </p>
                                        <p>
                                            {review.replyText}
                                        </p>
                                    </div>}
                                    {(formParams.hideProductThumbnails !== 'true' || review.reviewDocuments.length > 0) && 

                                    <div className='review_bottomwrap'>
                                        { (formParams.hideProductThumbnails != 'true' && review.productDetails ) && 
                                            <div className="product-container product-thumb-detail">
                                                <div className="image flxfix">
                                                    <img src={review.productDetails.images.edges[0].node.transformedSrc} />
                                                </div>
                                                <div className="text flxflexi">
                                                    <p>{review.productDetails.title}</p>
                                                </div>
                                            </div>
                                        }

                                        {review.reviewDocuments && 
                                        <div className='review_imageswrap flxrow'>
                                            
                                            {review.reviewDocuments.map((media, i) => (
                                                <div className='imagebox'>
                                                    {media.type === 'image' ? (
                                                        <img src={getUploadDocument(media.url)} />
                                                    ) : (
                                                        <div className='videoth'>
                                                            <div className='playicon'><PlayIcon /></div>
                                                            <video>
                                                                <source src={getUploadDocument(media.url)} type="video/mp4" />
                                                            </video>
                                                        </div>
                                                    )}
                                                    
                                                </div>
                                            ))}
                                            
                                        </div>}
                                    </div>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            ))
       }

	  </>
	  
	);
  
  }
  
  export default ReviewItem;
