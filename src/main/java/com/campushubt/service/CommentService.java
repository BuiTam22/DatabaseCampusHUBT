package com.campushubt.service;

import com.campushubt.model.Comment;
import com.campushubt.model.Post;
import com.campushubt.model.User;
import com.campushubt.repository.CommentRepository;
import com.campushubt.repository.PostRepository;
import com.campushubt.dto.CommentDTO;
import com.campushubt.dto.UserDTO;
import com.campushubt.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    @Transactional
    public CommentDTO createComment(Long postId, String content, User user) {
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setUser(user);
        comment.setPost(post);
        
        Comment savedComment = commentRepository.save(comment);
        
        // Increment post's comment count
        post.incrementCommentsCount();
        postRepository.save(post);
        
        return convertToDTO(savedComment);
    }

    public List<CommentDTO> getPostComments(Long postId) {
        return commentRepository.findByPost_PostIdOrderByCreatedAtDesc(postId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public Integer getCommentCount(Long postId) {
        return commentRepository.countByPost_PostId(postId);
    }

    private CommentDTO convertToDTO(Comment comment) {
        CommentDTO dto = new CommentDTO();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt().atZone(ZoneId.systemDefault()).toLocalDateTime());
        dto.setPostId(comment.getPost().getPostId());
        dto.setPostId(comment.getPost().getPostId());
        
        UserDTO userDTO = new UserDTO();
        userDTO.setId(comment.getUser().getUserId());
        userDTO.setUsername(comment.getUser().getUsername());
        userDTO.setFullName(comment.getUser().getFullName());
        userDTO.setImage(comment.getUser().getImage());
        dto.setUser(userDTO);
        
        return dto;
    }
}
