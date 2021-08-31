import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Button,
  Form,
  Row,
  Col,
  Card,
  FloatingLabel,
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
  const [t] = useTranslation();

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .required(),
    password: Yup.string()
      .required(),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const res = await axios.post(routes.loginPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        history.replace('/');
      } catch (err) {
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <Row className="justify-content-center align-content-center h-100">
      <Col className="col-md-2 col-lg-6">
        <Card className="shadow-sm mx-5">
          <Card.Header className="text-center h3">
            {t('login.header')}
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} className="p-2">
              <Form.Group className="p-2 mx-2">
                <Form.Label htmlFor="username">{t('login.username')}</Form.Label>
                <Form.Control
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  placeholder={t('login.username')}
                  name="username"
                  id="username"
                  autoComplete="username"
                  ref={inputRef}
                  isInvalid={authFailed || (formik.touched.username && formik.errors.username)}
                />
                {formik.touched.username && formik.errors.username
                  ? (
                    <Form.Control.Feedback type="invalid" tooltip>
                      {t('errors.requiredError')}
                    </Form.Control.Feedback>
                  )
                  : null}
              </Form.Group>
              <Form.Group className="p-2 mx-2">
                <Form.Label htmlFor="password">{t('login.password')}</Form.Label>
                <Form.Control
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  placeholder={t('login.password')}
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  isInvalid={authFailed || (formik.touched.password && formik.errors.password)}
                />
                {formik.touched.password && formik.errors.password
                  ? (
                    <Form.Control.Feedback type="invalid" tooltip>
                      {t('errors.requiredError')}
                    </Form.Control.Feedback>
                  )
                  : null}
                {authFailed
                  ? (
                    <Form.Control.Feedback type="invalid">
                      {t('errors.authError')}
                    </Form.Control.Feedback>
                  )
                  : null}
              </Form.Group>
              <Col className="text-center">
                <Button
                  className="mx-3 my-1"
                  disabled={formik.isSubmitting}
                  type="submit"
                  variant="primary"
                >
                  {t('login.submit')}
                </Button>
              </Col>
            </Form>
          </Card.Body>
          <Card.Footer className="text-center">
            {t('login.footer')}
            {' '}
            <a href="/signup">{t('login.link')}</a>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};
