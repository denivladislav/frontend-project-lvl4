import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Button,
  Form,
  InputGroup,
} from 'react-bootstrap';
import * as Yup from 'yup';
import useApi from '../../hooks/useApi.jsx';
import { closeModal } from '../../slices/modalSlice.js';

export default ({ channelsNames, username }) => {
  const dispatch = useDispatch();
  const api = useApi();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const AddChannelSchema = Yup.object().shape({
    name: Yup.mixed()
      .notOneOf(channelsNames, 'This name already exists')
      .required('Channel name cannot be empty'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: AddChannelSchema,
    onSubmit: (values) => {
      try {
        api.addChannel({ name: values.name, username });
        dispatch(closeModal());
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });
  return (
    <Modal centered show onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>Add Channel</Modal.Title>
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
            <Form.Control.Feedback type="invalid">name already exists</Form.Control.Feedback>
          </InputGroup>
          {formik.errors.name && formik.touched.name
            ? (<div>{formik.errors.name}</div>)
            : null}
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
