import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import { Modal, Button } from 'react-bootstrap';
import { getShopDetails } from './../utils/getShopDetails';
import { findOneRecord } from './../utils/common';
import { toast } from 'react-toastify';

import {
	Page,
	Card,
	Spinner,
	TextField,
} from '@shopify/polaris';
export async function loader({ request }) {
	const shopRecords = await getShopDetails(request);
	const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shopRecords.shop });

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
	const [showProductModal, setShowProductModal] = useState(false);
	const [products, setProducts] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [updateMemo, setUpdateMemo] = useState(false);

	const [keyword, setKeyword] = useState('');
	const [requestEmailSubject, setRequestEmailSubject] = useState('');
	const [loading, setLoading] = useState(false);
	const [submittingRequest, setSubmittingRequest] = useState(false);
    const [isVisibleInfo, setIsVisibleInfo] = useState(true);


	const handleCloseProductModal = () => setShowProductModal(false);

	const handleShowProductsModal = async () => {
		setShowProductModal(true);

		try {
			setLoading(true);
			const customParams = {
				storeName: shopRecords.name,
				accessToken: shopSessionRecords.accessToken,
			};
			const response = await fetch(`/api/shopify-products`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(customParams)
			});
			const data = await response.json();

			if (response.ok) {
				setProducts(data);
			} else {
				setError(data.error);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}

	};


	const handleCheckboxChange = (productId) => {
		setSelectedProducts((prevSelectedProducts) => {
			if (prevSelectedProducts.includes(productId)) {
				return prevSelectedProducts.filter((id) => id !== productId);
			} else if (prevSelectedProducts.length < 5) {
				return [...prevSelectedProducts, productId];
			} else {
				return prevSelectedProducts;
			}
		});

	};

	const handleKeywordChange = useCallback(async (value) => {
		setKeyword(value);
		try {
			setLoading(true);
			const filteredProducts = await getShopifyProducts(shopRecords.name, shopSessionRecords.accessToken, value.trim());
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
				toast.success(data.message);
				setEmails([]);
				setSelectedProducts([]);
				setUpdateMemo(!updateMemo);

			} else {
				toast.error(data.message);
			}
			setSubmittingRequest(false);

		} catch (error) {
			console.log(error);
		}
	};

	const submitProducts = async () => {
		setShowProductModal(false);
		setUpdateMemo(!updateMemo);
	}
	const deleteSelectedProducts = async (product_id) => {
		setSelectedProducts([...selectedProducts.filter((product, i) => product !== product_id)]);
		setUpdateMemo(!updateMemo);
	}

	const displayProductMemo = useMemo(() => {
		return products.filter(product =>
			selectedProducts.includes(product.id)
		);
	}, [updateMemo])
	useEffect(() => {
        const isVisibleInfo = localStorage.getItem('manualRequestEmailNotificationDismissed');
        setIsVisibleInfo(!isVisibleInfo);
    }, []);
    const handleDismiss = (e) => {
		e.preventDefault();
		setIsVisibleInfo(false);
		localStorage.setItem('manualRequestEmailNotificationDismissed', 'true');
	};

	const showBrandingPage = (e) => {
		e.preventDefault();
		navigate('/app/branding');
	}
	

	return (
		<>
			<Breadcrumb crumbs={crumbs} />
			<Page fullWidth>
				<div className='row justify-content-center'>
					<div className='col-md-6'>
						<div className='collectreviewformbox'>
							<Card>
								<div className="formcontent" >
									<form>
										<div className='inside_formcontent'>
											<div>
												<label>Email address : <span className="text-danger" >*</span></label>
												<ReactMultiEmail
													emails={emails}
													autoFocus={true}
													onChange={setEmails}
													placeholder="johnsmith@gmail.com"
													validateEmail={email => isEmail(email)}
													getLabel={(email, index, removeEmail) => (
														<div data-tag key={index}>
															{email}
															<span data-tag-handle onClick={() => removeEmail(index)}>×</span>
														</div>
													)}
												/>
											</div>
											<div className='selectproductwrap'>
												<label htmlFor="">Select products <span className="text-danger" >*</span></label>
												<div className='productslist'>
													<ul className='proul'>
														{displayProductMemo.map(product => (
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
													{displayProductMemo.length <= 4 &&
														<div className='btninwrap'>
															<Button className='revbtn bluelightbtn' onClick={(e) => handleShowProductsModal()}>{displayProductMemo.length > 0 ? 'add/edit products' : 'Select products'}</Button>
														</div>
													}
												</div>
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
											{isVisibleInfo && 
											<div className='alertbox primarybox'>
												<div className='iconbox'>
													<i className='twenty-customizeicon'></i>
												</div>
												<div className='flxflexi plaintext'>Your email appearance settings can be customized on the <a href="#" onClick={showBrandingPage} >Branding</a> page.</div>
												<div className='closebtn'>
													<a href="#" onClick={handleDismiss}><i className='twenty-closeicon'></i></a>
												</div>
											</div>}
											<div className="btnwrap emailbottom align-items-center">
												<span>By sending this email, I confirm that the recipients have given consent</span>
												<Button className="revbtn ms-auto" disabled={(displayProductMemo.length == 0 || emails.length == 0 || submittingRequest)} onClick={(e) => sendManualRequest()}>Send email <i className='twenty-longarrow-right'></i></Button>
											</div>

											<Modal show={showProductModal} onHide={handleCloseProductModal} size="lg" backdrop="static">
												<Modal.Header closeButton>
													<Modal.Title>Select Products</Modal.Title>
												</Modal.Header>

												<Modal.Body>

													<div className="formcontent" >
														<TextField
															value={keyword}
															onChange={handleKeywordChange}
															name="keyword"
															id="search_input"
															autoComplete="off"
															placeholder='Search products'
														/>

													</div>
													{loading ? (
														<div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
															<Spinner size="large" />
														</div>
													) : (
														products.length > 0 ?
															<div className='propopuplist'>
																<div className="row">
																	<div className="col-md-6">
																		{products.map((product, index) => (
																			<div className="product-item" key={index}>
																				<div className="form-check mr-3">
																					<input className="form-check-input" type="checkbox"
																						value={product.id} id={"product_" + index}
																						onChange={() => handleCheckboxChange(product.id)}
																						checked={selectedProducts.includes(product.id)}
																						disabled={!selectedProducts.includes(product.id) && selectedProducts.length >= 5}
																					/>
																					<label className="form-check-label" for={"product_" + index}>
																						<div className='imgbox flxfix'>
																							<img width="50" src={product.images[0].transformedSrc} alt="Product Image" />
																						</div>
																						<h5 className='flxflexi'>{product.title}</h5>
																					</label>
																				</div>
																			</div>
																		))}

																	</div>
																</div>
															</div>
															: <div>No products found</div>)
													}



												</Modal.Body>
												<Modal.Footer>
													<Button className='revbtn lightbtn' onClick={handleCloseProductModal}>
														Close
													</Button>
													<Button className='revbtn ms-auto' disabled={selectedProducts.length == 0} onClick={submitProducts} >
														Submit
													</Button>
												</Modal.Footer>
											</Modal>

										</div>
									</form>
								</div>
							</Card>
						</div>
					</div>

				</div>

			</Page>
		</>
	);
};

export default ManualReviewRequestsPage;
