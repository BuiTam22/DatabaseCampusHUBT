package com.campushubt.service;

import com.campushubt.dto.RankingDTO;
import com.campushubt.model.UserRanking;
import com.campushubt.repository.UserRankingRepository;
import com.campushubt.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RankingService {
    private final UserRankingRepository userRankingRepository;
    private final UserRepository userRepository;

    public List<RankingDTO> getTopRankings(int limit) {
        return userRankingRepository.findTopRankings()
            .stream()
            .limit(limit)
            .collect(Collectors.toList());
    }

    public RankingDTO getUserRanking(Long userId) {
        return userRankingRepository.findUserRankingById(userId)
            .orElse(RankingDTO.createWithStringTier(
                userId,
                null,
                null,
                null,
                "BRONZE",
                0,
                0,
                0,
                0,
                0,
                0
            ));
    }

    public List<RankingDTO> getMonthlyRankings() {
        LocalDateTime monthStart = LocalDateTime.now()
            .withDayOfMonth(1)
            .withHour(0)
            .withMinute(0)
            .withSecond(0);
        return userRankingRepository.findMonthlyRankings(monthStart);
    }

    public List<RankingDTO> getWeeklyRankings() {
        LocalDateTime weekStart = LocalDateTime.now()
            .minusDays(LocalDateTime.now().getDayOfWeek().getValue() - 1)
            .withHour(0)
            .withMinute(0)
            .withSecond(0);
        return userRankingRepository.findWeeklyRankings(weekStart);
    }

    public List<RankingDTO> getExerciseRankings() {
        return userRankingRepository.findExerciseRankings();
    }

    public List<RankingDTO> getContestRankings() {
        return userRankingRepository.findContestRankings();
    }

    public void updateUserRanking(Long userId, int score, boolean isContest) {
        UserRanking ranking = userRankingRepository.findByUserIdAndCategoryId(userId, isContest ? 2 : 1)
            .orElseGet(() -> {
                UserRanking newRanking = new UserRanking();
                newRanking.setUser(userRepository.getById(userId));
                newRanking.setCategoryId(isContest ? 2 : 1);
                return newRanking;
            });

        ranking.setTotalScore(ranking.getTotalScore() + score);
        ranking.setLastUpdated(LocalDateTime.now());
        
        ranking.setMonthlyScore(ranking.getMonthlyScore() + score);
        ranking.setWeeklyScore(ranking.getWeeklyScore() + score);
        
        userRankingRepository.save(ranking);
    }
}