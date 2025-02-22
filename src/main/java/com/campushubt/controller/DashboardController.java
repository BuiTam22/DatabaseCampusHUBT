package com.campushubt.controller;

import java.util.List;
import com.campushubt.dto.dashboard.DashboardStatsDTO;
import com.campushubt.dto.PostDTO;  // Use this instead of com.campushubt.dto.post.PostDTO
import com.campushubt.service.DashboardService;
import com.campushubt.service.PostService;
import com.campushubt.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final PostService postService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/recent-posts")
    public ResponseEntity<Page<PostDTO>> getRecentPosts(
            @AuthenticationPrincipal User currentUser,
            Pageable pageable) {
        return ResponseEntity.ok(postService.getRecentPosts(currentUser.getUserID(), pageable));
    }

    @GetMapping("/trending-posts")
    public ResponseEntity<List<PostDTO>> getTrendingPosts() {
        return ResponseEntity.ok(postService.getTrendingPosts());
    }
}