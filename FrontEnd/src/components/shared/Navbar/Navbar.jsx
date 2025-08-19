import React, { useState } from "react";
import {
  Navbar as BootstrapNavbar,
  Container,
  Nav,
  Button,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const NavBar = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = () => {
    setExpanded(false);
  };

  return (
    <BootstrapNavbar
      expanded={expanded}
      bg="light"
      expand="lg"
      fixed="top"
      className="custom-navbar"
    >
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/" className="brand">
          {/* <img
            src="/logo.png"
            alt="SocialFeed Logo"
            className="d-inline-block align-top logo"
          /> */}
          SocialFeed
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle
          aria-controls="main-navbar"
          onClick={() => setExpanded(!expanded)}
        />
        <BootstrapNavbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/"
              onClick={handleNavClick}
              className={location.pathname === "/" ? "active" : ""}
            >
              Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/features"
              onClick={handleNavClick}
              className={location.pathname === "/features" ? "active" : ""}
            >
              Features
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              onClick={handleNavClick}
              className={location.pathname === "/about" ? "active" : ""}
            >
              About
            </Nav.Link>
          </Nav>
          <Nav>
            <Button
              variant="outline-primary"
              className="me-2"
              onClick={() => {
                navigate("/login");
                handleNavClick();
              }}
            >
              Login
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                navigate("/signup");
                handleNavClick();
              }}
            >
              Sign Up
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default NavBar;
