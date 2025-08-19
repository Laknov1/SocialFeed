import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaUser, FaSignOutAlt, FaBars } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoading } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isOpen, setIsOpen] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  if (isLoading) {
    return (
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <>
      {isMobile && (
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: "10px",
            left: "10px",
            zIndex: 1001,
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "#1a73e8",
            cursor: "pointer",
            padding: "10px",
          }}
        >
          <FaBars />
        </button>
      )}
      <div
        className={`sidebar-backdrop ${isOpen ? "show" : ""}`}
        onClick={toggleSidebar}
      />
      <div className={`sidebar ${isOpen ? "show" : ""}`}>
        <div className="sidebar-header">
          <img
            src={`http://localhost:8080/${user.userpfp}`}
            alt="Profile"
            className="profile-picture"
          />
          <div className="text-content">
            <h3>{user.name}</h3>
            <p className="username">@{user.username}</p>
          </div>
        </div>
        <Nav className="flex-column">
          <Nav.Link
            as={Link}
            to="/feed"
            className={`sidebar-link ${
              location.pathname === "/feed" ? "active" : ""
            }`}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FaHome className="icon" /> Home
          </Nav.Link>
          <Nav.Link
            as={Link}
            to={`/profile/${user.id}`}
            className={`sidebar-link ${
              location.pathname === `/profile/${user.id}` ? "active" : ""
            }`}
            onClick={() => isMobile && setIsOpen(false)}
          >
            <FaUser className="icon" /> Profile
          </Nav.Link>
          <Nav.Link
            onClick={() => {
              handleLogout();
              isMobile && setIsOpen(false);
            }}
            className="sidebar-link"
          >
            <FaSignOutAlt className="icon" /> Logout
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
