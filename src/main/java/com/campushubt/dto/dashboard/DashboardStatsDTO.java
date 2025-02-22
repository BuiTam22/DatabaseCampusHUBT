package com.campushubt.dto.dashboard;

import lombok.Data;
import lombok.Builder;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDTO {
    private long totalPosts;
    private long totalUsers;
    private long totalComments;
    private long totalCourses;
    private double engagementRate;
    private long activeUsers;
    private long postsThisWeek;
    private long commentsThisWeek;
}