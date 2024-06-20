import { useState, useCallback } from 'react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { mongoConnection } from './../utils/mongoConnection';
import { getShopDetails } from './../utils/getShopDetails';
import { findOneRecord, getCustomQuestions } from './../utils/common';
import Breadcrumb from './components/Breadcrumb';
import ReviewPageSidebar from './components/headerMenu/ReviewPageSidebar';
import CustomQuestions from "./components/collectReview/CustomQuestions";
import ManageNewReview from "./components/collectReview/ManageNewReview";

import {
	Page,
	Layout,
	Text,
	LegacyCard,
	LegacyStack,
	Collapsible,
} from '@shopify/polaris';
const collectionName = 'settings';

export async function loader({ request }) {
	try {
		const shopRecords = await getShopDetails(request);

		const db = await mongoConnection();
		const settings = await findOneRecord(collectionName,{
			shop_id: shopRecords._id,
		});


		const customQuestionsData = await getCustomQuestions({
			shop_id: shopRecords._id,
		});


		return json({"settings" : settings, "shopRecords" : shopRecords, "customQuestionsData" : customQuestionsData});
	} catch (error) {
		console.error('Error fetching records from MongoDB:', error);
		return json(
			{ error: 'Failed to fetch records from MongoDB' },
			{ status: 500 }
		);
	}
}

const ReviewPage = () => {
	const loaderData = useLoaderData();
	const settings = loaderData.settings;
	const customQuestionsData = loaderData.customQuestionsData;
	const shopRecords = loaderData.shopRecords;

	const [crumbs, setCrumbs] = useState([
		{ title: 'Review', link: '' },
		{ title: 'Collect Review', link: '' },
	]);
	const [openNewReview, setOpenNewReview] = useState(false);
	const [openCustomQuestions, setOpenCustomQuestions] = useState(false);
	const handleToggleNewReview = useCallback(() => setOpenNewReview(openNewReview => !openNewReview),[]);
	const handleToggleCustomQuestions = useCallback(() => setOpenCustomQuestions(openCustomQuestions => !openCustomQuestions),[]);


	return (
		<>
			<Breadcrumb crumbs={crumbs} />

			<Page fullWidth>
				<ReviewPageSidebar />
				<div className='accordian_rowmain'>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								onClick={handleToggleNewReview}
								ariaExpanded={openNewReview}
								ariaControls="basic-collapsible"
								className={openNewReview ? 'open' : ''}
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										<i className='twenty-star'></i>
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
											Manage New Review
										</Text>
										<Text>
											Choose which reviews you want to auto
											publish and how you want to be notified
											of new reviews
										</Text>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-arrow-down'></i>
									</div>
								</div>
							</div>
							<LegacyStack vertical>
								<Collapsible
									open={openNewReview}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
								<ManageNewReview settings={settings} shopRecords={shopRecords}/>	
								</Collapsible>
							</LegacyStack>
						</LegacyCard>
					</Layout.Section>
				</div>
				<div className='accordian_rowmain'>
					<Layout.Section>
						<LegacyCard sectioned>
							<div
								onClick={handleToggleCustomQuestions}
								ariaExpanded={openCustomQuestions}
								ariaControls="basic-collapsible"
								className={openCustomQuestions ? 'open' : ''}
							>
								<div className='flxrow acctitle'>
									<div className='flxfix iconbox'>
										<i className='twenty-questions'></i>
									</div>
									<div className='flxflexi titledetail'>
										<Text as="h1" variant="headingMd">
											Custom Questions
										</Text>
										<Text>
										Add your own custom questions to the review form
										</Text>
									</div>
									<div className='flxfix arrowicon'>
										<i className='twenty-arrow-down'></i>
									</div>
								</div>
							</div>
							<LegacyStack vertical>
								<Collapsible
									open={openCustomQuestions}
									id="basic-collapsible"
									transition={{
										duration: '300ms',
										timingFunction: 'ease-in-out',
									}}
									expandOnPrint
								>
									<div className='row'>
										<div className='col-md-12'>
											<CustomQuestions customQuestionsData={customQuestionsData} shopRecords={shopRecords} />
										</div>
									</div>
								</Collapsible>
							</LegacyStack>
						</LegacyCard>
					</Layout.Section>
				</div>
			</Page>
		</>
	);
};

export default ReviewPage;
