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

const RenameChannelForm = ({ channelsNames, channel }) => {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const api = useApi();
  const [t] = useTranslation();

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const RenameChannelSchema = Yup.object().shape({
    name: Yup.mixed()
      .notOneOf(channelsNames, 'duplicatedChannel')
      .required('required'),
  });

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: RenameChannelSchema,
    onSubmit: (values) => {
      try {
        api.renameChannel(channel.id, values.name);
        dispatch(closeModal());
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <InputGroup>
        <Form.Control
          data-testid="rename-channel"
          onChange={formik.handleChange}
          value={formik.values.name}
          name="name"
          id="name"
          ref={inputRef}
          isInvalid={formik.touched.name && formik.errors.name}
        />
        <Form.Control.Feedback type="invalid">
          {formik.touched.name && formik.errors.name
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

const RenameChannel = ({ channelsNames, channel }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  return (
    <Modal centered show onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.renameHeader')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <RenameChannelForm channelsNames={channelsNames} channel={channel} />
      </Modal.Body>
    </Modal>
  );
};

export default RenameChannel;
