import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ReactMultiEmail, isEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from './components/Breadcrumb';
import { Modal, Button } from 'react-bootstrap';
import { getShopDetails } from './../utils/getShopDetails';
import { findOneRecord, fetchAllProducts } from './../utils/common';
import { toast } from 'react-toastify';

import {
	Page,
	Card,
	TextField,
} from '@shopify/polaris';
export async function loader({ request }) {
	const shopRecords = await getShopDetails(request);
	const shopSessionRecords = await findOneRecord("shopify_sessions", { "shop": shopRecords.shop });

	const products = await fetchAllProducts(shopRecords.name, shopSessionRecords.accessToken);
	return json({ products: products, shopRecords: shopRecords });
}

const ReviewPage = () => {
	const loaderData = useLoaderData();
	const shopRecords = loaderData.shopRecords;
	const navigate = useNavigate();

	const [crumbs, setCrumbs] = useState([
		{ title: "Review", "link": "./../review" },
		{ title: "Collect review", "link": "./../review" },
		{ title: "Menual review requests", link: "" },
	]);
	const [emails, setEmails] = useState([]);
	const [showProductModal, setShowProductModal] = useState(false);
	const [products, setProducts] = useState(loaderData.products);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [updateMemo, setUpdateMemo] = useState(false);

	const [keyword, setKeyword] = useState('');
	const [requestEmailSubject, setRequestEmailSubject] = useState('');


	const handleCloseProductModal = () => setShowProductModal(false);

	const handleShowProductsModal = async () => {
		setShowProductModal(true);
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

	const handleKeywordChange = useCallback((value) => {
		setKeyword(value);
		const filteredProducts = products.filter(product =>
			product.title.toLowerCase().includes(value.toLowerCase())
		);

		setProducts(filteredProducts);
	}, []);


	const handleRequestEmailSubjectChange = useCallback((value) => {
		setRequestEmailSubject(value);

	}, []);


	const sendManualRequest = async () => {

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

	return (
		<>
			<Breadcrumb crumbs={crumbs} />
			<Page fullWidth>
				<div className='row'>
					<div className='col-md-6'>
						<div className='collectreviewformbox'>
							<Card>
								<div className="formcontent" >
									<form >
										<div>
											<label>Email Addresses:</label>
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
										</div>

										<div>


											<ul>
												{displayProductMemo.map(product => (
													<li key={product.id}>
														<p>ID: {product.id}</p>
														<p>Title: {product.title}</p>
														<img width="50" src={product.images[0].transformedSrc} alt="Product Image" />
														<button type="button" onClick={(e) => deleteSelectedProducts(product.id)} >Delete</button>
													</li>
												))}
											</ul>

											<Button onClick={(e) => handleShowProductsModal()}>{displayProductMemo.length > 0 ? 'add/edit products' : 'Select products'}</Button>

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
												
											<Button  disabled = { (displayProductMemo.length == 0 || emails.length == 0 ) }  onClick={(e) => sendManualRequest()}>Send</Button>

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

													<div className="row mt-4">
														<div className="col-md-6 mb-3">
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
																			<img width="50" src={product.images[0].transformedSrc} alt="Product Image" />
																			<h5>{product.title}</h5>
																		</label>
																	</div>
																</div>
															))}

														</div>
													</div>

												</Modal.Body>
												<Modal.Footer>
													<Button variant="secondary" onClick={handleCloseProductModal}>
														Close
													</Button>
													<Button disabled={selectedProducts.length == 0} variant="primary" onClick={submitProducts} >
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

export default ReviewPage;
