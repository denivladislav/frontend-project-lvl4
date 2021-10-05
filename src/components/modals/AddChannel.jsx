import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Button,
  Form,
  InputGroup,
  Col,
} from 'react-bootstrap';
import * as Yup from 'yup';
import useApi from '../../hooks/useApi.jsx';
import { closeModal } from '../../slices/modalSlice.js';

const AddChannelForm = ({ channelsNames }) => {
  const api = useApi();
  const inputRef = useRef();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const addChannelSchema = Yup.object().shape({
    name: Yup.mixed()
      .notOneOf(channelsNames, 'duplicatedChannel')
      .required('required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: addChannelSchema,
    onSubmit: (values) => {
      api.addChannel({ name: values.name });
      dispatch(closeModal());
    },
  });

  const isNameValid = !(formik.touched.name && formik.errors.name);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <InputGroup>
        <Form.Control
          data-testid="add-channel"
          onChange={formik.handleChange}
          value={formik.values.name}
          name="name"
          id="name"
          ref={inputRef}
          isInvalid={!isNameValid}
        />
        <Form.Control.Feedback type="invalid">
          {!isNameValid
            ? t(`errors.${formik.errors.name}`)
            : null}
        </Form.Control.Feedback>
      </InputGroup>
      <Col className="mt-2 text-end">
        <Button className="mx-2" variant="secondary" onClick={() => dispatch(closeModal())}>
          {t('modal.cancel')}
        </Button>
        <Button disabled={formik.isSubmitting} variant="primary" onClick={formik.handleSubmit}>
          {t('modal.submit')}
        </Button>
      </Col>
    </Form>
  );
};

const AddChannel = ({ channelsNames, onHide }) => {
  const { t } = useTranslation();

  return (
    <Modal centered show onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {t('modal.addHeader')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddChannelForm channelsNames={channelsNames} />
      </Modal.Body>
    </Modal>
  );
};

export default AddChannel;
