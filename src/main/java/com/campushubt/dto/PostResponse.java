package com.campushubt.dto;

import lombok.Data;
import lombok.Builder;
import com.campushubt.dto.UserDTO;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String content;
    private UserDTO user;
    private LocalDateTime createdAt;
    private int likesCount;
    private int commentsCount;
    private boolean isLiked;
    private List<String> media;
} 