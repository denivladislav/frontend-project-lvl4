import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Button,
} from 'react-bootstrap';
import useApi from '../../hooks/useApi.jsx';
import { closeModal } from '../../slices/modalSlice.js';

export default ({ channel }) => {
  const dispatch = useDispatch();
  const api = useApi();
  const [isSubmitting, setSubmitting] = useState(false);
  const handleRemoveChannel = () => {
    setSubmitting(true);
    api.removeChannel(channel.id);
    dispatch(closeModal());
  };

  return (
    <Modal centered show onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Do you really want to delete channel?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          Close
        </Button>
        <Button disabled={isSubmitting} variant="danger" onClick={handleRemoveChannel}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
