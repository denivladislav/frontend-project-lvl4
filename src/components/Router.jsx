import React, { useContext } from 'react';
import {
  BrowserRouter,
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
import LoginPage from '../pages/LoginPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import ChatPage from '../pages/ChatPage.jsx';
import SignUpPage from '../pages/SignUpPage.jsx';
import authContext from '../contexts/authContext.jsx';
import useAuth from '../hooks/useAuth.jsx';

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

const Router = () => {
  const [t] = useTranslation();
  return (
    <BrowserRouter>
      <Col className="d-flex flex-column h-100">
        <Navbar bg="light" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">{t('nav.chat')}</Navbar.Brand>
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
            <Route path="/signup">
              <SignUpPage />
            </Route>
            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>
        </Container>
      </Col>
    </BrowserRouter>
  );
};

export default Router;
