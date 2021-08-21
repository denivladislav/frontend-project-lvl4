import 'core-js/stable/index.js';
import 'regenerator-runtime/runtime.js';
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap';

import '../assets/application.scss';

export default () => (
  <Router>
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={Link} to="/">Secret Place</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link as={Link} to="/public">Public page</Nav.Link>
        <Nav.Link as={Link} to="/private">Private page</Nav.Link>
      </Nav>
      <Button>Log In</Button>
    </Navbar>

    <div className="container p-3">
      <h1 className="text-center mt-5 mb-4">Welcome to the secret place!</h1>
      <Switch>
        <Route path="/public">
          <PublicPage />
        </Route>
        <Route path="/login">
          <LoginPage />
        </Route>
        <Route path="/private">
          <PrivatePage />
        </Route>
      </Switch>
    </div>
  </Router>
);

function PublicPage() {
  return <h2>Public</h2>;
}

function LoginPage() {
  return <h2>Login</h2>;
}

function PrivatePage() {
  return <h2>Private</h2>;
}
