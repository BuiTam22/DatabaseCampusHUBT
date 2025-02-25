package com.campushubt.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Username/Email is required")
    private String usernameOrEmail;

    @NotBlank(message = "Password is required")
    private String password;
}