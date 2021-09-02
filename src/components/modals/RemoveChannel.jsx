import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const [t] = useTranslation();
  const [isSubmitting, setSubmitting] = useState(false);
  const handleRemoveChannel = () => {
    setSubmitting(true);
    api.removeChannel(channel.id);
    dispatch(closeModal());
  };

  return (
    <Modal centered show onHide={() => dispatch(closeModal())}>
      <Modal.Header closeButton>
        <Modal.Title>{t('modal.removeHeader')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {t('modal.removeBody')}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => dispatch(closeModal())}>
          {t('modal.cancel')}
        </Button>
        <Button disabled={isSubmitting} variant="danger" onClick={handleRemoveChannel}>
          {t('modal.submit')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
