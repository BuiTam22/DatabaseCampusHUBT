package com.campushubt.controller;

import com.campushubt.model.Post;
import com.campushubt.model.User;
import com.campushubt.service.PostService;
import com.campushubt.dto.PostDTO;
import com.campushubt.dto.PostResponseDTO;
import com.campushubt.exception.UnauthorizedException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

import com.campushubt.security.CustomUserDetails;

@RestController
@RequestMapping({"/api/posts", "/posts"})
@RequiredArgsConstructor
@CrossOrigin(
    origins = {"http://localhost:3000", "https://your-production-domain.com"},
    allowCredentials = "true"
)
public class PostController {
    private final PostService postService;

    @GetMapping("/feed")
    public ResponseEntity<?> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(postService.getFeedPostsWithMetadata(
            user.getUserId(),
            page,
            size
        ));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDTO> createPost(
            @RequestParam(required = false) String content,
            @RequestParam(required = false) List<MultipartFile> media,
            @AuthenticationPrincipal User user
    ) {
        Post post = postService.createPost(content, media, user);
        PostDTO postDTO = postService.convertToDetailedDTO(post, user.getUserId());
        return ResponseEntity.ok(postDTO);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            @AuthenticationPrincipal User user) {
        postService.deletePost(postId, user);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }

    @PutMapping("/{postId}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long postId,
            @RequestParam("content") String content,
            @RequestParam(value = "media", required = false) MultipartFile media,
            @AuthenticationPrincipal User user) {
        Post post = postService.updatePost(postId, content, media, user);
        return ResponseEntity.ok(post);
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long postId,
            @AuthenticationPrincipal User user) {
        Map<String, Object> result = postService.toggleLike(postId, user.getUserId());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPost(
        @PathVariable Long id,
        @AuthenticationPrincipal User user
    ) {
        PostDTO postDTO = postService.getPostWithDetails(id, user);
        return ResponseEntity.ok(postDTO);
    }

    @GetMapping("/public")
    public ResponseEntity<Page<PostResponseDTO>> getPublicPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit) {
        Page<PostResponseDTO> posts = postService.getPublicPosts(page, limit);
        return ResponseEntity.ok(posts);
    }
}