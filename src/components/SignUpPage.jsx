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
  const [t] = useTranslation();
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
    <Row className="justify-content-center align-content-center h-100">
      <Col className="col-md-2 col-lg-6">
        <Card className="shadow-sm mx-5">
          <Card.Header className="text-center h3">
            {t('signUp.header')}
          </Card.Header>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit} className="p-2">
              <Form.Group className="p-2 mx-2">
                <FloatingLabel label={t('signUp.username')}>
                  <Form.Control
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    placeholder={t('signUp.username')}
                    name="username"
                    id="username"
                    autoComplete="username"
                    required
                    ref={inputRef}
                    isInvalid={authFailed}
                  />
                </FloatingLabel>
              </Form.Group>
              {formik.errors.username && formik.touched.username
                ? (<div>{formik.errors.username}</div>)
                : null}
              <Form.Group className="p-2 mx-2">
                <FloatingLabel label={t('signUp.password')}>
                  <Form.Control
                    type="password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    placeholder={t('signUp.password')}
                    name="password"
                    id="password"
                    autoComplete="current-password"
                    required
                    isInvalid={authFailed}
                  />
                  {formik.errors.password && formik.touched.password
                    ? (<div>{formik.errors.password}</div>)
                    : null}
                </FloatingLabel>
              </Form.Group>
              <Form.Group className="p-2 mx-2">
                <FloatingLabel label={t('signUp.passwordConfirmation')}>
                  <Form.Control
                    onChange={formik.handleChange}
                    value={formik.values.passwordConfirmation}
                    placeholder={t('signUp.passwordConfirmation')}
                    name="passwordConfirmation"
                    id="passwordConfirmation"
                    autoComplete="passwordConfirmation"
                    required
                    isInvalid={authFailed}
                  />
                  <Form.Control.Feedback type="invalid">{t('errors.duplicatedUserError')}</Form.Control.Feedback>
                </FloatingLabel>
              </Form.Group>
              {formik.errors.passwordConfirmation && formik.touched.passwordConfirmation
                ? (<div>{formik.errors.passwordConfirmation}</div>)
                : null}
              <Button disabled={formik.isSubmitting} type="submit" variant="outline-primary">
                {t('signUp.submit')}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
