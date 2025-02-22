package com.campushubt.controller;

import com.campushubt.dto.CommentDTO;
import com.campushubt.service.CommentService;
import com.campushubt.service.UserService;
import com.campushubt.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<CommentDTO> createComment(
            @PathVariable Long postId,
            @RequestBody String content,
            Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        CommentDTO comment = commentService.createComment(postId, content, user);
        return ResponseEntity.ok(comment);
    }

    @GetMapping
    public ResponseEntity<List<CommentDTO>> getPostComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getPostComments(postId));
    }
}
