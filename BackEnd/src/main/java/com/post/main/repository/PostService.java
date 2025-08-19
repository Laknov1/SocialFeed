package com.post.main.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.post.main.exception.ResourceNotFoundException;
import com.post.main.entity.Post;
import com.post.main.service.CommentService;


@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentService commentService;

    @Autowired
    private LikeRepository likeRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Post> getPostsByUser(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
    }

    public Post updatePost(Long id, Post postDetails) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        post.setContent(postDetails.getContent());
        post.setImage(postDetails.getImage());
        return postRepository.save(post);
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = postRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        // First delete all likes associated with this post
        likeRepository.deleteByPostId(id);
        // Then delete all comments associated with this post
        commentService.deleteCommentsByPostId(id);
        // Finally delete the post
        postRepository.delete(post);
    }

    @Transactional
    public void deletePostsByUserId(Long userId) {
        postRepository.deleteByUserId(userId);
    }
}
