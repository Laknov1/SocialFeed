import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import "./postbox.css";

const PostBox = ({ onPostCreated }) => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !file) {
      setError("Please enter some content or upload an image");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (file) {
        formData.append("file", file);
      }
      formData.append("userId", user.id);

      const response = await axios.post(
        "http://localhost:8080/api/posts",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setContent("");
      setFile(null);
      if (onPostCreated) {
        onPostCreated(response.data);
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  return (
    <Card className="post-box">
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <div className="post-input-container">
            <img
              src={`http://localhost:8080/${user.userpfp}`}
              alt="Profile"
              className="profile-image"
            />
            <div className="post-input-wrapper">
              <Form.Control
                as="textarea"
                className="post-input"
                placeholder="What's happening?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
              />
              {file && (
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="preview-img"
                  />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={handleRemoveImage}
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="post-actions">
            <div className="post-actions-left">
              <label className="upload-btn" htmlFor="file-input">
                <FontAwesomeIcon icon={faImage} />
              </label>
              <input
                type="file"
                id="file-input"
                className="file-input"
                accept="image/*"
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>
            <Button
              type="submit"
              className="post-button"
              disabled={loading || (!content.trim() && !file)}
            >
              {loading ? "Posting..." : "Post"}
            </Button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default PostBox;
