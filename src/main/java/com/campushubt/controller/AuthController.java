package com.campushubt.controller;

import com.campushubt.dto.auth.LoginRequest;
import com.campushubt.dto.auth.LoginResponse;
import com.campushubt.dto.auth.RegisterRequest;
import com.campushubt.dto.auth.AuthResponse;
import com.campushubt.dto.auth.ErrorResponse;
import com.campushubt.dto.auth.JwtResponse;
import com.campushubt.dto.response.MessageResponse;
import com.campushubt.security.UserDetailsImpl;
import com.campushubt.dto.auth.UserDTO;

import com.campushubt.model.User;
import com.campushubt.service.AuthService;
import com.campushubt.service.UserService;
import com.campushubt.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Date;
import com.campushubt.exception.BadRequestException;
import com.campushubt.exception.AccountDisabledException;
import com.campushubt.exception.EmailAlreadyExistsException;
import com.campushubt.exception.UsernameAlreadyExistsException;
import org.springframework.security.core.AuthenticationException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.ok().body(new MessageResponse("Đăng ký thành công"));
        } catch (EmailAlreadyExistsException | UsernameAlreadyExistsException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage(), false));
        } catch (Exception e) {
            logger.error("Registration error", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Đã xảy ra lỗi trong quá trình đăng ký", false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (AccountDisabledException e) {
            logger.error("Login attempt on disabled account", e);
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse(e.getMessage(), true));
        } catch (AuthenticationException e) {
            logger.error("Authentication failed", e);
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(e.getMessage(), false));
        } catch (Exception e) {
            logger.error("Login error", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("An error occurred during login", false));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        logger.info("Password reset requested for email: {}", email);
        authService.sendPasswordResetToken(email);
        return ResponseEntity.ok().body("Password reset email sent");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword) {
        logger.info("Password reset attempt with token");
        authService.resetPassword(token, newPassword);
        return ResponseEntity.ok().body("Password reset successful");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            User user = authService.getCurrentUser();
            
            // Convert to DTO to avoid circular references
            return ResponseEntity.ok(new UserDTO(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole().toString(),
                user.getStatus().toString(),
                user.getImage(),
                user.getAvatarUrl()
            ));

        } catch (BadCredentialsException e) {
            logger.error("Authentication failed", e);
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Not authenticated", false));
        } catch (Exception e) {
            logger.error("Error getting current user", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ErrorResponse("Error retrieving user details", false));
        }
    }
}