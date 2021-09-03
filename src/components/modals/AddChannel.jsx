import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  const [t] = useTranslation();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const AddChannelSchema = Yup.object().shape({
    name: Yup.mixed()
      .notOneOf(channelsNames, 'duplicatedChannel')
      .required('required'),
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
        <Modal.Title>
          {t('modal.addHeader')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <InputGroup>
            <Form.Control
              data-testid="add-channel"
              onChange={formik.handleChange}
              value={formik.values.name}
              name="name"
              id="name"
              ref={inputRef}
              isInvalid={formik.touched.name && formik.errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {formik.touched.name && formik.errors.name
                ? t(`errors.${formik.errors.username}`)
                : null}
            </Form.Control.Feedback>
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          {t('modal.cancel')}
        </Button>
        <Button disabled={formik.isSubmitting} variant="primary" onClick={formik.handleSubmit}>
          {t('modal.submit')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
