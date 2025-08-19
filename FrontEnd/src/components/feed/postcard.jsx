import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../../context/AuthContext";
import "./postcard.css";

const API_URL = "http://localhost:8080";

function PostCard({ post, onPostUpdated, onPostDeleted }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editFile, setEditFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user, token } = useAuth();
  const [canDelete, setCanDelete] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "Just now";
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchComments = async () => {
      if (!post.id || !token) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${API_URL}/api/comments/post/${post.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (isMounted) {
          setComments(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setError("Failed to load comments");
          console.error("Error fetching comments:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    const fetchLikes = async () => {
      if (!post?.id || !user?.id || !token) return;

      setIsLoading(true);
      try {
        const [countResponse, userLikeResponse] = await Promise.all([
          axios.get(`${API_URL}/api/likes/post/${post.id}/count`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${API_URL}/api/likes/post/${post.id}/user/${user.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const count = Number(countResponse.data);
        setLikeCount(Number.isFinite(count) && count >= 0 ? count : 0);
        setIsLiked(Boolean(userLikeResponse.data));
      } catch (error) {
        console.error(
          "Error fetching likes:",
          error.response?.data || error.message
        );
        setLikeCount(0);
        setIsLiked(false);
      } finally {
        setIsLoading(false);
      }
    };

    const loadData = async () => {
      if (!post?.id || !token) return;

      try {
        setIsLoading(true);
        await Promise.all([fetchComments(), fetchLikes()]);
      } catch (error) {
        if (isMounted) {
          setError("Failed to load post data");
          console.error("Error loading post data:", error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    if (user) {
      const isAdmin = user.role === "ADMIN";
      const isPostOwner = post.user.id === user.id;
      setCanDelete(isAdmin || isPostOwner);
      setCanEdit(isPostOwner);
      console.log("User role:", user.role);
      console.log("Is admin:", isAdmin);
      console.log("Can delete:", isAdmin || isPostOwner);
    }

    return () => {
      isMounted = false;
    };
  }, [post?.id, user?.id, token]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || !token) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/comments`,
        {
          content: newComment,
          user: { id: user.id },
          post: { id: post.id },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newCommentWithUser = {
        ...response.data,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          userpfp: user.userpfp,
        },
      };

      setComments((prevComments) => [newCommentWithUser, ...prevComments]);
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleLike = async () => {
    if (!user || !token) return;

    try {
      if (isLiked) {
        await axios.delete(
          `${API_URL}/api/likes/post/${post.id}/user/${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLikeCount((prev) => Math.max(0, prev - 1));
        setIsLiked(false);
      } else {
        await axios.post(
          `${API_URL}/api/likes`,
          {
            postId: post.id,
            userId: user.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error(
        "Error handling like:",
        error.response?.data || error.message
      );
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    setIsEditing(true);
    try {
      const formData = new FormData();
      formData.append("content", editContent);
      if (editFile) {
        formData.append("file", editFile);
      }

      const response = await axios.put(
        `${API_URL}/api/posts/${post.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setShowEditModal(false);
      if (onPostUpdated) {
        onPostUpdated(response.data);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      setError("Failed to update post");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`${API_URL}/api/posts/${post.id}?userId=${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (onPostDeleted) {
        onPostDeleted(post.id);
      }
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error.response?.data || "Failed to delete post");
    }
  };

  const isPostOwner = user && post.user.id === user.id;

  return (
    <div>
      <div id="postbox">
        <div id="topbar">
          <img
            src={`http://localhost:8080/${post.user.userpfp}`}
            alt="User profile"
          />
          <p>{post.user.name}</p>
          <p>@{post.user.username}</p>
          <p>.</p>
          <p>{formatTimeAgo(post.createdAt)}</p>
          <div className="post-actions-owner">
            {canEdit && (
              <button
                className="edit-button"
                onClick={() => setShowEditModal(true)}
                title="Edit post"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            )}
            {canDelete && (
              <button
                className="delete-button"
                onClick={() => setShowDeleteModal(true)}
                title="Delete post"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
          </div>
        </div>
        <div id="content">{post.content}</div>
        {post.image && (
          <img
            src={`http://localhost:8080/${post.image}`}
            alt="post"
            className="post-image"
          />
        )}
        <div className="post-actions">
          <button
            className={`like-button ${isLiked ? "liked" : ""}`}
            onClick={handleLike}
            disabled={!user}
          >
            <FontAwesomeIcon
              icon={isLiked ? faHeart : faHeartRegular}
              className="action-icon"
            />
            <span>
              {isLoading
                ? "..."
                : typeof likeCount === "number" && likeCount >= 0
                ? likeCount
                : 0}
            </span>
          </button>
          <button
            className="comment-button"
            onClick={() => setShowComments(!showComments)}
          >
            <FontAwesomeIcon icon={faComment} className="action-icon" />
            <span>{comments.length}</span>
          </button>
        </div>

        {showComments && (
          <div className="comments-section">
            <Form onSubmit={handleComment} className="comment-form">
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isLoading}
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={!newComment.trim() || isLoading}
              >
                {isLoading ? "Posting..." : "Comment"}
              </Button>
            </Form>

            {error && <div className="text-danger mb-3">{error}</div>}

            <div className="comments-list">
              {isLoading && comments.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  Loading comments...
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment">
                    <div className="comment-header">
                      <img
                        src={`http://localhost:8080/${comment.user.userpfp}`}
                        alt="User profile"
                        className="comment-user-image"
                      />
                      <div className="comment-user-info">
                        <strong>{comment.user.name}</strong>
                        <span className="text-muted">
                          @{comment.user.username}
                        </span>
                      </div>
                    </div>
                    <p className="comment-content">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdatePost}>
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="What's on your mind?"
              />
            </Form.Group>
            <Form.Group className="mb-3">
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
              <Button
                type="submit"
                variant="primary"
                disabled={!editContent.trim() || isEditing}
              >
                {isEditing ? "Updating..." : "Update Post"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this post?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePost}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostCard;
