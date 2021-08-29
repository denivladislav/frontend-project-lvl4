import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import useApi from '../../hooks/useApi.jsx';
import { closeModal } from '../../slices/modalSlice.js';

export default ({ channel }) => {
  const dispatch = useDispatch();
  const api = useApi();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    onSubmit: (values) => {
      api.renameChannel(channel.id, values.name);
      dispatch(closeModal());
    },
  });

  return (
    <Modal centered show onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Rename Channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup>
            <Form.Control
              onChange={formik.handleChange}
              value={formik.values.name}
              name="name"
              id="name"
              required
              ref={inputRef}
            />
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          Close
        </Button>
        <Button disabled={formik.isSubmitting} variant="primary" onClick={formik.handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
