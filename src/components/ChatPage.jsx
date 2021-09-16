import React, { useEffect, useState } from 'react';
import {
  Row,
  Spinner,
} from 'react-bootstrap';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setChannelsData } from '../slices/channelsSlice.js';
import routes from '../routes.js';
import useAuth from '../hooks/useAuth.jsx';
import getModal from './modals/index.js';
import ChatBox from './ChatBox.jsx';

const Modal = ({
  modalType, channel, channelsNames, username,
}) => {
  const ModalComponent = getModal(modalType);
  return ModalComponent
    ? (
      <ModalComponent
        modalType={modalType}
        channel={channel}
        username={username}
        channelsNames={channelsNames}
      />
    )
    : null;
};

const LoadingSpinner = () => (
  <Row className="h-100 align-items-center justify-content-center">
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </Row>
);

const ChatPage = () => {
  const dispatch = useDispatch();
  const auth = useAuth();
  const username = auth.getUsername();

  const [loadingStatus, setLoadingStatus] = useState(null);

  const channels = useSelector((state) => state.channelsData.channels);
  const channelsNames = channels.map((c) => c.name);
  const modalType = useSelector((state) => state.modalInfo.modalType);
  const managedChannel = useSelector((state) => state.modalInfo.managedChannel);

  useEffect(() => {
    const fetchContent = async () => {
      setLoadingStatus('loading');
      try {
        const { data } = await axios.get(routes.dataPath(), { headers: auth.getAuthHeader() });
        data.username = username;
        dispatch(setChannelsData(data));
        setLoadingStatus('finished');
      } catch (err) {
        setLoadingStatus('failed');
        console.error('Network error');
      }
    };

    fetchContent();
  }, []);

  return loadingStatus === 'loading'
    ? <LoadingSpinner />
    : (
      <>
        <ChatBox />

        <Modal
          modalType={modalType}
          username={username}
          channel={managedChannel}
          channelsNames={channelsNames}
        />
      </>
    );
};

export default ChatPage;
