import React from 'react';
import AuthProvider from './AuthProvider.jsx';
import Router from './Router.jsx';

const App = () => (
  <AuthProvider>
    <Router />
  </AuthProvider>
);

export default App;
