import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Row,
  Col,
  Button,
  Form,
  InputGroup,
  ButtonGroup,
  Dropdown,
  DropdownButton,
  ListGroup,
  Nav,
} from 'react-bootstrap';
import axios from 'axios';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { setChannelsData, setCurrentChannel } from '../slices/channelsSlice.js';
// import { addNewMessage } from '../slices/messagesSlice.js';
import { openModal } from '../slices/modalSlice.js';
import routes from '../routes.js';
import useApi from '../hooks/useApi.jsx';
import useAuth from '../hooks/useAuth.jsx';
import getModal from './modals/index.js';

const renderModal = ({
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

export default () => {
  const api = useApi();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const lastMessageRef = useRef();
  const auth = useAuth();
  const [t] = useTranslation();

  const { username } = JSON.parse(localStorage.getItem('userId'));
  const channels = useSelector((state) => state.channelsData.channels);
  const channelsNames = channels.map((c) => c.name);
  const currentChannelId = useSelector((state) => state.channelsData.currentChannelId);
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentChannelMessages = useSelector((state) => state.messagesData.messages)
    .filter((message) => message.channelId === currentChannelId);
  const modalType = useSelector((state) => state.modalInfo.modalType);
  const managedChannel = useSelector((state) => state.modalInfo.managedChannel);
  const myState = useSelector((state) => state);
  console.log('myState', myState);
  // console.log('username', username);
  const messages = useSelector((state) => state.messagesData.messages);
  console.log('messages', messages);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.dataPath(), { headers: auth.getAuthHeader() });
      data.username = username;
      dispatch(setChannelsData(data));
    };

    fetchContent();
  }, []);

  useEffect(() => {
    inputRef.current.focus();
  }, [currentChannelId]);

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  const formik = useFormik({
    initialValues: {
      message: '',
      username,
      currentChannelId,
    },
    onSubmit: (values, { resetForm }) => {
      const newMessage = {
        message: values.message,
        username: values.username,
        channelId: currentChannelId,
      };
      api.sendMessage(newMessage);
      resetForm();
    },
  });

  const renderDropdownComponent = ({ variant, dropdownClass, channel }) => {
    if (!channel.removable) {
      return null;
    }
    return (
      <DropdownButton title="" variant={variant} className={dropdownClass} as={ButtonGroup}>
        <Dropdown.Item active={false} onClick={() => dispatch(openModal({ modalType: 'renameChannel', managedChannel: channel }))} eventKey="1">
          {t('chat.renameChannel')}
        </Dropdown.Item>
        <Dropdown.Item active={false} onClick={() => dispatch(openModal({ modalType: 'removeChannel', managedChannel: channel }))} eventKey="2">
          {t('chat.removeChannel')}
        </Dropdown.Item>
      </DropdownButton>
    );
  };

  return (
    <>
      <Row className="h-100">
        <Col className="col-4 col-md-2 border-end bg-light pt-5 px-0">
          <Col className="d-flex justify-content-between mb-2 ps-2 pe-2">
            <Col className="ps-2">
              {t('chat.сhannels')}
            </Col>
            <Button
              onClick={() => dispatch(openModal({ modalType: 'addChannel' }))}
              size="sm"
              className="px-1 py-0 btn-primary"
            >
              ＋
            </Button>
          </Col>
          <ListGroup variant="pills" className="justify-content-between flex-column px-2">
            {channels.map((channel) => {
              const buttonClass = cn('w-100', 'mb-1', 'rounded-0', 'text-start', 'text-truncate');
              const dropdownClass = cn('mb-1');
              const variant = channel.id === currentChannelId ? 'secondary' : 'light';
              return (
                <Nav.Item key={channel.id} className="w-100">
                  <ButtonGroup className="d-flex dropdown">
                    <Button
                      onClick={() => dispatch(setCurrentChannel({ id: channel.id }))}
                      variant={variant}
                      className={buttonClass}
                    >
                      {channel.name}
                    </Button>
                    {renderDropdownComponent({ variant, dropdownClass, channel })}
                  </ButtonGroup>
                </Nav.Item>
              );
            })}
          </ListGroup>
        </Col>
        <Col className="p-0 h-100">
          <Col className="flex-column d-flex h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <b>
                {currentChannel ? currentChannel.name : null}
              </b>
              <br />
              <span>
                {t('chat.messageCounter.count', { count: currentChannelMessages.length })}
              </span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {currentChannelMessages.map((msg) => (
                <p key={msg.id}>
                  <b>{msg.username}</b>
                  :
                  {' '}
                  {msg.message}
                </p>
              ))}
              <div ref={lastMessageRef} />
            </div>
            <div className="mt-auto px-5 py-3">
              <Form onSubmit={formik.handleSubmit}>
                <InputGroup>
                  <Form.Control
                    data-testid="new-message"
                    onChange={formik.handleChange}
                    value={formik.values.message}
                    placeholder={t('chat.input')}
                    name="message"
                    id="message"
                    ref={inputRef}
                    required
                  />
                </InputGroup>
                <Button type="submit" variant="outline-secondary">{t('chat.submit')}</Button>
              </Form>
            </div>
          </Col>
        </Col>
      </Row>

      {renderModal({
        modalType, username, channel: managedChannel, channelsNames,
      })}
    </>
  );
};
