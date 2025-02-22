package com.campushubt.repository;

import com.campushubt.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query(value = "SELECT COUNT(1) FROM Comments WHERE IsDeleted = 0", 
           nativeQuery = true)
    long countByIsDeletedFalse();
    
    @Query(value = """
        SELECT COUNT(1) FROM Comments 
        WHERE CreatedAt > :date AND IsDeleted = 0
        """, nativeQuery = true)
    long countByCreatedAtAfterAndIsDeletedFalse(@Param("date") LocalDateTime date);

    List<Comment> findByPost_PostIdOrderByCreatedAtDesc(Long postId);
    Integer countByPost_PostId(Long postId);
}