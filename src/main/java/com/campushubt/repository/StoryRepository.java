package com.campushubt.repository;

import com.campushubt.model.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.List;

@Repository
public interface StoryRepository extends JpaRepository<Story, Long> {
    @Query("SELECT s FROM Story s WHERE s.expiresAt > :now ORDER BY s.createdAt DESC")
    List<Story> findActiveStories(@Param("now") Instant now);

    @Query("""
        SELECT s FROM Story s 
        WHERE s.user.id = :userId 
        AND s.expiresAt > :currentTime 
        ORDER BY s.createdAt DESC
        """)
    List<Story> findStoriesForUser(
        @Param("userId") Long userId, 
        @Param("currentTime") Instant currentTime
    );
} 