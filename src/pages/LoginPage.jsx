import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Button,
  Form,
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import useAuth from '../hooks/useAuth.jsx';
import { postLoginData, setDefaultAuthStatus } from '../slices/loginSlice.js';

const LoginForm = () => {
  const inputRef = useRef();
  const auth = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const authStatus = useSelector((state) => state.loginData.authStatus);
  const authData = useSelector((state) => state.loginData.authData);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    if (authStatus === 'success') {
      auth.logIn(authData);
      history.replace('/');
      dispatch(setDefaultAuthStatus());
    }
    if (authStatus === 'failed') {
      inputRef.current.select();
    }
  }, [authStatus]);

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .required('required'),
    password: Yup.string()
      .required('required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validateOnBlur: false,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      dispatch(postLoginData({ values }));
      formik.setSubmitting(false);
    },
  });

  const authFailed = authStatus === 'failed';
  const isUsernameInvalid = formik.touched.username && formik.errors.username;
  const isPasswordInvaild = formik.touched.password && formik.errors.password;

  return (
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
          isInvalid={authFailed || isUsernameInvalid}
        />
        <Form.Control.Feedback type="invalid">
          {isUsernameInvalid
            ? t(`errors.${formik.errors.username}`)
            : null}
        </Form.Control.Feedback>
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
          isInvalid={authFailed || isPasswordInvaild}
        />
        <Form.Control.Feedback type="invalid">
          {isPasswordInvaild
            ? t(`errors.${formik.errors.password}`)
            : null}
        </Form.Control.Feedback>
        <Form.Control.Feedback type="invalid">
          {authFailed
            ? t('errors.auth')
            : null}
        </Form.Control.Feedback>
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
  );
};

const LoginPage = () => {
  const [t] = useTranslation();
  const myState = useSelector((state) => state);
  console.log(myState);
  return (
    <Row className="justify-content-center align-content-center h-100">
      <Col className="col-md-2 col-lg-6">
        <Card className="shadow-sm mx-5">
          <Card.Header className="text-center h3">
            {t('login.header')}
          </Card.Header>
          <Card.Body>
            <LoginForm />
          </Card.Body>
          <Card.Footer className="text-center">
            {t('login.footer.message')}
            {' '}
            <Col as={Link} to="/signup">{t('login.footer.link')}</Col>
          </Card.Footer>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
