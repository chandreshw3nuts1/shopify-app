import { useEffect, useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import { mongoConnection } from './../utils/mongoConnection'; 
import { getShopDetails } from './../utils/common'; 
import Breadcrumb from "./components/Breadcrumb";
import ReviewPageSidebar from "./components/ReviewPageSidebar";
import styles from "./components/review.module.css";

 
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
const collectionName = 'settings';

export async function loader({request}) {

	try {

		const shopRecords =await getShopDetails(request);

		const db = await mongoConnection();
		const settingCollection = db.collection('settings');
		const records = await settingCollection.findOne({"shop_id" : shopRecords._id});
	
		return json(records);
	  } catch (error) {
		console.error('Error fetching records from MongoDB:', error);
		return json({ error: 'Failed to fetch records from MongoDB' }, { status: 500 });
	}

}
export const action = async ({ request }) => {
	let settings = {
		name : "abc",
		method : request.method
	}
	console.log('submit action');

	return json(settings);
}

const ReviewPage = () => {

	const settings = useLoaderData();
	const [isChecked, setIsChecked] = useState(settings?.autoPublishReview || false);
	const [selected, setSelected] = useState(settings?.reviewPublishMode || false);

	const actionData = useActionData();
	const submit = useSubmit();
  
	const [crumbs, setCrumbs] = useState([
	  {"title" : "Review", "link" :""},
	  {"title" : "Collect Review", "link" :""}
	]);
	const [openNewReview, setOpenNewReview] = useState(false);
	const [open, setOpen] = useState(false);
  
	const handleToggleNewReview = useCallback(() => setOpenNewReview((openNewReview) => !openNewReview), []);
	const handleToggle = useCallback(() => setOpen((open) => !open), []);
	

	const handleSelectChange = async (value, name) => {
		const updateData = {
			'field': name,
			'value': value,
			"oid" : settings._id
		};
		await fetch('/api/collect-review-setting', {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify(updateData),
		});
		
		setSelected(value); // Update the state with the selected value
	};
	

	const options = [
	  {label: 'All reviews', value: 'auto'},
	  {label: '5 star reviews', value: '5star'},
	  {label: '4 stars and up', value: 'above4'},
	  {label: '3 stars and up', value: 'above3'},
	];


	const handleCheckboxChange = async (event) => {

		try {
			console.log(settings);
			const myKey = event.target.name;
			const updateData = {
				'field': event.target.name,
				'value': !isChecked,
				"oid" : settings._id
			};
			await fetch('/api/collect-review-setting', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json',
			  },
			  body: JSON.stringify(updateData),
			});
	  
		  } catch (error) {
			console.error('Error updating record:', error);
		  }
		setIsChecked(!isChecked);
	};


	return (
	  <>
		  <Page fullWidth>
			  <Breadcrumb crumbs={crumbs}/>
		  </Page>
		  
		  <Page fullWidth>
			  <div className="row">
				  <div className="col-sm-3">
					  <ReviewPageSidebar />
				  </div>
				  <div className="col-sm-9">
				  
					  <Layout.Section>
					  
						  <LegacyCard sectioned>
							  <div onClick={handleToggleNewReview}
								  ariaExpanded={openNewReview}
								  ariaControls="basic-collapsible"
							  >
								  <Text as="h1" variant="headingMd">
									  Manage New Review
								  </Text>
								  <Text>
									  Choose which reviews you want to auto publish and how you want to be notified of new reviews
								  </Text>
							  </div>
							  <LegacyStack vertical>
								  <Collapsible
									  open={openNewReview}
									  id="basic-collapsible"
									  transition={{duration: '500ms', timingFunction: 'ease-in-out'}}
									  expandOnPrint
								  >
									  <Card>
									  <div className="container">
										  <div className="row">
											  <div className="col-sm-4">
												  <div className="form-check form-switch">
													  <input checked={isChecked} onChange={handleCheckboxChange} className="form-check-input" type="checkbox" role="switch" name="autoPublishReview" id="flexSwitchCheckChecked"  />
													  <label className="form-check-label" for="flexSwitchCheckChecked">Auto-publish new reviews</label>
												  </div>
											  </div>
											  <div className="col-sm-8">
											  <Select
												  name="reviewPublishMode"
												  id="reviewPublishMode"
												  helpText="Select which reviews you want to auto-publish. Any changes will only affect new reviews."
												  options={options}
												  onChange={handleSelectChange}
												  value={selected}
												  />
											  </div>
											  
										  </div>
									  </div>
										  
									  </Card>
								  </Collapsible>
							  </LegacyStack>
						  </LegacyCard>
  
					  </Layout.Section>
					  
				  </div>
				  
			  </div>
			  
		  </Page>
	  </>
	  
	);
  
  }
  
  export default ReviewPage;
