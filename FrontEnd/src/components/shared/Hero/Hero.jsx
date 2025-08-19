import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Features from '../Features/Features';
import About from '../About/About';
import './Hero.css';

const Hero = () => {
  return (
    
    <><div className="hero-section">
      <Container>
        <Row className="align-items-center">
          <Col lg={6} className="hero-content">
            <h1 className="hero-title">Connect. Share. Explore.</h1>
            <p className="hero-description">
              Join our vibrant community where ideas flow freely, connections are made,
              and stories come to life. Share your thoughts, engage with others,
              and be part of something bigger.
            </p>
            <div className="hero-buttons">
              <Button variant="primary" size="lg" className="me-3">
                Get Started
              </Button>
              <Button variant="outline-primary" size="lg">
                Learn More
              </Button>
            </div>
          </Col>
          <Col lg={6} className="hero-image">
            <img
              src="./src/assets/Screenshot 2025-06-04 105658.jpg"
              alt="Social Feed Platform"
              className="img-fluid floating-animation" />
          </Col>
        </Row>
      </Container>
    </div><Features /><About /></>
  );
};

export default Hero; 