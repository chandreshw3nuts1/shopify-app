const VerifyTransparencyPopup = (props) => {
    return (
        <>
            <style>
                {`
                    .verify-transparency-popup-icon {
                        position: absolute;
                        top: 50px;
                        right: 40px;
                        background-color: #ffffff;
                        border: 1px solid #E3E4E5;
                        padding: 10px 12px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                        z-index: 100;
                        width :50%;
                        display:none;
                        max-width: 300px;
                    }
                    .verify-transparency-popup-icon p {
                        font-size: 13px;
                        color: #222222;
                        letter-spacing: 0;
                        margin: 0;
                        padding: 0;
                        font-weight: 500;
                    }
                    .verify-transparency-popup-icon p + p {
                        margin-top: 5px;
                    }

				`}
            </style>

            <div className="verify-transparency-popup-icon">
                {(props.shopRecords.is_enable_marked_verified_by_store_owner && props.reviewDetails.verify_badge) &&
                    <p>This review was marked as verified by the store owner.</p>
                }
                {(props.shopRecords.is_enable_review_written_by_site_visitor && !props.reviewDetails.is_imported) &&
                    <p>This review was written by a site visitor.</p>
                }
                {(props.shopRecords.is_enable_import_from_external_source && props.reviewDetails.is_imported) &&
                    <p>This review was was imported from an external source.</p>
                }
                {(props.shopRecords.is_enable_future_purchase_discount && props.reviewDetails.reviewDocuments.length > 0) &&
                    <p>This customer received a future purchase discount for adding a photo or a video to their review.</p>
                }
            </div>
        </>

    )
}

export default VerifyTransparencyPopup;