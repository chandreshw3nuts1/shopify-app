import { useEffect, useState, useRef } from "react";
import Breadcrumb from "./components/Breadcrumb";
import SettingPageSidebar from "./components/headerMenu/SettingPageSidebar";
import axios from 'axios';

// import ColorPicker from "./components/svgIconPicker";
import { json } from "@remix-run/node";

import {
  Layout,
  Page,
  LegacyCard,
  Spinner,
  Card,Select, TextField, Button, FormLayout
} from "@shopify/polaris";

export async function loader({request}) {
	try {
	  
		return json({});
	  } catch (error) {
		console.error('Error fetching manage review:', error);
		return json({ error: 'Error fetching manage review' }, { status: 500 });
	}

}

export default function Branding() {
	const [crumbs, setCrumbs] = useState([
		{"title" : "Review", "link" :"./../review"},
		{"title" : "Manage Review", "link" :""}
	]);

	const [imageLogo, setImageLogo] = useState();
    function handleChange(e) {

        setImageLogo(URL.createObjectURL(e.target.files[0]));

		const formData = new FormData();
		formData.append("file", e.target.files[0]);

		axios.post('/api/uploadImage', formData, {
			headers: {
			  'Content-Type': 'multipart/form-data'
			}
		}).then(response => {
		})
		.catch(error => {
			console.error('Error uploading image:', error);
		});
    }
  return (
	<>
	<Page fullWidth>
		<Breadcrumb crumbs={crumbs}/>
	</Page>
	<Page fullWidth>
		<div className="row">
			<div className="col-sm-3">
				<SettingPageSidebar />
			</div>
			<div className="col-sm-9">
				<Layout.Section>
					<LegacyCard sectioned>
						{/* <ColorPicker/> */}
					<h2>Add Image:</h2>
					<input type="file" onChange={handleChange} />
					<img src={imageLogo} />
					</LegacyCard>
				</Layout.Section>
			</div>
		</div>

	</Page>
    </>
    
  );
}
