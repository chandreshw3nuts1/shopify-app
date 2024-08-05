import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

import {
    Card,
    Select,
    TextField
} from '@shopify/polaris';
import settingsJson from './../../../utils/settings.json';


export default function DiscountPhotoVideoReview({ reviewRequestTimingSettings, shopRecords }) {
    
    return (
        <div className='row'>
            <div className='col-md-12'>
                <div className='collectreviewformbox'>
                    <Card>
                        <div className='reviewtiming_wrap'>
                            <div className='form-group m-0'>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        name="is_different_timing"
                                        id="EnableDiscountForPhotoVideo"
                                    />
                                    <label
                                        className="form-check-label"
                                        htmlFor="EnableDiscountForPhotoVideo"
                                    >
                                        Enable discount for photo/video
                                    </label>
                                </div>
                            </div>
                            <div className='whitebox flxcol gapy24'>
                                <div className='form-group m-0 flxrow gapx24'>
                                    <div className='checkbutton'>
                                        <input type='radio' id='SameDiscount' name='discounttype' value="SameDiscount" checked />
                                        <label htmlFor="SameDiscount">
                                            <h6>Same discount</h6>
                                            <p>Incentivize customers to leave a photo/video review by offering a discount for their next purchase</p>
                                        </label>
                                    </div>
                                    <div className='checkbutton'>
                                        <input type='radio' id='FullFillment' name='discounttype' value="FullFillment" />
                                        <label htmlFor="FullFillment">
                                            <h6>Fullfillment</h6>
                                            <p>Incentivize customers to leave a photo/video review by offering a discount for their next purchase</p>
                                        </label>
                                    </div>
                                </div>
                                <div className='form-group m-0 horizontal-form align-items-center gapx24'>
                                    <label htmlFor="" className='w-auto'>Discount amount</label>
                                    <div className='dollerandpersantage gapx24'>
                                        <div className='radiowrapdis flxrow'>
                                            <div className='radiocolumn'>
                                                <input type="radio" name='discountamount' value="amountpersantage" id='amountpersantage' checked />
                                                <label htmlFor="amountpersantage">%</label>
                                            </div>
                                            <div className='radiocolumn'>
                                                <input type="radio" name='discountamount' value="amountdoller" id='amountdoller' />
                                                <label htmlFor="amountdoller">$</label>
                                            </div>
                                        </div>
                                        <div className='inputwrap'>
                                            <input type='text' className='input_text' placeholder='Amount' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='whitebox flxcol gapy24'>
                                <div className='form-group m-0 flxrow gapx24'>
                                    <div className='checkbutton'>
                                        <input type='radio' id='autogenerate' name='discounttypesecond' value="autogenerate" checked />
                                        <label htmlFor="autogenerate">
                                            <h6>Auto-generate</h6>
                                            <p>A one time use code for each review</p>
                                        </label>
                                    </div>
                                    <div className='checkbutton'>
                                        <input type='radio' id='discountcode' name='discounttypesecond' value="discountcode" />
                                        <label htmlFor="discountcode">
                                            <h6>Single Shopify discount code</h6>
                                            <p>Same code for all customers</p>
                                        </label>
                                    </div>
                                </div>
                                <div className='form-group m-0 horizontal-form align-items-center gapx24'>
                                    <label htmlFor="" className='w-auto'>Discount expires after</label>
                                    <div className='col-lg-3'>
                                        <select id="" className="input_text">
                                            <option value="">Never</option>
                                            <option value="7">7 Days</option>
                                            <option value="14">14 Days</option>
                                            <option value="21">21 Days</option>
                                            <option value="30">30 Days</option>
                                            <option value="60">60 Days</option>
                                            <option value="90">90 Days</option>
                                            <option value="180">180 Days</option>
                                            <option value="365">365 Days</option>
                                        </select>
                                    </div>
                                </div>
                                <div className='form-group m-0 horizontal-form alightop align-items-start gapx24'>
                                    <label htmlFor="" className='w-auto'>Insert code</label>
                                    <div className='col-lg-3'>
                                        <input type='text' id="" className="input_text" placeholder='(e.g. PHOTO-REVIEW)' />
                                        <div className='inputnote'>First create the discount on Shopify and then add here</div>
                                    </div>
                                    <div className='btnwrap m-0'>
                                        <a href="#" className='revbtn regularbtn'>Validate</a>
                                    </div>
                                </div>
                            </div>
                            <div className='form-group m-0 horizontal-form align-items-center gapx24'>
                                <label htmlFor="" className='w-auto'>Offer to reviewers from</label>
                                <div className='col-lg-3'>
                                    <select id="" className="input_text">
                                        <option value="">On-site & review requests</option>
                                        <option value="">Review requests only</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>


        </div>
    );
}