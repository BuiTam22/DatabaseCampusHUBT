package com.campushubt.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String status;
    private String image;
    private String avatarUrl;
} 