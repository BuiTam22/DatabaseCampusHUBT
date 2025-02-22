package com.campushubt.service;

import com.campushubt.dto.dashboard.DashboardStatsDTO;
import com.campushubt.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Transactional(readOnly = true)
    public DashboardStatsDTO getDashboardStats() {
        LocalDateTime weekAgo = LocalDateTime.now().minusWeeks(1);
        
        long totalPosts = postRepository.countByIsDeletedFalse();
        long totalUsers = userRepository.countByIsDeletedFalse();
        long totalComments = commentRepository.countByIsDeletedFalse();
        
        // Đếm số lượng user active trong tuần qua
        long activeUsers = userRepository.countByLastLoginAtAfterAndIsDeletedFalse(weekAgo);
        
        // Đếm số bài post trong tuần
        long postsThisWeek = postRepository.countByCreatedAtAfterAndIsDeletedFalse(weekAgo);
        
        // Đếm số comment trong tuần
        long commentsThisWeek = commentRepository.countByCreatedAtAfterAndIsDeletedFalse(weekAgo);
        
        // Tính tỷ lệ tương tác
        double engagementRate = calculateEngagementRate(totalPosts, totalComments, totalUsers);

        return DashboardStatsDTO.builder()
                .totalPosts(totalPosts)
                .totalUsers(totalUsers)
                .totalComments(totalComments)
                .engagementRate(engagementRate)
                .activeUsers(activeUsers)
                .postsThisWeek(postsThisWeek)
                .commentsThisWeek(commentsThisWeek)
                .build();
    }

    private double calculateEngagementRate(long posts, long comments, long users) {
        if (users == 0) return 0;
        return ((double) (posts + comments) / users) * 100;
    }
} 