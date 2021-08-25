import React, { useEffect } from 'react';
import {
  Row,
  Col,
  Button,
  Nav,
  Form,
} from 'react-bootstrap';
import axios from 'axios';
import cn from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { setChannelsData, setCurrentChannel } from '../slices/channelsSlice.js';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

export default () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
      console.log(data);
      dispatch(setChannelsData(data));
    };

    fetchContent();
  }, []);

  const channels = useSelector((state) => state.channelsData.channels);
  const currentChannelId = useSelector((state) => state.channelsData.currentChannelId);
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);
  const channelsData = useSelector((state) => state.channelsData);
  console.log('currentChannel', currentChannel);
  console.log('channelsData', channelsData);

  return (
    <Row className="h-100">
      <Col className="col-4 col-md-2 border-end bg-light pt-5 px-0">
        <Col className="d-flex justify-content-between mb-2 ps-2 pe-2">
          <Col className="ps-2">Channels</Col>
          <Button size="sm" className="px-1 py-0 btn-secondary">＋</Button>
        </Col>
        <Nav fill variant="pills" className="flex-column px-2">
          {channels.map((channel) => {
            const buttonClass = cn('w-100', 'rounded-0', 'text-start', {
              'btn-light': channel.id !== currentChannelId,
              'btn-secondary': channel.id === currentChannelId,
            });
            console.log('XX', channel.id);
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
            <span>number of messages here</span>
          </div>
          <div id="messages-box" className="chat-messages overflow-auto px-5">
            <p>Message One here</p>
          </div>
          <div className="mt-auto px-5 py-3">
            <Form.Group>
              <Form.Control />
            </Form.Group>
          </div>
        </Col>
      </Col>
    </Row>
  );
};
