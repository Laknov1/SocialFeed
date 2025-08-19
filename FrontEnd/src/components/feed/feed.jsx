import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import PostCard from "./postcard";
import PostBox from "../postbox/postbox";
import Sidebar from "../shared/Sidebar/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Feed.css";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 403) {
          // Token is invalid or expired
          logout();
          navigate("/login");
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch posts. Please try again.");
        if (error.message.includes("403")) {
          logout();
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPosts();
    } else {
      navigate("/login");
    }
  }, [token, navigate, logout]);

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
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

  if (!token) {
    return null;
  }

  return (
    <div className="feed-container">
      <Sidebar />
      <Container className="feed-content">
        <PostBox onPostCreated={handlePostCreated} />
        {error && <div className="error-message">{error}</div>}
        {loading ? (
          <div className="loading">Loading posts...</div>
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
      </Container>
    </div>
  );
};

export default Feed;
