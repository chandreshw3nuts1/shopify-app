import { formatDate, formatTimeAgo } from './../../../utils/dateFormat';

import {
    Layout,
    Page,
    LegacyCard,
    Spinner,
    Card,Select, TextField, Button, FormLayout
  } from "@shopify/polaris";

export default function ReviewItem({filteredReviews}) {
    console.log(filteredReviews);
    return(
        <>
        {filteredReviews.map((result, index) => (
            <LegacyCard sectioned>
                <br/>
                <br/>
                <br/>
                <div key={index}>
                    {result.first_name}
                    {formatTimeAgo(result.created_at)}
                    <button onClick={() => handleDeleteReviewItem(result._id)}>Delete</button>	
                </div>
                
            </LegacyCard>
            ))}
           
        </>
    )
}