import { formatDate, formatTimeAgo } from './../../../utils/dateFormat';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import settings from './../../../utils/settings.json'; 

import {
    Layout,
    Page,
    LegacyCard,
    Spinner,
    Card,Select, TextField, Button, FormLayout
  } from "@shopify/polaris";

export default function ReviewItem({filteredReviews}) {

    const handleDeleteReviewItem = async (recordId) => {
		Swal.fire({
			title: 'Are you sure you want to delete this review?',
			text: "This action is irreversible, and the review will not be accessible again!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then(async (result) => { 
			if (result.isConfirmed) {
				try {
					const response = await fetch(`${settings.host_url}/api/manage-review`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({"review_id" : recordId})
					});
	
					const data = await response.json();
					console.log(data);
					if(data.status == 200) {
						toast.success(data.message);
					} else {
						toast.error(data.message);
					}
					// Assuming toast is a function to show notifications
				} catch (error) {
					console.error("Error deleting record:", error);
					// Handle error, show toast, etc.
					toast.error("Failed to delete record.");
				}
			}
		});
	};
    return(
        <>
        {filteredReviews.map((result, index) => (
            <LegacyCard sectioned key={index}>
                <br/>
                <br/>
                <br/>
                <div >
                    {result.first_name}
                    {formatTimeAgo(result.created_at)}
                    <button onClick={() => handleDeleteReviewItem(result._id)}>Delete</button>	
                </div>
                
            </LegacyCard>
            ))}
           
        </>
    )
}