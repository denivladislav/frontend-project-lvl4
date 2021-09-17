import React, { useEffect } from 'react';
import {
  Row,
  Spinner,
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchChatData } from '../slices/channelsSlice.js';
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

  const loadingStatus = useSelector((state) => state.channelsData.status);
  const channels = useSelector((state) => state.channelsData.channels);
  const channelsNames = channels.map((c) => c.name);
  const modalType = useSelector((state) => state.modalInfo.modalType);
  const managedChannel = useSelector((state) => state.modalInfo.managedChannel);
  // const myState = useSelector((state) => state);
  // console.log(myState);

  useEffect(() => {
    dispatch(fetchChatData({ header: auth.getAuthHeader(), username }));
  }, []);

  return loadingStatus === 'loading'
    ? <LoadingSpinner />
    : (
      <>
        <ChatBox
          channels={channels}
          modalType={modalType}
        />

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
