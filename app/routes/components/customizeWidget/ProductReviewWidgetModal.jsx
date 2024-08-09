
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
const ProductReviewWidgetModal = ({ show, handleClose }) => {


    return (
        <Modal show={show} onHide={handleClose} size="xl"  backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>title</Modal.Title>
            </Modal.Header>
            <Modal.Body>body</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );

}

export default ProductReviewWidgetModal;
