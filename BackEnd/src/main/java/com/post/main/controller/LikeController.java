package com.post.main.controller;

import com.post.main.entity.Like;
import com.post.main.service.LikeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class LikeController {
    private static final Logger logger = LoggerFactory.getLogger(LikeController.class);

    private final LikeService likeService;

    public LikeController(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping
    public ResponseEntity<?> createLike(@RequestBody Map<String, Long> request) {
        try {
            Long postId = request.get("postId");
            Long userId = request.get("userId");
            
            if (postId == null || userId == null) {
                return ResponseEntity.badRequest().body("Post ID and User ID are required");
            }

            Like like = likeService.createLike(postId, userId);
            return ResponseEntity.ok(like);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create like");
        }
    }

    @DeleteMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<Void> deleteLike(@PathVariable Long postId, @PathVariable Long userId) {
        try {
            likeService.deleteLike(postId, userId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            logger.error("Invalid request parameters: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error deleting like: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Like>> getLikesByPostId(@PathVariable Long postId) {
        return ResponseEntity.ok(likeService.getLikesByPostId(postId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Like>> getLikesByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(likeService.getLikesByUserId(userId));
    }

    @GetMapping("/post/{postId}/user/{userId}")
    public ResponseEntity<Boolean> hasUserLikedPost(@PathVariable Long postId, @PathVariable Long userId) {
        try {
            boolean hasLiked = likeService.hasUserLikedPost(postId, userId);
            return ResponseEntity.ok(hasLiked);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid request parameters: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error checking like status: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/post/{postId}/count")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long postId) {
        try {
            long count = likeService.getLikeCount(postId);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid post ID: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error getting like count: {}", e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
} 