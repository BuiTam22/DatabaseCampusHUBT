package com.campushubt.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class JwtAuthResponse {
    private String token;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String status;
    private String image;
}
