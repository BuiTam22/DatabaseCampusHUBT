package com.campushubt.dto.post;

import com.campushubt.dto.UserDTO;
import com.campushubt.dto.MediaDTO;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostDTO {
    private Long id;
    private String content;
    private UserDTO user;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Integer likesCount;
    private Integer commentsCount;
    private List<MediaDTO> media;
    private boolean liked;
} 