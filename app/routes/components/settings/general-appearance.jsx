import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
	Card,
	Select,
	TextField
} from '@shopify/polaris';
import {getUploadDocument} from './../../../utils/documentPath';


export default function GeneralAppearance({ shopRecords,generalAppearances }) {
	const [imageLogo, setImageLogo] = useState(getUploadDocument(generalAppearances?.logo, 'logo'));



    async function handleChangeLogo(e) {
		const file = e.target.files[0];

        setImageLogo(URL.createObjectURL(e.target.files[0]));

		const formData = new FormData();
		formData.append("logo", file);
		formData.append("actionType", "uploadLogo");
		formData.append("shop_domain", shopRecords.shop);
		
		try {
			const response = await fetch(`/api/branding`, {
				method: 'POST',
				body: formData
			});
			const data = await response.json();
			if (data.status == 200) {
				toast.success(data.message);
			} else {
				toast.error(data.message);
			}	
	
		} catch (error) {
			console.error('Error uploading image:', error);
		}

    }

	async function deleteLogo() {

		try {

			const formData = new FormData();
			formData.append("actionType", "deleteLogo");
			formData.append("shop_domain", shopRecords.shop);
			
			const response = await fetch(`/api/branding`, {
				method: 'DELETE',
				body: formData
			});
			const data = await response.json();
			if (data.status == 200) {
				toast.success(data.message);
				setImageLogo('');

			} else {
				toast.error(data.message);
			}
		} catch (error) {
			console.error('Error uploading image:', error);
		}

    }

	

	return (
		<div className='row'>
			<div className='col-md-6'>
				<div className='collectreviewformbox'>
					<Card>
						<input
							className="form-control"
							onChange={handleChangeLogo}
							type="file"
							name="logo"
							id="flexSwitchCheckChecked"
						/>
						<img src={imageLogo} alt="" />
						<button onClick={deleteLogo}>
                            <i className='twenty-closeicon'></i>
                        </button>
					</Card>
				</div>
			</div>

		</div>
	);
}