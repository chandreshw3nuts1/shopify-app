
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import MasonryLayout from './ResponsiveMasonry';

const ProductReviewWidgetModal = ({ show, handleClose, documentObj, shopRecords, getPreviewText, currentLanguage, translator }) => {

    let headerTextColor, buttonBorderColor, buttonTitleColor, buttonBackgroundOnHover, buttonTextOnHover, buttonBackground, starsBarBackground, starsBarFill = "";

    if (documentObj.widgetColor == 'custom') {
        headerTextColor = documentObj.headerTextColor;
        buttonBorderColor = `1px solid ${documentObj.buttonBorderColor}`;
        buttonTitleColor = documentObj.buttonTitleColor;
        buttonBackground = documentObj.buttonBackground;

        buttonBackgroundOnHover = documentObj.buttonBackgroundOnHover;
        buttonTextOnHover = documentObj.buttonTextOnHover;
        starsBarBackground = documentObj.starsBarBackground;
        starsBarFill = documentObj.starsBarFill;
    } else if (documentObj.widgetColor == 'white') {
        headerTextColor = '#ffffff';
        buttonBorderColor = `1px solid #ffffff`;
        // buttonTitleColor = '#ffffff';
        // buttonBackground = '#000000';
        buttonTextOnHover = '#000000';

    }
    let reviewWidgetLayoutWidth = "100%";
    let gridClassName = 'full-grid';
    if (documentObj.widgetLayout == 'grid') {
        reviewWidgetLayoutWidth = "33.33%";
        gridClassName = 'grid-four-column';
    } else if (documentObj.widgetLayout == 'compact') {
        reviewWidgetLayoutWidth = "50%";
        gridClassName = 'grid-two-column';
    }



    const minimalHeader = documentObj.headerLayout === 'minimal';
    const compactHeader = documentObj.headerLayout === 'compact';
    const expandedHeader = documentObj.headerLayout === 'expanded';

    return (
        <>
            <style>
                {`
                    .custombtn:hover {
                        background-color: ${buttonBackgroundOnHover} !important;
                        color : ${buttonTextOnHover} !important;
                    }
					.review_top_actions .stardetaildd .stardetailrow .processbar .activebar {
						background-color: ${starsBarFill} !important;
					}

					.review_top_actions .stardetaildd .stardetailrow .processbar {
						background-color: ${starsBarBackground} !important;
					}

					.w3grid-review-item {
						width: ${reviewWidgetLayoutWidth};
						margin : 24px 0 0 0;
						padding: 0;
						box-sizing: border-box;
					}
					.w3grid-review-item.grid-two-column,
					.w3grid-review-item.grid-four-column { padding: 0 12px;}


				`}
            </style>

            <Modal show={show} onHide={handleClose} size="xl" backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>W3nuts Preview </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={` review_top_actions ${minimalHeader ? 'minimalheader' : 'otherheaderlayout'} ${compactHeader ? 'compactheader' : ''} ${expandedHeader ? 'expandedheader' : ''}`} >
                        <div className={`left_actions flxfix ${minimalHeader ? '' : 'sidebyside'}`}>
                            <div className="leftpart">
                                <div className="section_title" style={{ color: headerTextColor }}>{getPreviewText('reviewHeaderTitle', currentLanguage)}</div>
                                {!minimalHeader &&
                                    <div className="bigcountavarage flxrow">
                                        <i className='rating-star-rounded'></i>
                                        <div className="averagetext" style={{ color: headerTextColor }}>4.7</div>
                                    </div>
                                }
                                {!minimalHeader &&
                                    <div className="totalreviewcount" style={{ color: headerTextColor }}>
                                        <span>5</span> {getPreviewText('reviewPlural', currentLanguage)}
                                    </div>
                                }
                            </div>
                            <div className="rightpart">
                                {!minimalHeader && (
                                    documentObj.showRatingsDistribution &&
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
                                )

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
                                                <div className='ratingcount' style={{ color: headerTextColor }}>4 {translator('out_of')} <span>5</span></div>
                                                {documentObj.showRatingsDistribution &&
                                                    <div className="arrowright" style={{ color: headerTextColor }}>
                                                        <i className='twenty-arrow-down'></i>
                                                    </div>
                                                }

                                            </Dropdown.Toggle>
                                            {documentObj.showRatingsDistribution &&
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
                                            }
                                        </Dropdown>
                                    </div>
                                }
                            </div>
                            {minimalHeader &&
                                <div className="totalreviewcount" style={{ color: headerTextColor }}>
                                    <span>5</span> {getPreviewText('reviewPlural', currentLanguage)}
                                </div>
                            }
                        </div>
                        <div className="right_actions btnwrap flxflexi flxrow justify-content-end">
                            {documentObj.showSortingOptions &&
                                <Dropdown>
                                    <Dropdown.Toggle variant="" className='revbtn custombtn lightbtn wbigbtn noafter' id="dropdown-basic" style={{ border: buttonBorderColor, color: buttonTitleColor, backgroundColor: buttonBackground }}>
                                        <i className='twenty-filtericon'></i>
                                        {translator('sort_by')}
                                        <div className="arrowright">
                                            <i className='twenty-arrow-down'></i>
                                        </div>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu align={'end'}>
                                        <li><a className="dropdown-item sort_by_filter" data-sort="tag_as_feature" href="#">{translator('featured')}</a></li>
                                        <li><a className="dropdown-item sort_by_filter" data-sort="newest" href="#">{translator('newest')}</a></li>
                                        <li><a className="dropdown-item sort_by_filter" data-sort="highest_ratings" href="#">{translator('highest_rating')} </a></li>
                                        <li><a className="dropdown-item sort_by_filter" data-sort="lowest_ratings" href="#">{translator('lowest_rating')} </a></li>
                                        <input type="hidden" id="sort_by_filter" />
                                    </Dropdown.Menu>
                                </Dropdown>
                            }
                            {documentObj.writeReviewButton == "show" && <button className="revbtn wbigbtn custombtn" style={{ border: buttonBorderColor, color: buttonTitleColor, backgroundColor: buttonBackground }} id="show_create_review_modal">{getPreviewText('writeReviewButtonTitle', currentLanguage)}</button>}
                        </div>
                    </div>
                    <div className='main_review_block'>
                        <div className='frontreviewbox'>
                            <MasonryLayout documentObj={documentObj} shopRecords={shopRecords} gridClassName={gridClassName} getPreviewText={getPreviewText} currentLanguage={currentLanguage} translator={translator} />



                        </div>
                    </div>

                </Modal.Body>
            </Modal>
        </>

    );

}

export default ProductReviewWidgetModal;
