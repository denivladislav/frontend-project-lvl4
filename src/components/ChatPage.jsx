import React, { useEffect, useState } from 'react';
import axios from 'axios';
import routes from '../routes.js';

const getAuthHeader = () => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  if (userId && userId.token) {
    return { Authorization: `Bearer ${userId.token}` };
  }

  return {};
};

export default () => {
  const [content, setContent] = useState('');
  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(routes.dataPath(), { headers: getAuthHeader() });
      setContent(data);
    };

    fetchContent();
  }, []);

  console.log(content);

  return content && <p>Look for content in console</p>;
};
