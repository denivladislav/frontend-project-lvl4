import React, { useState } from 'react';
import authContext from '../contexts/authContext.jsx';

const AuthProvider = ({ children }) => {
  const userId = JSON.parse(localStorage.getItem('userId'));

  const [loggedIn, setLoggedIn] = useState(!!localStorage.userId);
  const [username, setUsername] = useState(userId ? userId.username : null);

  const logIn = (data) => {
    localStorage.setItem('userId', JSON.stringify(data));
    setUsername(data.username);
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('userId');
    setUsername(null);
    setLoggedIn(false);
  };

  const getAuthHeader = () => {
    if (userId && userId.token) {
      return { Authorization: `Bearer ${userId.token}` };
    }

    return {};
  };

  const getUsername = () => username;

  return (
    <authContext.Provider value={{
      loggedIn,
      logIn,
      logOut,
      getAuthHeader,
      getUsername,
    }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
