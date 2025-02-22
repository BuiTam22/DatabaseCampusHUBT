package com.campushubt.controller;

import com.campushubt.model.User;
import com.campushubt.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")  // Note: /api prefix is added by server.servlet.context-path
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam("q") String query,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<User> users = userService.searchUsers(query);
        return ResponseEntity.ok(users);
    }

    // Các endpoint khác...
}