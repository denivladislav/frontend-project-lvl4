import React from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { closeModal } from '../../slices/modalSlice.js';

export default () => {
  const dispatch = useDispatch();

  return (
    <Modal show onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          Close
        </Button>
        <Button variant="primary" onClick={() => dispatch(closeModal())}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
