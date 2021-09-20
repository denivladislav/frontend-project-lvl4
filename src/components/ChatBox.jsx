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
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { openModal } from '../slices/modalSlice.js';
import { setCurrentChannel } from '../slices/channelsSlice.js';
import useApi from '../hooks/useApi.jsx';
import { selectCurrentChannelMessages, selectCurrentChannel } from '../selectors.js';

const ChatForm = ({ username, currentChannelId, modalType }) => {
  const inputRef = useRef();
  const api = useApi();
  const [t] = useTranslation();

  useEffect(() => {
    inputRef.current.focus();
  }, [currentChannelId]);

  const formik = useFormik({
    initialValues: {
      message: '',
      currentChannelId,
    },
    onSubmit: (values, { resetForm }) => {
      const newMessage = {
        message: values.message,
        username,
        channelId: currentChannelId,
      };
      const res = api.sendMessage(newMessage);
      if (res.connected) {
        resetForm();
      }
    },
  });

  return (
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
        <Button
          aria-hidden={modalType !== null}
          type="submit"
          variant="outline-secondary"
        >
          ➞
          <span className="visually-hidden">{t('chat.submit')}</span>
        </Button>
      </InputGroup>
    </Form>
  );
};

const ChannelsList = ({ channels, currentChannelId }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const DropdownComponent = ({ variant, dropdownClass, channel }) => {
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
              <DropdownComponent
                variant={variant}
                dropdownClass={dropdownClass}
                channel={channel}
              />
            </ButtonGroup>
          </Nav.Item>
        );
      })}
    </ListGroup>
  );
};

const ChatBox = ({ username, modalType }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const lastMessageRef = useRef();
  const channels = useSelector((state) => state.channelsData.channels);
  const currentChannelId = useSelector((state) => state.channelsData.currentChannelId);
  const currentChannel = useSelector(selectCurrentChannel(currentChannelId));
  const currentChannelMessages = useSelector(selectCurrentChannelMessages(currentChannelId));

  useEffect(() => {
    lastMessageRef.current.scrollIntoView({ behavior: 'auto' });
  });

  return (
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
            <span
              style={{ paddingLeft: 1 }}
            >
              {t('chat.addChannel')}
            </span>
          </Button>
        </Col>
        <ChannelsList
          channels={channels}
          currentChannelId={currentChannelId}
        />
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
            <ChatForm
              username={username}
              currentChannelId={currentChannelId}
              modalType={modalType}
            />
          </div>
        </Col>
      </Col>
    </Row>
  );
};

export default ChatBox;
