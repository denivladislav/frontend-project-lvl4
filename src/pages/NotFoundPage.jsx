import React from 'react';
import {
  Row,
  Col,
  Card,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <Row className="justify-content-center align-content-top p-2 h-100">
      <Col className="col-md-2 col-lg-6">
        <Card className="shadow-sm mx-5">
          <Card.Header className="text-center h3">
            {t('notFound.header')}
          </Card.Header>
          <Card.Body className="text-center">
            <a href="/">{t('notFound.link')}</a>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default NotFoundPage;
