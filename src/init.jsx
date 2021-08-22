import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import {
  Button,
  Navbar,
  Nav,
  Container,
} from 'react-bootstrap';

import '../assets/application.scss';

export default () => (
  <Router>
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">HomePage</Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/login">LoginPage</Nav.Link>
          <Nav.Link as={Link} to="/404">NotFoundPage</Nav.Link>
        </Nav>
        <Button>Log In</Button>
      </Container>
    </Navbar>
    <div className="container p-3">
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </div>
  </Router>
);

function HomePage() {
  return <h2>Home</h2>;
}

function LoginPage() {
  return <h2>Login</h2>;
}

function NotFoundPage() {
  return (
    <h2>
      404 Not Found. Return to <a href="/">home page</a>
    </h2>
  );
}
