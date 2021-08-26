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
  Nav,
  Container, Col,
} from 'react-bootstrap';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import ChatPage from './ChatPage.jsx';
import authContext from '../contexts/authContext.jsx';
import useAuth from '../hooks/useAuth.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(_.has(localStorage, 'userId'));
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
      ? <Button onClick={auth.logOut} className="btn-secondary">Log out</Button>
      : <Button as={Link} to="/login" className="btn-secondary">Log in</Button>
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

export default () => (
  <AuthProvider>
    <Router>
      <Col className="d-flex flex-column h-100">
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
        <Container className="h-100 overflow-hidden rounded shadow my-4">
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
        </Container>
      </Col>
    </Router>
  </AuthProvider>
);
