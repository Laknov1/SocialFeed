import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebook,
  faInstagram,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <footer className="footer">
        <Container fluid>
          <Row className="py-4">
            <Col md={4} className="mb-4 mb-md-0">
              <h5>SocialFeed</h5>
              <p className="text-muted">
                Connecting people through meaningful conversations and shared experiences.
              </p>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h6>Company</h6>
              <ul className="list-unstyled">
                <li><a href="#about">About</a></li>
                <li><a href="#careers">Careers</a></li>
                <li><a href="#press">Press</a></li>
              </ul>
            </Col>
            <Col md={2} className="mb-4 mb-md-0">
              <h6>Resources</h6>
              <ul className="list-unstyled">
                <li><a href="#blog">Blog</a></li>
                <li><a href="#help">Help Center</a></li>
                <li><a href="#guidelines">Guidelines</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h6>Connect With Us</h6>
              <div className="social-links">
                <a href="#twitter"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#facebook"><FontAwesomeIcon icon={faFacebook} /></a>
                <a href="#instagram"><FontAwesomeIcon icon={faInstagram} /></a>
                <a href="#linkedin"><FontAwesomeIcon icon={faLinkedin} /></a>
              </div>
            </Col>
          </Row>
          <hr />
          <Row className="py-3">
            <Col md={6} className="text-center text-md-start">
              <p className="mb-0">&copy; 2024 SocialFeed. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <a href="#privacy" className="me-3">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default Footer;
