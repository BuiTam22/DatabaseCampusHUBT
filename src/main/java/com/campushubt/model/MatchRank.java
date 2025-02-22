package com.campushubt.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "MatchRanks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchRank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "match_rank_id")
    private Long id;

    @Column(name = "match_id")
    private Long matchId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "rank_position")
    private Integer rankPosition;

    @Column(name = "score")
    private Integer score;
} 