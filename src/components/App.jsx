import React, { useContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import {
  Button,
  Navbar,
  Nav,
  Container,
} from 'react-bootstrap';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import ChatPage from './ChatPage.jsx';
import authContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = localStorage.userId
    ? useState(true)
    : useState(false);
  console.log('AuthProvider, loggedIn:', loggedIn);
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };

  return (
    <authContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </authContext.Provider>
  );
};

const AuthButton = () => {
  const auth = useContext(authContext);

  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Log out</Button>
      : <Button as={Link} to="/login">Log in</Button>
  );
};

const ChatRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={({ location }) => (auth.loggedIn
        ? children
        : <Redirect to={{ pathname: '/login', state: { from: location } }} />)}
    />
  );
};

console.log('Enter', localStorage);

export default () => (
  <AuthProvider>
    <Router>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">ChatPage</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/login">LoginPage</Nav.Link>
            <Nav.Link as={Link} to="/404">NotFoundPage</Nav.Link>
          </Nav>
          <AuthButton />
        </Container>
      </Navbar>
      <div className="container p-3">
        <Switch>
          <ChatRoute exact path="/">
            <ChatPage />
          </ChatRoute>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route path="*">
            <NotFoundPage />
          </Route>
        </Switch>
      </div>
    </Router>
  </AuthProvider>
);
