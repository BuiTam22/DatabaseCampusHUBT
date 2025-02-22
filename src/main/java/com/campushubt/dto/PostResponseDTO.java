package com.campushubt.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponseDTO {
    private Long id;
    private String content;
    private Integer likesCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isLiked;
    private UserDTO user;
    private List<MediaDTO> media;
    private Integer commentsCount;
} 