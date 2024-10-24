import React, { useState, useCallback, useEffect } from 'react';
import settingsJson from './../../../utils/settings.json';
import { PlusIcon, SearchIcon, XIcon, EditIcon } from '@shopify/polaris-icons';
import { Modal, TitleBar, useAppBridge } from '@shopify/app-bridge-react';

import {
    Button,
    ResourceList,
    ResourceItem,
    TextField,
    Thumbnail,
    Link,
    Checkbox, Spinner, Box, Icon, Card, Text, BlockStack, InlineGrid, InlineStack, Divider
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
    const [deleteGroupId, setDeleteGroupId] = useState(null); // Track which group is being edited
    const [deleteGroupIndex, setDeleteGroupIndex] = useState(null); // Track which group is being edited

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
            const filteredProducts = await getShopifyProducts(props.shopRecords._id);
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
            const filteredProducts = await getShopifyProducts(props.shopRecords._id, value.trim());
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
                const updatedSelected = prevSelectedProducts.filter((product_id) => product_id !== productId);

                // Update selectedAllProducts to remove the unchecked product
                setAllSelectedSearchProducts((prevAllSelectedProducts) =>
                    prevAllSelectedProducts.filter((product) => product.product_id !== productId)
                );

                return updatedSelected;
            } else {
                // Add to selectedProducts array
                const updatedSelected = [...prevSelectedProducts, productId];

                // Find the product by its ID and add to selectedAllProducts
                const selectedProduct = products.find((product) => product.product_id === productId);

                setAllSelectedSearchProducts((prevAllSelectedProducts) => {
                    // Prevent duplicates in selectedAllProducts
                    const productAlreadySelected = prevAllSelectedProducts.some(
                        (product) => product.product_id === productId
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


    const openProductGroupDeleteModal = (id, index) => {
        shopify.modal.show('delete-product-group-modal');
        setDeleteGroupId(id);
        setDeleteGroupIndex(index);

    }
    const deleteProductGroups = async () => {

        try {
            shopify.modal.hide('delete-product-group-modal');

            const customParams = {
                id: deleteGroupId,
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
                setAllProductGroups(allProductGroups.filter((item, i) => i !== deleteGroupIndex));
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
            setSelectedProducts(data.products.map(product => product.product_id));
            setGroupName(data.groupName);
        } catch (error) {
            console.log(error);
        }

    };

    const deleteSelectedEditProducts = async (product_id) => {
        setSelectedProducts([...selectedProducts.filter((product, i) => product !== product_id)]);
        setAllSelectedProducts(allSelectedProducts.filter(product => product.product_id !== product_id));
        setAllSelectedSearchProducts(allSelectedProducts.filter(product => product.product_id !== product_id));

    }


    return (
        <>

            <Card padding="400" roundedAbove="xs">
                <BlockStack gap="400">
                    <BlockStack gap="100">
                        <Text as="h4" variant="headingMd">Product groups</Text>
                        <Text>Use product grouping to share reviews on an ongoing basis between different products. This is useful if you sell similar to identical product using different Shopify product pages.</Text>
                    </BlockStack>
                    <Divider />

                    {allProductGroups.length > 0 &&
                        <>
                            {allProductGroups.map((group, i) => (
                                <div key={i}>
                                    {editingGroupId !== group._id &&
                                        <>

                                            <InlineGrid gap="400" columns={['twoThirds', 'oneThird']} alignItems="center">
                                                <InlineStack align="start" gap="400" >

                                                    <Link monochrome removeUnderline={true} url="#" onClick={(e) => handleEditClick(group._id, e)}>{group.group_name}</Link>

                                                </InlineStack>
                                                <InlineStack align="end" gap="400" >

                                                    <Link removeUnderline={true} url="#" onClick={(e) => handleEditClick(group._id, e)}><Icon
                                                        source={EditIcon}
                                                        tone="base"
                                                    /></Link>
                                                    <Link
                                                        removeUnderline={true}
                                                        url="#"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            openProductGroupDeleteModal(group._id, i);
                                                        }}
                                                    >
                                                        <Icon
                                                            source={XIcon}
                                                            tone="critical"
                                                        />
                                                    </Link>

                                                </InlineStack>
                                            </InlineGrid>
                                        </>

                                    }
                                    {editingGroupId === group._id && (
                                        <>
                                            <Box padding="400" >

                                                <InlineGrid columns={['twoThirds', 'oneThird']} alignItems="center">
                                                    <Box>
                                                        <TextField
                                                            label="Group name"
                                                            value={groupName}
                                                            onChange={handleInputChange}
                                                            autoComplete="off"
                                                            placeholder="Enter group name"

                                                        />
                                                    </Box>
                                                    <Box style={{ marginLeft: '10px' }} >
                                                        <Text>Products</Text>
                                                        <Button variant="primary" onClick={handleShowProductsModal} >Select products</Button>
                                                    </Box>

                                                </InlineGrid>
                                            </Box>
                                            {allSelectedProducts.length > 0 &&
                                                <Box padding="400" >
                                                    <InlineGrid gap="400" columns={['twoThirds', 'oneThird']} alignItems="center">
                                                        <InlineStack alignment="center" spacing="tight">
                                                            <Text variant="headingSm" element="h3" style={{ flex: 1 }}>Product</Text>
                                                        </InlineStack>
                                                        <InlineStack align="end" spacing="tight">
                                                            <Text variant="headingSm" element="h3" style={{ flex: 1 }}>Remove</Text>
                                                        </InlineStack>

                                                    </InlineGrid>
                                                    <ResourceList
                                                        resourceName={{ singular: 'product', plural: 'products' }}
                                                        items={allSelectedProducts}
                                                        renderItem={(product, index) => {
                                                            const { product_id, product_title, product_image } = product;
                                                            const media = <Thumbnail source={product_image} alt={product_title} />;

                                                            return (
                                                                <ResourceItem id={product_id} media={media}>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                        <Text variation="strong">{product_title}</Text>

                                                                        <Link
                                                                            removeUnderline={true}
                                                                            url="#"
                                                                            onClick={(event) => {
                                                                                event.preventDefault();
                                                                                deleteSelectedEditProducts(product_id);
                                                                            }}
                                                                        >
                                                                            <Icon
                                                                                source={XIcon}
                                                                                tone="critical"
                                                                            /></Link>

                                                                    </div>
                                                                </ResourceItem>
                                                            );
                                                        }}
                                                    />

                                                    <div className='btnwrap'>
                                                        <Button variant="primary" onClick={cancelProductGroupFrom} >Cancel</Button>
                                                        <Button variant="primary" onClick={saveProductsGroup} >Save Group</Button>

                                                    </div>
                                                </Box>
                                            }

                                        </>
                                    )}
                                </div>

                            ))}
                        </>
                    }


                    {!addingProduct &&
                        <div className='btnwrap'>
                            <Button icon={PlusIcon} variant="primary" onClick={handleAddNewgroup}>
                                Add new group
                            </Button>
                        </div>
                    }

                    {showProductGroupForm &&
                        <>
                            <InlineGrid columns={['twoThirds', 'oneThird']} alignItems="center">
                                <Box>
                                    <TextField
                                        label="Group name"
                                        value={groupName}
                                        onChange={handleInputChange}
                                        autoComplete="off"
                                        placeholder="Enter group name"
                                        fullWidth
                                    />
                                </Box>
                                <Box style={{ marginLeft: '10px' }} >
                                    <Text>Products</Text>
                                    <Button variant="primary" onClick={handleShowProductsModal} >Select products</Button>
                                </Box>

                            </InlineGrid>
                            {allSelectedProducts.length > 0 &&
                                <>
                                    <InlineGrid gap="400" columns={['twoThirds', 'oneThird']} alignItems="center">
                                        <InlineStack alignment="center" spacing="tight">
                                            <Text variant="headingSm" element="h3" style={{ flex: 1 }}>Product</Text>
                                        </InlineStack>
                                        <InlineStack align="end" spacing="tight">
                                            <Text variant="headingSm" element="h3" style={{ flex: 1 }}>Remove</Text>
                                        </InlineStack>

                                    </InlineGrid>
                                    <ResourceList
                                        resourceName={{ singular: 'product', plural: 'products' }}
                                        items={allSelectedProducts}
                                        renderItem={(product, index) => {
                                            const { product_id, product_title, product_image } = product;
                                            const media = <Thumbnail source={product_image} alt={product_title} />;

                                            return (
                                                <ResourceItem id={product_id} media={media}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Text variation="strong">{product_title}</Text>

                                                        <Link
                                                            removeUnderline={true}
                                                            url="#"
                                                            onClick={(event) => {
                                                                event.preventDefault();
                                                                deleteSelectedEditProducts(product_id);
                                                            }}
                                                        >
                                                            <Icon
                                                                source={XIcon}
                                                                tone="critical"
                                                            />
                                                        </Link>
                                                    </div>
                                                </ResourceItem>
                                            );
                                        }}
                                    />
                                </>

                            }
                            <div className='btnwrap'>
                                <Button variant="primary" onClick={cancelProductGroupFrom} >Cancel</Button>
                                <Button variant="primary" onClick={saveProductsGroup} >Save Group</Button>
                            </div>
                        </>
                    }

                </BlockStack>
            </Card >

            <Modal onHide={handleCloseModal} id="select-product-modal">
                <TitleBar title="Add products">
                    <button variant="primary" onClick={submitProducts} disabled={selectedProducts.length === 0}>
                        Add
                    </button>
                    <button onClick={() => shopify.modal.hide('select-product-modal')}>Close</button>
                </TitleBar>
                <Box padding="400" style={{ height: '400px' }}>
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
                        <div>
                            <ResourceList
                                resourceName={{ singular: 'product', plural: 'products' }}
                                items={products}
                                renderItem={(product) => {
                                    const { product_id } = product;

                                    // Create a click handler to toggle the checkbox
                                    const handleProductClick = () => {
                                        handleCheckboxChange(product_id);
                                    };

                                    return (
                                        <ResourceItem product_id={product_id}>
                                            {/* Wrap the entire product item with a click handler */}
                                            <div
                                                onClick={handleProductClick}
                                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} // Set cursor to pointer for better UX
                                            >
                                                <div>
                                                    {/* Prevent checkbox click from bubbling up to the parent div */}
                                                    <Checkbox
                                                        value={product_id}
                                                        checked={selectedProducts.includes(product_id)}
                                                        // onChange={() => handleCheckboxChange(product_id)}
                                                        id={`product-checkbox-${product_id}`}
                                                        onClick={(e) => e.stopPropagation()} // Prevent event from bubbling
                                                    />
                                                </div>
                                                <Thumbnail size="small" source={product.product_image} alt={product.product_title} />
                                                <span style={{ marginLeft: '10px' }}>{product.product_title}</span>
                                            </div>
                                        </ResourceItem>
                                    );
                                }}
                            />
                        </div>
                    )}
                </Box>
            </Modal>


            <Modal id="delete-product-group-modal">
                <TitleBar title="Delete product group">
                    <button tone="critical" variant="primary" onClick={deleteProductGroups} >
                        Delete
                    </button>
                    <button onClick={() => shopify.modal.hide('delete-product-group-modal')}>Cancel</button>
                </TitleBar>
                <Box padding="400">
                    <BlockStack gap="400">
                        <Text variant="headingXl" as="h4" style={{ marginBottom: "10px" }}>
                            Are you sure that you want to delete this group?
                        </Text>
                        <Text>
                            <strong>Warning: </strong>This action is irreversible, and this group will not be accessible again.
                        </Text>
                    </BlockStack>
                </Box>
            </Modal>

        </>
    );
}


const getShopifyProducts = async (shopId, searchTitle) => {
    try {
        const customParams = {
            shopId: shopId,
            searchTitle: searchTitle,
            actionType: "customProducts",
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

