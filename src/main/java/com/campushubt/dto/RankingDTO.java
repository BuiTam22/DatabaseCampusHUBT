package com.campushubt.dto;

import com.campushubt.model.UserRanking.TierType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RankingDTO {
    private Long id;
    private String name;
    private String username;
    private String avatar;
    private String tier;
    private Integer points;
    private Integer solved;
    private Integer accuracy;
    private Integer wins;
    private Integer monthlyScore;
    private Integer weeklyScore;

    // Constructor cho JPQL query với TierType
    public RankingDTO(Long id, String name, String username, String avatar, 
                     TierType tier, Integer points, Integer solved, 
                     Integer accuracy, Integer wins,
                     Integer monthlyScore, Integer weeklyScore) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.avatar = avatar;
        this.tier = tier != null ? tier.toString() : "BRONZE";
        this.points = points != null ? points : 0;
        this.solved = solved != null ? solved : 0;
        this.accuracy = accuracy != null ? accuracy : 0;
        this.wins = wins != null ? wins : 0;
        this.monthlyScore = monthlyScore != null ? monthlyScore : 0;
        this.weeklyScore = weeklyScore != null ? weeklyScore : 0;
    }

    // Constructor cho các query không cần monthlyScore và weeklyScore với TierType
    public RankingDTO(Long id, String name, String username, String avatar, 
                     TierType tier, Integer points, Integer solved, 
                     Integer accuracy, Integer wins) {
        this(id, name, username, avatar, tier, points, solved, accuracy, wins, null, null);
    }

    // Static factory method để tạo instance từ String tier
    public static RankingDTO createWithStringTier(Long id, String name, String username, String avatar, 
                                                String tier, Integer points, Integer solved, 
                                                Integer accuracy, Integer wins,
                                                Integer monthlyScore, Integer weeklyScore) {
        RankingDTO dto = new RankingDTO();
        dto.id = id;
        dto.name = name;
        dto.username = username;
        dto.avatar = avatar;
        dto.tier = tier != null ? tier : "BRONZE";
        dto.points = points != null ? points : 0;
        dto.solved = solved != null ? solved : 0;
        dto.accuracy = accuracy != null ? accuracy : 0;
        dto.wins = wins != null ? wins : 0;
        dto.monthlyScore = monthlyScore != null ? monthlyScore : 0;
        dto.weeklyScore = weeklyScore != null ? weeklyScore : 0;
        return dto;
    }

    // Static factory method cho các query không cần monthlyScore và weeklyScore với String tier
    public static RankingDTO createWithStringTier(Long id, String name, String username, String avatar, 
                                                String tier, Integer points, Integer solved, 
                                                Integer accuracy, Integer wins) {
        return createWithStringTier(id, name, username, avatar, tier, points, solved, accuracy, wins, null, null);
    }
} 