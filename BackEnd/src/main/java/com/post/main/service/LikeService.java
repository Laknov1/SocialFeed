package com.post.main.service;

import com.post.main.entity.Like;
import com.post.main.entity.Post;
import com.post.main.entity.User;
import com.post.main.repository.LikeRepository;
import com.post.main.repository.PostRepository;
import com.post.main.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@Slf4j
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, 
                      PostRepository postRepository,
                      UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public Like createLike(Long postId, Long userId) {
        if (postId == null || userId == null) {
            throw new IllegalArgumentException("Post ID and User ID cannot be null");
        }

        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Check if like already exists
        if (likeRepository.existsByPostIdAndUserId(postId, userId)) {
            throw new IllegalStateException("User has already liked this post");
        }

        Like like = new Like();
        like.setPost(post);
        like.setUser(user);
        like.setCreatedAt(LocalDateTime.now());

        try {
            return likeRepository.save(like);
        } catch (Exception e) {
            log.error("Error creating like: {}", e.getMessage());
            throw new RuntimeException("Failed to create like", e);
        }
    }

    public long getLikeCount(Long postId) {
        if (postId == null) {
            log.error("Attempted to get like count with null postId");
            throw new IllegalArgumentException("Post ID cannot be null");
        }
        try {
            return likeRepository.countByPostId(postId);
        } catch (Exception e) {
            log.error("Error getting like count for post {}: {}", postId, e.getMessage());
            throw new RuntimeException("Failed to get like count", e);
        }
    }

    public boolean hasUserLikedPost(Long postId, Long userId) {
        if (postId == null || userId == null) {
            log.error("Attempted to check like status with null postId or userId");
            throw new IllegalArgumentException("Post ID and User ID cannot be null");
        }
        try {
            return likeRepository.existsByPostIdAndUserId(postId, userId);
        } catch (Exception e) {
            log.error("Error checking if user {} liked post {}: {}", userId, postId, e.getMessage());
            throw new RuntimeException("Failed to check like status", e);
        }
    }

    public void deleteLike(Long postId, Long userId) {
        if (postId == null || userId == null) {
            log.error("Attempted to delete like with null postId or userId");
            throw new IllegalArgumentException("Post ID and User ID cannot be null");
        }
        try {
            likeRepository.deleteByPostIdAndUserId(postId, userId);
        } catch (Exception e) {
            log.error("Error deleting like for post {} and user {}: {}", postId, userId, e.getMessage());
            throw new RuntimeException("Failed to delete like", e);
        }
    }

    public List<Like> getLikesByPostId(Long postId) {
        return likeRepository.findByPostId(postId);
    }

    public List<Like> getLikesByUserId(Long userId) {
        return likeRepository.findByUserId(userId);
    }
} 