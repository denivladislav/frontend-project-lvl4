import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import {
  Row,
  Col,
  Button,
  Nav,
  Form,
  InputGroup,
} from 'react-bootstrap';
import axios from 'axios';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { setChannelsData, setCurrentChannel } from '../slices/channelsSlice.js';
import { addNewMessage } from '../slices/messagesSlice.js';
import routes from '../routes.js';
// import useAuth from '../hooks/useAuth.jsx';
import useSocket from '../hooks/useSocket.jsx';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

export default () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const inputRef = useRef();
  // const auth = useAuth();
  // console.log('AUTH', auth);
  useEffect(() => {
    inputRef.current.focus();
    const fetchContent = async () => {
      const { data } = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
      console.log('DATA FROM SERVER', data);
      dispatch(setChannelsData(data));
    };

    fetchContent();
  }, []);

  const channels = useSelector((state) => state.channelsData.channels);
  const currentChannelId = useSelector((state) => state.channelsData.currentChannelId);
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const messages = useSelector((state) => state.messagesData.messages);
  console.log('Messages', messages);
  const currentChannelMessages = messages
    .filter((message) => message.channelId === currentChannelId);
  const myState = useSelector((state) => state);
  const { username } = JSON.parse(localStorage.getItem('userId'));
  console.log('myState', myState);

  const formik = useFormik({
    initialValues: {
      message: '',
      username,
      currentChannelId,
    },
    onSubmit: (values, { resetForm }) => {
      socket.emit('newMessage', {
        message: values.message,
        username: values.username,
        channelId: currentChannelId,
      });
      dispatch((addNewMessage({
        message: values.message,
        username: values.username,
        channelId: currentChannelId,
      })));
      resetForm({ values: '' });
    },
  });

  return (
    <Row className="h-100">
      <Col className="col-4 col-md-2 border-end bg-light pt-5 px-0">
        <Col className="d-flex justify-content-between mb-2 ps-2 pe-2">
          <Col className="ps-2">Channels</Col>
          <Button size="sm" className="px-1 py-0 btn-secondary">＋</Button>
        </Col>
        <Nav fill variant="pills" className="flex-column px-2">
          {channels.map((channel) => {
            const buttonClass = cn('w-100', 'mb-1', 'rounded-0', 'text-start', {
              'btn-light': channel.id !== currentChannelId,
              'btn-secondary': channel.id === currentChannelId,
            });
            return (
              <Nav.Item key={channel.id} className="w-100">
                <Button
                  onClick={() => dispatch(setCurrentChannel({ id: channel.id }))}
                  className={buttonClass}
                >
                  {channel.name}
                </Button>
              </Nav.Item>
            );
          })}
        </Nav>
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
              <p>
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
  );
};
