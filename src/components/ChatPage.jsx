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
import { selectChannelsNames } from '../selectors.js';

const Modal = ({ username, modalType, loadingStatus }) => {
  const managedChannel = useSelector((state) => state.modalInfo.managedChannel);
  const channelsNames = useSelector(selectChannelsNames);
  const ModalComponent = getModal(modalType);
  return ModalComponent
    ? (
      <ModalComponent
        username={username}
        modalType={modalType}
        channel={managedChannel}
        channelsNames={channelsNames}
        loadingStatus={loadingStatus}
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

  const loadingStatus = useSelector((state) => state.channelsData.loadingStatus);
  const username = useSelector((state) => state.channelsData.username);
  const modalType = useSelector((state) => state.modalInfo.modalType);

  // this selector will not exist
  const myState = useSelector((state) => state);
  console.log(myState);

  useEffect(() => {
    dispatch(fetchChatData({ header: auth.getAuthHeader(), username: auth.getUsername() }));
  }, []);

  return loadingStatus === 'loading'
    ? <LoadingSpinner />
    : (
      <>
        <ChatBox
          username={username}
          modalType={modalType}
        />

        <Modal
          username={username}
          modalType={modalType}
          loadingStatus={loadingStatus}
        />
      </>
    );
};

export default ChatPage;
