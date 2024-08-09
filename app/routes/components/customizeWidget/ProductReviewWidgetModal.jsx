
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
const ProductReviewWidgetModal = ({ show, handleClose }) => {

    const minimalHeader = 'minimal';
    const compactHeader = 'compact';
    const expandedHeader = 'expanded';

    return (
        <Modal show={show} onHide={handleClose} size="xl"  backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>W3nuts Preview</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={`review_top_actions`}>
                    <div className={`left_actions flxfix`}>
                        <div className="leftpart">
                            <div className="section_title">asdasd</div>
                            {!minimalHeader &&
                                <div className="bigcountavarage flxrow">
                                    <i className='rating-star-rounded'></i>
                                    <div className="averagetext">4.7</div>
                                </div>
                            }
                            {!minimalHeader &&
                                <div className="totalreviewcount">
                                    <span>5</span> Reviews
                                </div>
                            }
                        </div>
                        <div className="rightpart">
                            {!minimalHeader &&
                                <div className="stardetaildd">
                                    <div className="stardetailrow flxrow">
                                        <div className="sratnumber">5</div>
                                        <div className="starsicons flxrow star-5">
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                        </div>
                                        <div className="processbar"><div className="activebar" style={{ width: `40%` }}></div></div>
                                        <div className="reviewgiven">(2)</div>
                                    </div>
                                    <div className="stardetailrow flxrow">
                                        <div className="sratnumber">4</div>
                                        <div className="starsicons flxrow star-4">
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                        </div>
                                        <div className="processbar"><div className="activebar" style={{ width: `20%` }}></div></div>
                                        <div className="reviewgiven">(1)</div>
                                    </div>
                                    <div className="stardetailrow flxrow">
                                        <div className="sratnumber">3</div>
                                        <div className="starsicons flxrow star-4">
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                        </div>
                                        <div className="processbar"><div className="activebar" style={{ width: `20%` }}></div></div>
                                        <div className="reviewgiven">(2)</div>
                                    </div>
                                    <div className="stardetailrow flxrow">
                                        <div className="sratnumber">2</div>
                                        <div className="starsicons flxrow star-4">
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                        </div>
                                        <div className="processbar"><div className="activebar" style={{ width: `0%` }}></div></div>
                                        <div className="reviewgiven">(0)</div>
                                    </div>
                                    <div className="stardetailrow flxrow">
                                        <div className="sratnumber">1</div>
                                        <div className="starsicons flxrow star-4">
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                        </div>
                                        <div className="processbar"><div className="activebar" style={{ width: `0%` }}></div></div>
                                        <div className="reviewgiven">(0)</div>
                                    </div>
                                </div>
                            }
                            {minimalHeader &&
                                <div className="star-rating">
                                    <Dropdown>
                                        <Dropdown.Toggle variant="" className='starbtn' id="dropdown-basic">
                                            <div className={`ratingstars flxrow star-4`}>
                                                <i className='rating-star-rounded'></i>
                                                <i className='rating-star-rounded'></i>
                                                <i className='rating-star-rounded'></i>
                                                <i className='rating-star-rounded'></i>
                                                <i className='rating-star-rounded'></i>
                                            </div>
                                            <div className='ratingcount'>4 out of <span>5</span></div>
                                            
                                                <div className="arrowright">
                                                    <i className='twenty-arrow-down'></i>
                                                </div>
                                            
                                        </Dropdown.Toggle>
                                        
                                            <Dropdown.Menu align={'start'}>
                                                <div className="stardetaildd">
                                                    <div className="stardetailrow flxrow">
                                                        <div className="sratnumber">5</div>
                                                        <div className="starsicons flxrow star-5">
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                        </div>
                                                        <div className="processbar"><div className="activebar" style={{ width: `40%` }}></div></div>
                                                        <div className="reviewgiven">(2)</div>
                                                    </div>
                                                    <div className="stardetailrow flxrow">
                                                        <div className="sratnumber">4</div>
                                                        <div className="starsicons flxrow star-4">
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                        </div>
                                                        <div className="processbar"><div className="activebar" style={{ width: `20%` }}></div></div>
                                                        <div className="reviewgiven">(1)</div>
                                                    </div>
                                                    <div className="stardetailrow flxrow">
                                                        <div className="sratnumber">3</div>
                                                        <div className="starsicons flxrow star-4">
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                        </div>
                                                        <div className="processbar"><div className="activebar" style={{ width: `20%` }}></div></div>
                                                        <div className="reviewgiven">(2)</div>
                                                    </div>
                                                    <div className="stardetailrow flxrow">
                                                        <div className="sratnumber">2</div>
                                                        <div className="starsicons flxrow star-4">
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                        </div>
                                                        <div className="processbar"><div className="activebar" style={{ width: `0%` }}></div></div>
                                                        <div className="reviewgiven">(0)</div>
                                                    </div>
                                                    <div className="stardetailrow flxrow">
                                                        <div className="sratnumber">1</div>
                                                        <div className="starsicons flxrow star-4">
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                            <div className='stardiv'><i className='rating-star-rounded'></i></div>
                                                        </div>
                                                        <div className="processbar"><div className="activebar" style={{ width: `0%` }}></div></div>
                                                        <div className="reviewgiven">(0)</div>
                                                    </div>
                                                </div>
                                                <input type="hidden" id="ratting_wise_filter" />
                                            </Dropdown.Menu>
                                        
                                    </Dropdown>
                                </div>
                            }
                        </div>
                        {minimalHeader &&
                            <div className="totalreviewcount">
                                <span>5</span> Reviews
                            </div>
                        }
                    </div>
                    <div className="right_actions btnwrap flxflexi flxrow justify-content-end">
                        <Dropdown>
                            <Dropdown.Toggle variant="" className='revbtn lightbtn wbigbtn noafter' id="dropdown-basic">
                                <i className='twenty-filtericon'></i>
                                short by
                                <div className="arrowright">
                                    <i className='twenty-arrow-down'></i>
                                </div>
                            </Dropdown.Toggle>
                            <Dropdown.Menu align={'end'}>
                                <li><a className="dropdown-item sort_by_filter" data-sort="tag_as_feature" href="#">Featured</a></li>
                                <li><a className="dropdown-item sort_by_filter" data-sort="newest" href="#">Newest</a></li>
                                <li><a className="dropdown-item sort_by_filter" data-sort="highest_ratings" href="#">Highest rating</a></li>
                                <li><a className="dropdown-item sort_by_filter" data-sort="lowest_ratings" href="#">Lowest rating</a></li>
                                <input type="hidden" id="sort_by_filter" />
                            </Dropdown.Menu>
                        </Dropdown>
                        <button className="revbtn wbigbtn" id="show_create_review_modal">Add review</button>
                    </div>
                </div>
                <div className='main_review_block'>
                    <div className='frontreviewbox'>
                        <div className='review-list-item'>
                            <div className='box-style custombg'>
                                <div className='review'>
                                    <div className='review_topbar flxrow'>
                                        <div className='mid_detail flxflexi' >
                                            <h4>John H</h4>
                                            <div className='date'>08/03/2024</div>
                                        </div>
                                        <div className='star_reviews flxfix'>
                                            <div className='star-rating'>
                                                <div className='ratingcount'>4.0</div>
                                                <div className='ratingstars flxrow star-4'>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                    <i className="rating-star-rounded"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='text_content'>
                                        <p>I have been using these industry leading headphones by Sony, colour Midnight Blue, and trust me i find them worth every penny spent. Yes, i agree these headphones are highly expensive, some may say you can purchase Apple Airpods, Boss, Sennheiser, and other audio equipment options, but trust me nothing beats these bad boys.</p>
                                    </div>
                                    <div className='text_content '>
                                        <p><strong>currentLanguage</strong> :  L / Blue</p>
                                    </div>
                                    <div className='text_content reply-text'>
                                        <p><strong>Name</strong> replied:</p>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                                    </div>
                                    <div className='review_bottomwrap'>
                                        <div className='product-container product-thumb-detail'>
                                            <div className='image flxfix'>
                                                <img src={``} alt="" />
                                            </div>
                                            <div className='text flxflexi'>
                                                <p>Sample Product</p>
                                            </div>
                                        </div>
                                        <div className='review_imageswrap flxrow'>
                                            <div className='imagebox'>
                                                <img src={``} alt="" />
                                            </div>
                                            <div className='imagebox'>
                                                <img src={``} alt="" />
                                            </div>
                                            <div className='imagebox'>
                                                <img src={``} alt="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal.Body>
        </Modal>
    );

}

export default ProductReviewWidgetModal;
