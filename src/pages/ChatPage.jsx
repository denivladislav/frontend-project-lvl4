import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Row,
  Spinner,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatData } from '../slices/channelsSlice.js';
import useAuth from '../hooks/useAuth.jsx';
import getModal from '../components/modals/index.js';
import ChatBox from '../components/ChatBox.jsx';
import { selectChannelsNames } from '../selectors.js';
import { closeModal } from '../slices/modalSlice.js';

const Modal = ({ modalType, loadingStatus, managedChannel }) => {
  const dispatch = useDispatch();
  const onHide = () => dispatch(closeModal());
  const channelsNames = useSelector(selectChannelsNames);
  const ModalComponent = getModal(modalType);
  if (!ModalComponent) {
    return null;
  }
  return (
    <ModalComponent
      modalType={modalType}
      channel={managedChannel}
      channelsNames={channelsNames}
      loadingStatus={loadingStatus}
      onHide={onHide}
    />
  );
};

const LoadingSpinner = () => {
  const { t } = useTranslation();
  return (
    <Row className="h-100 align-items-center justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">{t('spinner.loading')}</span>
      </Spinner>
    </Row>
  );
};

const ChatPage = () => {
  const dispatch = useDispatch();
  const auth = useAuth();

  const username = auth.getUsername();
  const loadingStatus = useSelector((state) => state.channelsData.loadingStatus);
  const modalType = useSelector((state) => state.modalInfo.modalType);
  const managedChannel = useSelector((state) => state.modalInfo.managedChannel);

  useEffect(() => {
    dispatch(fetchChatData({ header: auth.getAuthHeader() }));
  }, []);

  if (loadingStatus === 'loading') {
    <LoadingSpinner />;
  }

  return (
    <>
      <ChatBox
        username={username}
        modalType={modalType}
      />

      <Modal
        modalType={modalType}
        loadingStatus={loadingStatus}
        managedChannel={managedChannel}
      />
    </>
  );
};

export default ChatPage;
