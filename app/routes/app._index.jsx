import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
import { useActionData, useNavigation, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  Grid,
  LegacyCard
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import Breadcrumb from "./components/Breadcrumb";
import bannerImage from "./../images/medium-shot-young-people-with-reviews.jpg"
import { Dropdown, DropdownButton, Image } from 'react-bootstrap';

import ReviewRequestsSentIcon from "./components/icons/ReviewRequestsSentIcon";
import PhotoVideoReviewsIcon from "./components/icons/PhotoVideoReviewsIcon";
import UpsellsDashIcon from "./components/icons/UpsellsDashIcon";
import StoreVisitsIcon from "./components/icons/StoreVisitsIcon";
import SharesDashIcon from "./components/icons/SharesDashIcon";
import ReviewsCollectedIcon from "./components/icons/ReviewsCollectedIcon";
import OrdersDashIcon from "./components/icons/OrdersDashIcon";
import ImpressionsDashIcon from "./components/icons/ImpressionsDashIcon";
import InfoFillIcon from "./components/icons/InfoFillIcon";


export const loader = async ({ request }) => {
  await authenticate.admin(request);
  //const { admin } = await authenticate.admin(request);
  //const response = admin.rest.get({path: 'shop'});
  return null;
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const variantId =
    responseJson.data.productCreate.product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
      mutation shopifyRemixTemplateUpdateVariant($input: ProductVariantInput!) {
        productVariantUpdate(input: $input) {
          productVariant {
            id
            price
            barcode
            createdAt
          }
        }
      }`,
    {
      variables: {
        input: {
          id: variantId,
          price: Math.random() * 100,
        },
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantUpdate.productVariant,
  });
};

export default function Index() {
  const nav = useNavigation();
  const actionData = useActionData();
  const submit = useSubmit();
  const isLoading =
    ["loading", "submitting"].includes(nav.state) && nav.formMethod === "POST";
  const productId = actionData?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId]);
  const generateProduct = () => submit({}, { replace: true, method: "POST" });
  const [crumbs, setCrumbs] = useState([
    
  ]);

	const [daystitle, setDaystitle] = useState('30 days');

	const titles = {
		days7: '7 days',
		days14: '14 days',
		days30: '30 days',
		days60: '60 days',
		days90: '90 days',
		daysall: 'All time',
	};
	const handleSelect = (eventKey) => {
		setDaystitle(titles[eventKey]);
	};


  	return (
		<>
			<Page fullWidth>
				<Breadcrumb crumbs={crumbs}/>
			</Page>
			<div className="dashboardwrap max1048 mx-auto">
				
				<div className="dashalertbox">
					<div className="logobox flxfix">Logo</div>
					<div className="detailbox flxflexi flxcol">
						<h4>Our Software is here to help you jump-start your business!</h4>
						<p>Enjoy free access to Loox while the store is password protected on your Shopify trial.</p>
					</div>
					<div class="closebtn">
						<a href="#"><i class="twenty-closeicon"></i></a>
					</div>
				</div>
				<div className="dashbbanner">
					<div className="detailbox flxflexi">
						<h2>Ensure your best reviews get seen</h2>
						<p>Use the pop-up widget to build trust faster by making sure your reviews are never missed</p>
						<div className="btnwrap">
							<a href="#" className="revbtn smbtn">Add a pop-up</a>
						</div>
					</div>
					<div className="imagebox flxfix">
						<Image src={bannerImage} />
					</div>
				</div>

				<div className="dashdatawrap">
					<div className="maintitle">
						<h2>Performance Overview</h2>
						<div className="rightbox dropdownwrap ms-auto ddverylightbtn">
							<DropdownButton
								id="dropdown-basic-button"
								title={daystitle}
								align={'end'}
								onSelect={handleSelect}
							>
								{Object.entries(titles).map((title, i)=>{
									return (
										<Dropdown.Item eventKey={title[0]} className="custom-dropdown-item">{title[1]}</Dropdown.Item>
									)
								})}
							</DropdownButton>
						</div>
					</div>
					<div className="dashstetesticsbox">
						<div className="titlebox">
							<h3>Reviews</h3>
							<div className="btnwrap m-0 ms-auto">
								<a href="#" className="revbtn plainlink">Manage reviews <i className="twenty-arrow-right"></i></a>
							</div>
						</div>
						<div className="numberboxwrap">
							<div className="numberbox">
								<div className="iconbox flxfix">
									<ReviewRequestsSentIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Review Requests Sent</p>
								</div>
							</div>
							<div className="numberbox">
								<div className="iconbox flxfix">
									<ReviewsCollectedIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Review Requests Sent</p>
								</div>
							</div>
							<div className="numberbox">
								<div className="iconbox flxfix">
									<PhotoVideoReviewsIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Photo/Video Reviews</p>
								</div>
							</div>
						</div>
						<div className="revenuebox">
							<p><strong>$00</strong> Reviews-Generated Revenue</p>
							<a href="#" className="infolink">
								<InfoFillIcon />
							</a>
						</div>
					</div>
					<div className="dashstetesticsbox">
						<div className="titlebox">
							<h3>Referrals</h3>
							<div className="btnwrap m-0 ms-auto">
								<a href="#" className="revbtn plainlink">Manage referrals <i className="twenty-arrow-right"></i></a>
							</div>
						</div>
						<div className="numberboxwrap">
							<div className="numberbox">
								<div className="iconbox flxfix">
									<SharesDashIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Shares</p>
								</div>
							</div>
							<div className="numberbox">
								<div className="iconbox flxfix">
									<StoreVisitsIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Store Visits</p>
								</div>
							</div>
							<div className="numberbox">
								<div className="iconbox flxfix">
									<OrdersDashIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Orders</p>
								</div>
							</div>
						</div>
						<div className="revenuebox">
							<p><strong>$00</strong> Referrals-Generated Revenue</p>
							<a href="#" className="infolink">
								<InfoFillIcon />
							</a>
						</div>
					</div>
					<div className="dashstetesticsbox">
						<div className="titlebox">
							<h3>Upsells</h3>
							<div className="btnwrap m-0 ms-auto">
								<a href="#" className="revbtn blueblacklightbtn bigbtn"><i className="twenty-Info_icon"></i> Complete Setup</a>
							</div>
						</div>
						<div className="numberboxwrap">
							<div className="numberbox">
								<div className="iconbox flxfix">
									<ImpressionsDashIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Impressions</p>
								</div>
							</div>
							<div className="numberbox">
								<div className="iconbox flxfix">
									<UpsellsDashIcon />
								</div>
								<div className="detailbox flxflexi">
									<h3>00</h3>
									<p>Upsells</p>
								</div>
							</div>
						</div>
						<div className="revenuebox">
							<p><strong>$00</strong> Upsells-Generated Revenue</p>
							<a href="#" className="infolink">
								<InfoFillIcon />
							</a>
						</div>
					</div>

				</div>

			</div>
		</>
  	);
}
