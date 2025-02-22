package com.campushubt.repository;

import com.campushubt.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    @Query(value = """
        SELECT CAST(
            CASE WHEN COUNT(1) > 0 THEN 1 ELSE 0 END
            AS BIT
        )
        FROM PostLikes l
        WHERE l.PostID = :postId AND l.UserID = :userId
        """, nativeQuery = true)
    boolean existsByPost_PostIdAndUser_UserID(@Param("postId") Long postId, @Param("userId") Long userId);

    @Modifying
    @Query(value = """
        DELETE FROM PostLikes
        WHERE PostID = :postId AND l.UserID = :userId
        """, nativeQuery = true)
    void deleteByPost_PostIdAndUser_UserID(@Param("postId") Long postId, @Param("userId") Long userId);

    @Query(value = """
        SELECT COUNT(1) 
        FROM Likes 
        WHERE PostID = :postId
        """, nativeQuery = true)
    int countByPostId(@Param("postId") Long postId);
}