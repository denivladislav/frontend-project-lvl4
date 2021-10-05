import React, { useState } from 'react';
import authContext from '../contexts/authContext.jsx';

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  const [{ loggedIn, username }, setAuthData] = useState(
    userId
      ? { loggedIn: true, username: userId.username }
      : { loggedIn: false, username: null },
  );

  const logIn = (data) => {
    localStorage.setItem('userId', JSON.stringify(data));
    setAuthData({ loggedIn: true, username: data.username });
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setAuthData({ loggedIn: false, username: null });
  };

  const getAuthHeader = () => {
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }

    return {};
  };

  return (
    <authContext.Provider value={{
      loggedIn,
      logIn,
      logOut,
      getAuthHeader,
      username,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
