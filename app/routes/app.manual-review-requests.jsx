import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { mongoConnection } from "./../utils/mongoConnection";
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';

import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import Breadcrumb from './components/Breadcrumb';
import { getShopDetails } from './../utils/getShopDetails';
import { findOneRecord } from './../utils/common';
import InformationAlert from './components/common/information-alert';
import { SearchIcon } from '@shopify/polaris-icons';

import { useNavigate } from 'react-router-dom';
import settingsJson from './../utils/settings.json';

import {
	Page,
	Card,
	Spinner,
	Button,
	ResourceList,
	ResourceItem,
	TextField,
	Thumbnail,
	Checkbox,
	Box,
	Icon
} from '@shopify/polaris';
export async function loader({ request }) {
	const db = await mongoConnection();
	const shopRecords = await getShopDetails(request);

	const shopSessionRecords = await findOneRecord("shopify_sessions", {
		$or: [
			{ shop: shopRecords.shop },
			{ myshopify_domain: shopRecords.shop }
		]
	});
	return json({ shopRecords: shopRecords, shopSessionRecords });
}
const getShopifyProducts = async (storeName, accessToken, searchTitle) => {
	try {
		const customParams = {
			storeName: storeName,
			accessToken: accessToken,
			searchTitle: searchTitle,
		};
		const response = await fetch(`/api/shopify-products`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(customParams)
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
	}

};

const ManualReviewRequestsPage = () => {
	const shopify = useAppBridge();
	const loaderData = useLoaderData();
	const shopRecords = loaderData.shopRecords;
	const shopSessionRecords = loaderData.shopSessionRecords;
	const navigate = useNavigate();

	const [crumbs, setCrumbs] = useState([
		{ title: "Review", "link": "./../review" },
		{ title: "Collect review", "link": "./../review" },
		{ title: "Manual review requests", link: "" },
	]);
	const [emails, setEmails] = useState([]);
	const [products, setProducts] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState([]);

	const [keyword, setKeyword] = useState('');
	const [requestEmailSubject, setRequestEmailSubject] = useState('');
	const [loading, setLoading] = useState(false);
	const [submittingRequest, setSubmittingRequest] = useState(false);
	const [isVisibleInfo, setIsVisibleInfo] = useState(true);
	const [allSelectedSearchProducts, setAllSelectedSearchProducts] = useState([]);
	const [allSelectedProducts, setAllSelectedProducts] = useState([]);


	const handleShowProductsModal = async () => {
		shopify.modal.show('manual-select-product-modal');
		try {
			setLoading(true);
			const filteredProducts = await getShopifyProducts(shopRecords.myshopify_domain, shopSessionRecords.accessToken);
			setProducts(filteredProducts);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const handleCloseModal = () => {
		setKeyword('');
	};


	const handleCheckboxChange = (productId) => {
		setSelectedProducts((prevSelectedProducts) => {
			if (prevSelectedProducts.includes(productId)) {
				// Remove from selectedProducts array
				const updatedSelected = prevSelectedProducts.filter((id) => id !== productId);

				// Update selectedAllProducts to remove the unchecked product
				setAllSelectedSearchProducts((prevAllSelectedProducts) =>
					prevAllSelectedProducts.filter((product) => product.id !== productId)
				);

				return updatedSelected;
			} else {
				// Add to selectedProducts array
				const updatedSelected = [...prevSelectedProducts, productId];

				// Find the product by its ID and add to selectedAllProducts
				const selectedProduct = products.find((product) => product.id === productId);

				setAllSelectedSearchProducts((prevAllSelectedProducts) => {
					// Prevent duplicates in selectedAllProducts
					const productAlreadySelected = prevAllSelectedProducts.some(
						(product) => product.id === productId
					);
					if (!productAlreadySelected) {
						return [...prevAllSelectedProducts, selectedProduct];
					}
					return prevAllSelectedProducts;
				});

				return updatedSelected;
			}
		});
	};


	const handleKeywordChange = useCallback(async (value) => {
		setKeyword(value);
		try {
			setLoading(true);
			const filteredProducts = await getShopifyProducts(shopRecords.myshopify_domain, shopSessionRecords.accessToken, value.trim());
			setProducts(filteredProducts);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	}, []);


	const handleRequestEmailSubjectChange = useCallback((value) => {
		setRequestEmailSubject(value);

	}, []);


	const sendManualRequest = async () => {

		try {
			setSubmittingRequest(true);
			const customParams = {
				emails: emails,
				selectedProducts: selectedProducts,
				requestEmailSubject: requestEmailSubject,
				actionType: "manualReviewRequest",
				shop: shopRecords.shop
			};
			const response = await fetch(`/api/collect-review-setting`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(customParams)
			});
			const data = await response.json();
			if (data.status == 200) {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime
				});
				setEmails([]);
				setSelectedProducts([]);
				setAllSelectedProducts([]);
				setAllSelectedSearchProducts([]);
				setRequestEmailSubject('');
				setKeyword('');
			} else {
				shopify.toast.show(data.message, {
					duration: settingsJson.toasterCloseTime,
					isError: true
				});
			}
			setSubmittingRequest(false);

		} catch (error) {
			console.log(error);
		}
	};

	const submitProducts = async () => {
		shopify.modal.hide('manual-select-product-modal');
		setAllSelectedProducts(allSelectedSearchProducts);
	}
	const deleteSelectedProducts = async (product_id) => {
		setSelectedProducts([...selectedProducts.filter((product, i) => product !== product_id)]);
		setAllSelectedProducts(allSelectedProducts.filter(product => product.id !== product_id));
		setAllSelectedSearchProducts(allSelectedProducts.filter(product => product.id !== product_id));
	}

	const backToReviewPage = (e) => {
		e.preventDefault();
		navigate('/app/review');
	}

	return (
		<>
			<Breadcrumb crumbs={crumbs} />
			<Page fullWidth>
				<div className='pagebackbtn'>
					<a href="#" onClick={backToReviewPage}><i className='twenty-arrow-left'></i>Back</a>
				</div>
				<div className='row justify-content-center'>
					<div className='col-md-6'>
						<div className='collectreviewformbox'>
							<div className='sectitlebox'>
								<h2>Send manual review requests</h2>
								<p>Collect reviews from people who have tried your products</p>
							</div>
							<Card>
								<div className="formcontent" >
									<form>
										<div className='inside_formcontent'>
											<div>
												<label>Email address: <span className="text-danger" >*</span></label>
												<ReactMultiEmail
													emails={emails}
													autoFocus={true}
													onChange={setEmails}

													validateEmail={email => isEmail(email)}
													getLabel={(email, index, removeEmail) => (
														<div data-tag key={index}>
															{email}
															<span data-tag-handle onClick={() => removeEmail(index)}>×</span>
														</div>
													)}
												/>
												<div className='inputnote'>Manual requests count towards your review requests email quota. <a href="#">Learn more</a></div>
											</div>
											<div className='selectproductwrap'>
												<label htmlFor="">Select products <span className="text-danger" >*</span></label>
												<div className='productslist'>
													<ul className='proul'>
														{allSelectedProducts.map(product => (
															<li key={product.id}>
																{/* <p>ID: {product.id}</p> */}
																<div className='imagebox flxfix'>
																	<img width="50" src={product.images[0].transformedSrc} alt="Product Image" />
																</div>
																<div className='flxflexi'>
																	<p>Title: {product.title}</p>
																</div>
																<button className='flxfix' type="button" onClick={(e) => deleteSelectedProducts(product.id)} >
																	<i className='twenty-closeicon'></i>
																</button>
															</li>
														))}
													</ul>
													{allSelectedProducts.length <= 4 &&
														<div className='btninwrap'>
															<Button className='revbtn bluelightbtn' onClick={(e) => handleShowProductsModal()}>{allSelectedProducts.length > 0 ? 'add/edit products' : 'Select products'}</Button>
														</div>
													}
												</div>
												<div className='inputnote'>Select up to Five products</div>
											</div>

											<div className="formcontent" >
												<TextField
													value={requestEmailSubject}
													onChange={handleRequestEmailSubjectChange}
													name="subject"
													id="subject"
													autoComplete="off"
													placeholder='Subject'
												/>

											</div>
											<InformationAlert alertKey="manual_review_request" alertType="email_appearance" pageSlug="/app/branding" alertClose />

											<div className="btnwrap emailbottom align-items-center">
												<span>By sending this email, I confirm that the recipients have given consent</span>
												<Button variant="primary" disabled={(allSelectedProducts.length == 0 || emails.length == 0 || submittingRequest)} onClick={(e) => sendManualRequest()}>Send email </Button>
											</div>

										</div>
									</form>
								</div>
							</Card>
						</div>
					</div>

				</div>

			</Page>
			<Modal onHide={handleCloseModal} id="manual-select-product-modal">
				<TitleBar title="Select Products">
					<button variant="primary" onClick={submitProducts} disabled={selectedProducts.length === 0}>
						Add
					</button>
					<button onClick={() => shopify.modal.hide('manual-select-product-modal')}>Close</button>
				</TitleBar>
				<Box padding="200">
					<div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10, padding: '10px 0' }}>
						<TextField
							prefix={<Icon source={SearchIcon} tone="base" />}
							onChange={handleKeywordChange}
							placeholder="Search products"
							autoComplete="off"
							value={keyword}
							name="keyword"
							id="search_input"
						/>
					</div>

					{loading ? (
						<div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
							<Spinner size="small" />
						</div>
					) : (
						<div style={{ maxHeight: '400px', overflowY: 'auto' }}>
							<ResourceList
								resourceName={{ singular: 'product', plural: 'products' }}
								items={products}
								renderItem={(product) => {
									const { id } = product;

									// Create a click handler that toggles the checkbox
									const handleProductClick = () => {
										handleCheckboxChange(id);
									};

									return (
										<ResourceItem id={id}>
											{/* Make the whole item clickable */}
											<div
												onClick={handleProductClick}
												style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} // Set cursor to pointer for better UX
											>
												<div>
													{/* Checkbox itself should not trigger onClick to avoid double handling */}
													<Checkbox
														value={id}
														checked={selectedProducts.includes(id)}
														onChange={() => handleCheckboxChange(id)} // Keep this for direct checkbox clicks
														id={`product-checkbox-${id}`}
														onClick={(e) => e.stopPropagation()} // Prevent the event from bubbling to the parent div
													/>
												</div>
												<Thumbnail size="small" source={product.images[0].transformedSrc} alt={product.title} />
												<span style={{ marginLeft: '10px' }}>{product.title}</span>
											</div>
										</ResourceItem>
									);
								}}
							/>
						</div>
					)}
				</Box>
			</Modal>

		</>
	);
};

export default ManualReviewRequestsPage;
