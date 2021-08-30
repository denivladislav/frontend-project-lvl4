import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
  Button,
  Form,
  Row,
  Col,
  Container,
} from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import useAuth from '../hooks/useAuth.jsx';
import routes from '../routes.js';

export default () => {
  const auth = useAuth();
  const history = useHistory();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const [authFailed, setAuthFailed] = useState(false);

  const SignUpSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'Too Short!')
      .max(20, 'Too long')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Too Short!')
      .required('Required'),
    passwordConfirmation: Yup.mixed()
      .oneOf([Yup.ref('password')]),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const res = await axios.post(routes.signUpPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        history.replace('/');
      } catch (err) {
        if (err.isAxiosError && err.response.status === 409) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <Container>
      <Row className="justify-content-center pt-5">
        <Col className="col-sm-4">
          <Form onSubmit={formik.handleSubmit} className="p-3">
            SIGN UP
            <Form.Group className="mb-2">
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control
                onChange={formik.handleChange}
                value={formik.values.username}
                placeholder="username"
                name="username"
                id="username"
                autoComplete="username"
                required
                ref={inputRef}
                isInvalid={authFailed}
              />
            </Form.Group>
            {formik.errors.username && formik.touched.username
              ? (<div>{formik.errors.username}</div>)
              : null}
            <Form.Group className="mb-2">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                isInvalid={authFailed}
              />
              {formik.errors.password && formik.touched.password
                ? (<div>{formik.errors.password}</div>)
                : null}
              <Form.Group className="mb-2">
                <Form.Label htmlFor="passwordConfirmation">Password Confirmation</Form.Label>
                <Form.Control
                  onChange={formik.handleChange}
                  value={formik.values.passwordConfirmation}
                  placeholder="passwordConfirmation"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  autoComplete="passwordConfirmation"
                  required
                  isInvalid={authFailed}
                />
              </Form.Group>
              {formik.errors.passwordConfirmation && formik.touched.passwordConfirmation
                ? (<div>{formik.errors.passwordConfirmation}</div>)
                : null}
              <Form.Control.Feedback type="invalid">This user already exists</Form.Control.Feedback>
            </Form.Group>
            <Button disabled={formik.isSubmitting} type="submit" variant="outline-primary">Submit</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
