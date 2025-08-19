import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "../feed/postcard";
import Sidebar from "../shared/Sidebar/Sidebar";
import { useAuth } from "../../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editFile, setEditFile] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, isLoading: authLoading, updateUserProfile } = useAuth();

  useEffect(() => {
    if (!authLoading && !token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/users/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(response.data);
        setEditName(response.data.name);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/posts/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
      fetchUserPosts();
    }
  }, [id, navigate, token, authLoading]);

  const handleEditProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (editName) formData.append("name", editName);
    if (editFile) formData.append("file", editFile);

    try {
      const response = await axios.put(
        `http://localhost:8080/api/users/profile/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
      await updateUserProfile(response.data);
      setShowEditModal(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account");
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  };

  const handlePostDeleted = (deletedPostId) => {
    setPosts((prevPosts) =>
      prevPosts.filter((post) => post.id !== deletedPostId)
    );
  };

  if (authLoading || loading) {
    return (
      <div className="profile-container">
        <Sidebar />
        <Container
          className="profile-content d-flex justify-content-center align-items-center"
          style={{ minHeight: "100vh" }}
        >
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <Sidebar />
      <Container className="profile-content">
        <Card className="profile-header mb-4">
          <Card.Body>
            <Row className="align-items-center">
              <Col md={3} className="text-center">
                <img
                  src={`http://localhost:8080/${user.userpfp}`}
                  alt="Profile"
                  className="profile-picture"
                />
              </Col>
              <Col md={9}>
                <h2>{user.name}</h2>
                <p className="text-muted">@{user.username}</p>
                <p className="text-muted">
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
                <div className="profile-actions">
                  <Button
                    variant="primary"
                    onClick={() => setShowEditModal(true)}
                    className="me-2"
                  >
                    Edit Profile
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Account
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="posts-section">
          <h3>Posts</h3>
          {posts.length === 0 ? (
            <p className="text-muted">No posts yet.</p>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}
        </div>
      </Container>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditProfile}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setEditFile(e.target.files[0])}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;
