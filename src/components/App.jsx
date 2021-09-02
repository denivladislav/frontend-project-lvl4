import React, { useContext, useState } from 'react';
import _ from 'lodash';
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
  Container,
  Col,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import ChatPage from './ChatPage.jsx';
import SignUpPage from './SignUpPage.jsx';
import authContext from '../contexts/authContext.jsx';
import useAuth from '../hooks/useAuth.jsx';

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

const AuthButton = () => {
  const auth = useContext(authContext);
  const [t] = useTranslation();
  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut} className="btn-primary">{t('nav.logout')}</Button>
      : null
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

const SignUpRoute = ({ children, path }) => {
  const auth = useAuth();

  return (
    <Route
      path={path}
      render={({ location }) => (!auth.loggedIn
        ? children
        : <Redirect to={{ pathname: '/', state: { from: location } }} />)}
    />
  );
};

export default () => {
  const [t] = useTranslation();
  return (
    <AuthProvider>
      <Router>
        <Col className="d-flex flex-column h-100">
          <Navbar bg="light" expand="lg">
            <Container>
              <Navbar.Brand as={Link} to="/">{t('nav.chat')}</Navbar.Brand>
              {/* <Nav className="me-auto">
                <Nav.Link as={Link} to="/login">LoginPage</Nav.Link>
                <Nav.Link as={Link} to="/signup">SignUpPage</Nav.Link>
                <Nav.Link as={Link} to="/404">NotFoundPage</Nav.Link>
              </Nav> */}
              <AuthButton />
            </Container>
          </Navbar>
          <Container className="h-100 overflow-hidden rounded shadow my-4">
            <Switch>
              <ChatRoute exact path="/">
                <ChatPage />
              </ChatRoute>
              <Route path="/login">
                <LoginPage />
              </Route>
              <SignUpRoute path="/signup">
                <SignUpPage />
              </SignUpRoute>
              <Route path="*">
                <NotFoundPage />
              </Route>
            </Switch>
          </Container>
        </Col>
      </Router>
    </AuthProvider>
  );
};
