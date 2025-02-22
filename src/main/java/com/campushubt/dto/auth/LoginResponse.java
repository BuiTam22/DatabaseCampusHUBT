package com.campushubt.dto.auth;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long userID;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String status;
    private String image;
}