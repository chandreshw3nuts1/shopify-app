import React, { useState, useCallback, useEffect, useMemo } from 'react';
import settingsJson from './../../../utils/settings.json';
import { PlusIcon, SearchIcon } from '@shopify/polaris-icons';
import Swal from 'sweetalert2';
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';

import {
    Button,
    ResourceList,
    ResourceItem,
    TextField,
    Thumbnail,
    Checkbox, Spinner, Box, Icon
} from '@shopify/polaris';
export default function ProductGroupsComponent(props) {
    const shopify = useAppBridge();

    const [groupName, setGroupName] = useState('');
    const [allProductGroups, setAllProductGroups] = useState({});
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [allSelectedProducts, setAllSelectedProducts] = useState([]);
    const [allSelectedSearchProducts, setAllSelectedSearchProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [keyword, setKeyword] = useState('');

    const [addingProduct, setAddingProduct] = useState(false);
    const [showProductGroupForm, setShowProductGroupForm] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState(null); // Track which group is being edited
    const [displayEditedProducts, setDisplayEditedProducts] = useState([]); // Track which group is being edited

    const handleAddNewgroup = () => {
        setAddingProduct(true);
        setShowProductGroupForm(true);
        setEditingGroupId(null);
        setGroupName("");
        setAllSelectedProducts([]);
        setAllSelectedSearchProducts([]);
        setSelectedProducts([]);
    }
    const cancelProductGroupFrom = () => {
        setAddingProduct(false);
        setShowProductGroupForm(false);
        setSelectedProducts([]);
        setGroupName('');
        setEditingGroupId(null);
    }

    const handleCloseModal = () => {
		setKeyword('');
	};
    const handleInputChange = useCallback(
        (newValue) => setGroupName(newValue),
        [],
    );

    const handleShowProductsModal = async () => {
        shopify.modal.show('select-product-modal');
        try {
            setLoading(true);
            const filteredProducts = await getShopifyProducts(props.shopRecords.myshopify_domain, props.shopSessionRecords.accessToken);
            setProducts(filteredProducts);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }

    };
    const handleKeywordChange = useCallback(async (value) => {
        setKeyword(value);
        try {
            setLoading(true);
            const filteredProducts = await getShopifyProducts(props.shopRecords.myshopify_domain, props.shopSessionRecords.accessToken, value.trim());
            setProducts(filteredProducts);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);



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

    const submitProducts = async () => {
        shopify.modal.hide('select-product-modal');
        setAllSelectedProducts(allSelectedSearchProducts);
    }

    const saveProductsGroup = async () => {
        try {
            if (groupName == "") {
                shopify.toast.show("Group name is required", {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
                return true;
            }

            if (selectedProducts.length == 0) {
                shopify.toast.show("Please select product", {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
                return true;
            }
            const actionType = editingGroupId ? "updateProductGroups" : "addProductGroups";
            const customParams = {
                groupName: groupName,
                selectedProducts: selectedProducts,
                actionType: actionType,
                shop: props.shopRecords.shop,
                editingGroupId: editingGroupId || null
            };
            const response = await fetch(`/api/general-settings`, {
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

                setAddingProduct(false);
                setShowProductGroupForm(false);
                const productGroups = await getAllProductGroups(props.shopRecords.shop); // Call your async function here
                setAllProductGroups(productGroups);
                setEditingGroupId(null);
                setSelectedProducts([]);
                setGroupName('');
            } else {
                shopify.toast.show(data.message, {
                    duration: settingsJson.toasterCloseTime,
                    isError: true
                });
            }

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        const fetchProductGroups = async () => {
            try {
                const productGroups = await getAllProductGroups(props.shopRecords.shop); // Call your async function here
                setAllProductGroups(productGroups);
            } catch (error) {
                console.error("Error fetching product groups:", error);
            }
        };
        fetchProductGroups();


        const searchInputElement = document.getElementById("search_input");
        if (searchInputElement) {
            const handleSearchInput = async () => {
                handleKeywordChange(searchInputElement.value);
            };
            searchInputElement.addEventListener("input", handleSearchInput);
        }


    }, []);

    const deleteProductGroups = async (id, index) => {
        Swal.fire({
            title: 'Are you sure that you want to delete this group?',
            text: "This action is irreversible, and this group will not be accessible again.",
            // icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.isConfirmed) {

                try {
                    const customParams = {
                        id: id,
                        actionType: "productGroup"
                    };
                    const response = await fetch(`/api/general-settings`, {
                        method: 'DELETE',
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
                        setAllProductGroups(allProductGroups.filter((item, i) => i !== index));
                    } else {
                        shopify.toast.show(data.message, {
                            duration: settingsJson.toasterCloseTime,
                            isError: true
                        });
                    }
                } catch (error) {
                    console.error("Error deleting record:", error);

                }
            }

        });

    }

    const handleEditClick = async (groupId, event) => {
        event.preventDefault();
        try {
            setEditingGroupId(groupId);
            setShowProductGroupForm(false);
            setAllSelectedProducts([]);
            setAllSelectedSearchProducts([]);
            setGroupName('');
            const customParams = {
                shop: props.shopRecords.shop,
                groupId: groupId,
                actionType: "editProductGroups",
            };
            const response = await fetch(`/api/general-settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customParams)
            });
            const data = await response.json();
            setAllSelectedProducts(data.products);
            setAllSelectedSearchProducts(data.products);
            setSelectedProducts(data.products.map(product => product.id));

            console.log(selectedProducts);
            setGroupName(data.groupName);
        } catch (error) {
            console.log(error);
        }

    };

    const deleteSelectedEditProducts = async (product_id) => {
        setSelectedProducts([...selectedProducts.filter((product, i) => product !== product_id)]);
        setAllSelectedProducts(allSelectedProducts.filter(product => product.id !== product_id));
        setAllSelectedSearchProducts(allSelectedProducts.filter(product => product.id !== product_id));

    }


    return (
        <>
            <div className="whitebox">
                <div className="general_row">
                    <div className="row_title">
                        <div className="flxflexi lefttitle">
                            <h4>Product groups</h4>
                            <p>Share reviews between multiple products by grouping them together</p>
                        </div>
                    </div>
                    {/* <div className="formrow">
                        <div className="form-group m-0">
                            <div className="form-check form-switch">
                                <input
                                    
                                    className="form-check-input"
                                    type="checkbox"
                                    role="switch"
                                    name="is_enable_seo_rich_snippet"
                                    id="ratingongooglesearch"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="ratingongooglesearch"
                                >
                                    Show product thumbnail in grouping
                                </label>

                            </div>
                        </div>
                    </div> */}

                    <div>
                        {allProductGroups.length > 0 &&
                            <div className='selectproductwrap'>
                                <div className='productslist'>
                                    {allProductGroups.map((group, i) => (
                                        <ul className='proul' key={i}>
                                            <li>
                                                {editingGroupId !== group._id &&
                                                    <>
                                                        <div className='flxflexi'>
                                                            <a href="#" onClick={(e) => handleEditClick(group._id, e)}> {group.group_name}</a>
                                                        </div>
                                                        <div className='flxflexi'>
                                                            <Button onClick={(e) => handleEditClick(group._id, e)}>
                                                                Edit
                                                            </Button>
                                                            <Button onClick={(e) => deleteProductGroups(group._id, i)}>
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </>

                                                }
                                                {editingGroupId === group._id && (
                                                    <>
                                                        <div className="row_title">
                                                            <div className="flxflexi lefttitle">
                                                                <TextField
                                                                    label="Group name"
                                                                    value={groupName}
                                                                    onChange={handleInputChange}
                                                                    autoComplete="off"
                                                                />
                                                            </div>
                                                            <div className="flxfix rightaction">
                                                                <div className='form-group'>
                                                                    <label className="">Products</label>
                                                                    <Button variant="primary" onClick={handleShowProductsModal} >Select products</Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {allSelectedProducts.length > 0 &&
                                                            <div className='selectproductwrap'>
                                                                <label htmlFor="">Product </label>
                                                                <div className='productslist'>
                                                                    <ul className='proul'>
                                                                        {allSelectedProducts.map(product => (
                                                                            <li key={product.id}>
                                                                                <div className='imagebox flxfix'>
                                                                                    <img width="50" src={product.images[0].transformedSrc} alt="Product Image" />
                                                                                </div>
                                                                                <div className='flxflexi'>
                                                                                    <p>Title: {product.title}</p>
                                                                                </div>
                                                                                <button className='flxfix' type="button" onClick={(e) => deleteSelectedEditProducts(product.id)} >
                                                                                    <i className='twenty-closeicon'></i>
                                                                                </button>
                                                                            </li>
                                                                        ))}
                                                                    </ul>

                                                                </div>
                                                            </div>

                                                        }

                                                        <div className='btnwrap'>
                                                            <Button variant="primary" onClick={cancelProductGroupFrom} >Cancel</Button>
                                                            <Button variant="primary" onClick={saveProductsGroup} >Save Group</Button>

                                                        </div>
                                                    </>
                                                )}

                                            </li>
                                        </ul>
                                    ))}

                                </div>
                            </div>

                        }


                    </div>
                    {!addingProduct &&
                        <div className='btnwrap'>
                            <Button icon={PlusIcon} variant="primary" onClick={handleAddNewgroup}>
                                Add new group
                            </Button>
                        </div>
                    }

                    {showProductGroupForm &&
                        <>
                            <div className="row_title">
                                <div className="flxflexi lefttitle">
                                    <TextField
                                        label="Group name"
                                        value={groupName}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="flxfix rightaction">
                                    <div className='form-group'>
                                        <label className="">Products</label>
                                        <Button variant="primary" onClick={handleShowProductsModal} >Select products</Button>
                                    </div>
                                </div>
                            </div>
                            {allSelectedProducts.length > 0 &&
                                <div className='selectproductwrap'>
                                    <label htmlFor="">Product </label>
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
                                                    <button className='flxfix' type="button" onClick={(e) => deleteSelectedEditProducts(product.id)} >
                                                        <i className='twenty-closeicon'></i>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>

                                    </div>
                                </div>

                            }

                            <div className='btnwrap'>
                                <Button variant="primary" onClick={cancelProductGroupFrom} >Cancel</Button>
                                <Button variant="primary" onClick={saveProductsGroup} >Save Group</Button>

                            </div>
                        </>
                    }

                </div>
            </div>

            <Modal onHide={handleCloseModal} id="select-product-modal">
                <TitleBar title="Add products">
                    <button variant="primary" onClick={submitProducts} disabled={selectedProducts.length === 0}>
                        Add
                    </button>
                    <button onClick={() => shopify.modal.hide('select-product-modal')}>Close</button>
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

                                    // Create a click handler to toggle the checkbox
                                    const handleProductClick = () => {
                                        handleCheckboxChange(id);
                                    };

                                    return (
                                        <ResourceItem id={id}>
                                            {/* Wrap the entire product item with a click handler */}
                                            <div
                                                onClick={handleProductClick}
                                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} // Set cursor to pointer for better UX
                                            >
                                                <div>
                                                    {/* Prevent checkbox click from bubbling up to the parent div */}
                                                    <Checkbox
                                                        value={id}
                                                        checked={selectedProducts.includes(id)}
                                                        onChange={() => handleCheckboxChange(id)}
                                                        id={`product-checkbox-${id}`}
                                                        onClick={(e) => e.stopPropagation()} // Prevent event from bubbling
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

const getAllProductGroups = async (storeName) => {
    try {
        const customParams = {
            shop: storeName,
            actionType: "getProductGroups"
        };
        const response = await fetch(`/api/general-settings`, {
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

