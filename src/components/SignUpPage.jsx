import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import {
  Button,
  Form,
  Row,
  Col,
  Card,
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
  const [signUpFailed, setSignUpFailed] = useState(false);

  const SignUpSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, 'invalidUsernameLength')
      .max(20, 'invalidUsernameLength')
      .required('required'),
    password: Yup.string()
      .min(6, 'invalidPasswordLength')
      .required('required'),
    passwordConfirmation: Yup.mixed()
      .oneOf([Yup.ref('password')], 'unconfirmedPassword')
      .required('required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values) => {
      console.log('You clicked the button!');
      setSignUpFailed(false);
      try {
        const res = await axios.post(routes.signUpPath(), values);
        localStorage.setItem('userId', JSON.stringify(res.data));
        auth.logIn();
        history.replace('/');
      } catch (err) {
        if (err.isAxiosError && err.response.status === 409) {
          setSignUpFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  history.listen((location) => {
    console.log('!!!', location);
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
                <Form.Label htmlFor="username">{t('signUp.username')}</Form.Label>
                <Form.Control
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  placeholder={t('signUp.username')}
                  name="username"
                  id="username"
                  autoComplete="username"
                  ref={inputRef}
                  isInvalid={signUpFailed || (formik.touched.username && formik.errors.username)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.username && formik.errors.username
                    ? t(`errors.${formik.errors.username}`)
                    : null}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="p-2 mx-2">
                <Form.Label htmlFor="password">{t('signUp.password')}</Form.Label>
                <Form.Control
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  placeholder={t('signUp.password')}
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  isInvalid={signUpFailed || (formik.touched.password && formik.errors.password)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.password && formik.errors.password
                    ? t(`errors.${formik.errors.password}`)
                    : null}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="p-2 mx-2">
                <Form.Label htmlFor="password">{t('signUp.passwordConfirmation')}</Form.Label>
                <Form.Control
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.passwordConfirmation}
                  placeholder={t('signUp.passwordConfirmation')}
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  autoComplete="passwordConfirmation"
                  isInvalid={signUpFailed
                    || (formik.touched.passwordConfirmation && formik.errors.passwordConfirmation)}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
                    ? t(`errors.${formik.errors.passwordConfirmation}`)
                    : null}
                </Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                  {signUpFailed
                    ? t('errors.duplicatedUsername')
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
                  {t('signUp.submit')}
                </Button>
              </Col>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};
