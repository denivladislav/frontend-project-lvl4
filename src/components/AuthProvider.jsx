import React, { useState } from 'react';
import _ from 'lodash';
import authContext from '../contexts/authContext.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(_.has(localStorage, 'userId'));
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  const getAuthHeader = () => {
    const userId = JSON.parse(localStorage.getItem('userId'));

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
    }}
    >
      {children}
    </authContext.Provider>
  );
};

export default AuthProvider;
