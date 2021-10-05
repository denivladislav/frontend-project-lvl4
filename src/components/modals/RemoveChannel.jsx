import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
  Modal,
  Button,
} from 'react-bootstrap';
import useApi from '../../hooks/useApi.jsx';
import { closeModal } from '../../slices/modalSlice.js';

const RemoveChannel = ({ channel, loadingStatus, onHide }) => {
  const dispatch = useDispatch();
  const api = useApi();
  const { t } = useTranslation();

  const handleRemoveChannel = () => {
    api.removeChannel(channel.id);
    dispatch(closeModal());
  };

  const loadingError = loadingStatus === 'error';

  return (
    <Modal centered show onHide={onHide}>
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
        <Button disabled={loadingError} variant="danger" onClick={handleRemoveChannel}>
          {t('modal.submit')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RemoveChannel;
