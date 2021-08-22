import React, { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import {
  Button,
  Form,
  Row,
  Col,
  Container,
} from 'react-bootstrap';
import * as Yup from 'yup';

export default () => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const LoginSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, 'Too Short!')
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Container>
      <Row className="justify-content-center pt-5">
        <Col className="col-sm-4">
          <Form onSubmit={formik.handleSubmit} className="p-3">
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
              />
            </Form.Group>
            {formik.errors.username && formik.touched.username ? (
              <div>{formik.errors.username}</div>
            ) : null}
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
              />
              <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="outline-primary">Submit</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
