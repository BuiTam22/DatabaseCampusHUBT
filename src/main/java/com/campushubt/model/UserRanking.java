package com.campushubt.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "UserRankings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRanking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "RankingID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID")
    private User user;

    @Column(name = "TotalScore")
    private Integer totalScore = 0;

    @Column(name = "ProblemsSolved")
    private Integer problemsSolved = 0;

    @Column(name = "ContestWins")
    private Integer contestWins = 0;

    @Column(name = "AccuracyRate")
    private Double accuracyRate = 0.0;

    @Column(name = "LastUpdated")
    private LocalDateTime lastUpdated;

    @Column(name = "RankTier")
    @Enumerated(EnumType.STRING)
    private TierType tier = TierType.BRONZE;

    @Column(name = "MonthlyScore")
    private Integer monthlyScore = 0;

    @Column(name = "WeeklyScore")
    private Integer weeklyScore = 0;

    @Column(name = "CategoryID")
    private Integer categoryId = 1; // 1 for Exercise, 2 for Contest

    public enum TierType {
        BRONZE, SILVER, GOLD, PLATINUM, DIAMOND;

        @Override
        public String toString() {
            return name();
        }

        public static TierType fromScore(int score) {
            if (score >= 2000) return DIAMOND;
            if (score >= 1500) return PLATINUM;
            if (score >= 1000) return GOLD;
            if (score >= 500) return SILVER;
            return BRONZE;
        }
    }

    @PrePersist
    @PreUpdate
    public void updateTier() {
        this.tier = TierType.fromScore(this.totalScore);
        this.lastUpdated = LocalDateTime.now();
    }
} 