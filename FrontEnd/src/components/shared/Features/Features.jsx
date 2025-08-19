import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faHeart, 
  faUserFriends, 
  faBell 
} from '@fortawesome/free-solid-svg-icons';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: faEdit,
      title: 'Post Creation & Feed',
      description: 'Share your thoughts, images, and stories with our intuitive post creation system. Enjoy a personalized feed that keeps you updated with content you care about.'
    },
    {
      icon: faHeart,
      title: 'Like & Comment System',
      description: 'Engage with content through likes and comments. Foster meaningful discussions and show appreciation for content that resonates with you.'
    },
    {
      icon: faUserFriends,
      title: 'Follow System',
      description: 'Connect with like-minded individuals, follow your favorite creators, and build your own community of followers.'
    },
    {
      icon: faBell,
      title: 'Real-time Notifications',
      description: 'Stay updated with instant notifications about likes, comments, follows, and mentions. Never miss an important interaction.'
    }
  ];

  return (
  
    <section className="features-section" id="features">
      <Container >
        <h2 className="section-title text-center mb-5">Platform Features</h2>
        <Row>
          {features.map((feature, index) => (
            <Col md={6} lg={3} key={index} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon">
                    <FontAwesomeIcon icon={feature.icon} />
                  </div>
                  <Card.Title className="mt-4 mb-3">{feature.title}</Card.Title>
                  <Card.Text>{feature.description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Features; 