package com.campushubt.controller;

import com.campushubt.dto.RankingDTO;
import com.campushubt.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rankings")
@RequiredArgsConstructor
public class RankingController {
    private final RankingService rankingService;

    @GetMapping("/top")
    public ResponseEntity<List<RankingDTO>> getTopRankings(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(rankingService.getTopRankings(limit));
    }

    @GetMapping("/exercise")
    public ResponseEntity<List<RankingDTO>> getExerciseRankings() {
        return ResponseEntity.ok(rankingService.getExerciseRankings());
    }

    @GetMapping("/contest")
    public ResponseEntity<List<RankingDTO>> getContestRankings() {
        return ResponseEntity.ok(rankingService.getContestRankings());
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<RankingDTO>> getMonthlyRankings() {
        return ResponseEntity.ok(rankingService.getMonthlyRankings());
    }

    @GetMapping("/weekly")
    public ResponseEntity<List<RankingDTO>> getWeeklyRankings() {
        return ResponseEntity.ok(rankingService.getWeeklyRankings());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<RankingDTO> getUserRanking(@PathVariable Long userId) {
        return ResponseEntity.ok(rankingService.getUserRanking(userId));
    }
} 