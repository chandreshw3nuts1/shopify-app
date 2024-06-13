import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";


const CreateReviewModalWidget = ({shopRecords}) => {
    const proxyUrl = "https://"+shopRecords.domain+"/apps/custom-proxy/product-review-widget";
	return (
	    <>  
        <div id="createReviewModal" className="custom-review-modal" >
            <div className="custom-review-modal-content">
            <span className="close-btn">&times;</span>
            <h2>Create Review</h2>
            <form action={proxyUrl} method="post" id="review_submit_btn_form">
                <div className="form-group">
                    <label for="reviewText">Review</label>
                    <textarea className="form-control" id="reviewText" name="review" rows="3"></textarea>
                </div>
                    <div className="form-group">
                        <label for="reviewRating">Rating</label>
                        <div className="star-rating">
                            <input type="radio" id="star5" name="rating" value="5" />
                            <label for="star5">&#9733;</label>
                            <input type="radio" id="star4" name="rating" value="4" />
                            <label for="star4">&#9733;</label>
                            <input type="radio" id="star3" name="rating" value="3" />
                            <label for="star3">&#9733;</label>
                            <input type="radio" id="star2" name="rating" value="2" />
                            <label for="star2">&#9733;</label>
                            <input type="radio" id="star1" name="rating" value="1" />
                            <label for="star1">&#9733;</label>
                        </div>
                    </div>
                    <button type="submit" id="review_submit_btn" className="btn btn-primary">Submit Review</button>
                </form>
            </div>
        </div>
       
	    </>
	  
	);
  
  }
  
  export default CreateReviewModalWidget;
