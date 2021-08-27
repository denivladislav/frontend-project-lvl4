import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Row,
  Col,
  Button,
  Nav,
  Form,
  InputGroup,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  ListGroup,
} from 'react-bootstrap';
import axios from 'axios';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { setChannelsData, setCurrentChannel } from '../slices/channelsSlice.js';
import { openModal } from '../slices/modalSlice.js';
import routes from '../routes.js';
import useApi from '../hooks/useApi.jsx';
import useAuth from '../hooks/useAuth.jsx';
import getModal from './modals/index.js';

const Modal = ({ modalType }) => {
  const ModalComponent = getModal(modalType);
  return ModalComponent ? <ModalComponent /> : null;
};

export default () => {
  const api = useApi();
  const dispatch = useDispatch();
  const inputRef = useRef();
  const auth = useAuth();
  useEffect(() => {
    inputRef.current.focus();
    const fetchContent = async () => {
      const { data } = await axios.get(routes.dataPath(), { headers: auth.getAuthHeader() });
      dispatch(setChannelsData(data));
    };

    fetchContent();
  }, []);

  const { username } = JSON.parse(localStorage.getItem('userId'));
  const channels = useSelector((state) => state.channelsData.channels);
  const currentChannelId = useSelector((state) => state.channelsData.currentChannelId);
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const currentChannelMessages = useSelector((state) => state.messagesData.messages)
    .filter((message) => message.channelId === currentChannelId);
  const modalType = useSelector((state) => state.modalInfo.modalType);
  const myState = useSelector((state) => state);
  console.log('myState', myState);

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
      resetForm({ values: '' });
    },
  });

  return (
    <>
      <Row className="h-100">
        <Col className="col-4 col-md-2 border-end bg-light pt-5 px-0">
          <Col className="d-flex justify-content-between mb-2 ps-2 pe-2">
            <Col className="ps-2">Channels</Col>
            <Button
              onClick={() => dispatch(openModal({ modalType: 'addChannel' }))}
              size="sm"
              className="px-1 py-0 btn-secondary"
            >
              ＋
            </Button>
          </Col>
          <ListGroup fill variant="pills" className="flex-column px-2">
            {channels.map((channel) => {
              const buttonClass = cn('w-100', 'mb-1', 'rounded-0', 'text-start');
              const dropdownClass = cn('mb-1', 'rounded-0', 'text-start');
              const variant = channel.id === currentChannelId ? 'secondary' : 'light';
              return (
                <ButtonGroup key={channel.id} className="w-100">
                  <Button
                    onClick={() => dispatch(setCurrentChannel({ id: channel.id }))}
                    variant={variant}
                    className={buttonClass}
                  >
                    {channel.name}
                  </Button>
                  <DropdownButton variant={variant} className={dropdownClass} as={ButtonGroup}>
                    <Dropdown.Item eventKey="1">
                      Rename Channel
                    </Dropdown.Item>
                  </DropdownButton>
                </ButtonGroup>
              );
            })}
          </ListGroup>
        </Col>
        <Col className="p-0 h-100">
          <Col className="flex-column d-flex h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p>
                <b>{currentChannel ? currentChannel.name : null}</b>
              </p>
              <span>
                Number of messages:
                {' '}
                {currentChannelMessages.length}
              </span>
            </div>
            <div id="messages-box" className="chat-messages overflow-auto px-5">
              {currentChannelMessages.map((msg) => (
                <p key={msg.id}>
                  {msg.username}
                  :
                  {' '}
                  {msg.message}
                </p>
              ))}
            </div>
            <div className="mt-auto px-5 py-3">
              <Form onSubmit={formik.handleSubmit}>
                <InputGroup>
                  <Form.Control
                    onChange={formik.handleChange}
                    value={formik.values.message}
                    placeholder="Enter your message here"
                    name="message"
                    id="message"
                    ref={inputRef}
                  />
                  <Button type="submit" variant="outline-secondary">➔</Button>
                </InputGroup>
              </Form>
            </div>
          </Col>
        </Col>
      </Row>

      <Modal modalType={modalType} />
    </>
  );
};
