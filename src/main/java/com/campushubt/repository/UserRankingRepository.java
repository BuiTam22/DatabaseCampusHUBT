package com.campushubt.repository;

import com.campushubt.dto.RankingDTO;
import com.campushubt.model.UserRanking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRankingRepository extends JpaRepository<UserRanking, Long> {
    
    @Query("""
        SELECT new com.campushubt.dto.RankingDTO(
            r.user.id,
            r.user.fullName,
            r.user.username,
            r.user.image,
            r.tier,
            r.totalScore,
            r.problemsSolved,
            CAST(r.accuracyRate as int),
            r.contestWins,
            r.monthlyScore,
            r.weeklyScore
        )
        FROM UserRanking r
        ORDER BY r.totalScore DESC
        """)
    List<RankingDTO> findTopRankings();

    @Query("""
        SELECT new com.campushubt.dto.RankingDTO(
            r.user.id, r.user.fullName, r.user.username, r.user.image,
            r.tier,
            r.totalScore,
            r.problemsSolved,
            CAST(r.accuracyRate as int),
            r.contestWins
        )
        FROM UserRanking r
        WHERE r.user.id = :userId
        """)
    Optional<RankingDTO> findUserRankingById(@Param("userId") Long userId);

    @Query("""
        SELECT new com.campushubt.dto.RankingDTO(
            r.user.id, r.user.fullName, r.user.username, r.user.image,
            r.tier,
            r.monthlyScore,
            r.problemsSolved,
            CAST(r.accuracyRate as int),
            r.contestWins,
            r.monthlyScore,
            r.weeklyScore
        )
        FROM UserRanking r
        WHERE r.lastUpdated >= :since
        ORDER BY r.monthlyScore DESC
        """)
    List<RankingDTO> findMonthlyRankings(@Param("since") LocalDateTime since);

    @Query("""
        SELECT new com.campushubt.dto.RankingDTO(
            r.user.id, r.user.fullName, r.user.username, r.user.image,
            r.tier,
            r.weeklyScore,
            r.problemsSolved,
            CAST(r.accuracyRate as int),
            r.contestWins,
            r.monthlyScore,
            r.weeklyScore
        )
        FROM UserRanking r
        WHERE r.lastUpdated >= :since
        ORDER BY r.weeklyScore DESC
        """)
    List<RankingDTO> findWeeklyRankings(@Param("since") LocalDateTime since);

    @Query("""
        SELECT new com.campushubt.dto.RankingDTO(
            r.user.id, 
            r.user.fullName, 
            r.user.username, 
            r.user.image,
            r.tier,
            r.totalScore,
            r.problemsSolved,
            CAST(r.accuracyRate as int),
            r.contestWins,
            r.monthlyScore,
            r.weeklyScore
        )
        FROM UserRanking r
        WHERE r.categoryId = 1
        ORDER BY r.totalScore DESC
        """)
    List<RankingDTO> findExerciseRankings();

    @Query("""
        SELECT new com.campushubt.dto.RankingDTO(
            r.user.id, 
            r.user.fullName, 
            r.user.username, 
            r.user.image,
            r.tier,
            r.totalScore,
            r.problemsSolved,
            CAST(r.accuracyRate as int),
            r.contestWins,
            r.monthlyScore,
            r.weeklyScore
        )
        FROM UserRanking r
        WHERE r.categoryId = 2
        ORDER BY r.totalScore DESC
        """)
    List<RankingDTO> findContestRankings();

    @Query("SELECT r FROM UserRanking r WHERE r.user.id = :userId AND r.categoryId = :categoryId")
    Optional<UserRanking> findByUserIdAndCategoryId(@Param("userId") Long userId, @Param("categoryId") int categoryId);
}