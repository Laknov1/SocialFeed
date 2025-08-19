package com.post.main.service;

import com.post.main.entity.Comment;
import com.post.main.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CommentService {
    
    @Autowired
    private CommentRepository commentRepository;

    public Comment createComment(Comment comment) {
        if (comment.getContent() == null || comment.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content cannot be empty");
        }
        if (comment.getUser() == null || comment.getUser().getId() == null) {
            throw new IllegalArgumentException("User information is required");
        }
        if (comment.getPost() == null || comment.getPost().getId() == null) {
            throw new IllegalArgumentException("Post information is required");
        }
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(Long postId) {
        if (postId == null) {
            throw new IllegalArgumentException("Post ID cannot be null");
        }
        try {
            return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching comments: " + e.getMessage());
        }
    }

    public List<Comment> getCommentsByUserId(Long userId) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        try {
            return commentRepository.findByUserId(userId);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching user comments: " + e.getMessage());
        }
    }

    public void deleteComment(Long commentId) {
        if (commentId == null) {
            throw new IllegalArgumentException("Comment ID cannot be null");
        }
        if (!commentRepository.existsById(commentId)) {
            throw new RuntimeException("Comment not found");
        }
        try {
            commentRepository.deleteById(commentId);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting comment: " + e.getMessage());
        }
    }

    public void deleteCommentsByPostId(Long postId) {
        if (postId == null) {
            throw new IllegalArgumentException("Post ID cannot be null");
        }
        try {
            commentRepository.deleteByPostId(postId);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting post comments: " + e.getMessage());
        }
    }

    public Comment getCommentById(Long commentId) {
        if (commentId == null) {
            throw new IllegalArgumentException("Comment ID cannot be null");
        }
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }
} 