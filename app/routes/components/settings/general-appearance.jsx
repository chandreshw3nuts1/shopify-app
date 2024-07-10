import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import {
	Card,
	Select,
	TextField
} from '@shopify/polaris';
import {getUploadDocument} from '../../../utils/documentPath';
import { Dropdown, DropdownButton, Modal, Button } from 'react-bootstrap';

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

	const [selectedOption, setSelectedOption] = useState('rating-star-rounded');

	const ratingIcons = [
		'rating-star-rounded',
		'rating-star-sq',
		'rating-babycloth',
		'rating-basket',
		'rating-bones',
		'rating-coffee-cup',
		'rating-crisamas-cap',
		'rating-diamond-front',
		'rating-diamond-top',
		'rating-dogs-leg',
		'rating-fire-flame',
		'rating-flight',
		'rating-food',
		'rating-graduation-cap',
		'rating-heart-round',
		'rating-heart-sq',
		'rating-leaf-canada',
		'rating-leaf-normal',
		'rating-like-normal',
		'rating-like-rays',
		'rating-pet-house',
		'rating-plant',
		'rating-shirt',
		'rating-shopping-bag1',
		'rating-shopping-bag2',
		'rating-shopping-bag3',
		'rating-star-rays',
		'rating-sunglass',
		'rating-tea-cup',
		'rating-trophy-1',
		'rating-trophy-2',
		'rating-trophy-3',
		'rating-tshirt',
		'rating-wine',
	]
	

	return (
		<div className='row'>
			<div className='col-md-6'>
				<div className='whitebox h-100'>
					<div className='form-group m-0'>
						<label htmlFor="">Logo</label>
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
					</div>
				</div>
			</div>
			<div className='col-md-6'>
				<div className='whitebox flxcol h-100'>
					<div className='form-group m-0'>
						<label htmlFor="">Corner radius</label>
						<select name="" id="" className='input_text'>
							<option value="">Sharp</option>
							<option value="">Slightly Rounded</option>
							<option value="">Rounded</option>
							<option value="">Extra Rounded</option>
						</select>
					</div>
					<div className='form-group m-0'>
						<label htmlFor="">Rating icon</label>
						<div className='input_wrap flxrow'>
							<div className='iconbox flxfix'>
								<div className='starlightdd'>
									<DropdownButton id="dropdown-basic-button" className={''} title={<i className={selectedOption}></i>}>
										{ratingIcons.map((icon, i)=>(
											<Dropdown.Item eventKey={`rating-${i}`} key={i+1} onClick={()=>{setSelectedOption(icon)}} className="custom-dropdown-item">
												<i className={icon}></i>
											</Dropdown.Item>
										))}
									</DropdownButton>
								</div>
							</div>
							<div className='colorbox flxflexi'>asd</div>
						</div>
					</div>
					<div className='form-group m-0'>
						<label htmlFor="">Widgets font</label>
						<select name="" id="" className='input_text'>
							<option value="">Roboto</option>
							<option value="">Open sans</option>
							<option value="">Barlow</option>
							<option value="">Manrope</option>
						</select>
					</div>
					<div className='form-group m-0'>
						<label htmlFor="">w3review branding</label>
						<select name="" id="" className='input_text'>
							<option value="">Shown</option>
							<option value="">Hide</option>
						</select>
					</div>
				</div>
			</div>
		</div>
	);
}