package com.campushubt.repository;

import com.campushubt.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query(value = """
        SELECT p.* 
        FROM Posts p
        WHERE p.IsDeleted = 0
        ORDER BY p.CreatedAt DESC
        OFFSET :#{#pageable.offset} ROWS
        FETCH NEXT :#{#pageable.pageSize} ROWS ONLY
        """, 
        countQuery = "SELECT COUNT(1) FROM Posts WHERE IsDeleted = 0",
        nativeQuery = true)
    Page<Post> findAllByIsDeletedFalseOrderByCreatedAtDesc(Pageable pageable);
    
    @Query(value = "SELECT COUNT(1) FROM Posts WHERE CreatedAt > :date AND IsDeleted = 0", 
           nativeQuery = true)
    long countByCreatedAtAfterAndIsDeletedFalse(@Param("date") LocalDateTime date);
    
    @Query(value = """
        SELECT TOP 5 p.* 
        FROM Posts p 
        LEFT JOIN Comments c ON p.PostID = c.PostID 
        WHERE p.CreatedAt > :date AND p.IsDeleted = 0
        GROUP BY p.PostID, p.UserID, p.Content, p.CreatedAt, p.UpdatedAt, 
                 p.IsDeleted, p.LikesCount, p.CommentsCount, p.SharesCount
        ORDER BY COUNT(c.CommentID) DESC, p.CreatedAt DESC
        """, nativeQuery = true)
    List<Post> findTrendingPosts(@Param("date") LocalDateTime date);

    @Query(value = "SELECT COUNT(1) FROM Posts WHERE IsDeleted = 0", 
           nativeQuery = true)
    long countByIsDeletedFalse();

    @Query(value = """
        SELECT p.PostID, p.UserID, p.Content, p.CreatedAt, p.UpdatedAt, 
               p.IsDeleted, p.LikesCount, 
               ISNULL(p.CommentsCount, 0) as CommentsCount,
               ISNULL(p.SharesCount, 0) as SharesCount
        FROM Posts p
        WHERE p.IsDeleted = 0
        ORDER BY p.CreatedAt DESC
        OFFSET :#{#pageable.offset} ROWS
        FETCH NEXT :#{#pageable.pageSize} ROWS ONLY
        """, 
        countQuery = """
            SELECT COUNT(1) 
            FROM Posts p 
            WHERE p.IsDeleted = 0
            """,
        nativeQuery = true)
    Page<Post> findByIsDeletedFalse(Pageable pageable);

    // Alias method to maintain compatibility
    default Page<Post> findAllActivePosts(Pageable pageable) {
        return findByIsDeletedFalse(pageable);
    }

    @Query("""
        SELECT p FROM Post p 
        WHERE p.user.id IN (
            SELECT f.following.id 
            FROM Follow f 
            WHERE f.follower.id = :userId
        ) AND p.isDeleted = false 
        ORDER BY p.createdAt DESC
        """)
    List<Post> findFeedPosts(@Param("userId") Long userId, Pageable pageable);

    @Query("""
        SELECT COUNT(p) FROM Post p 
        WHERE p.user.id IN (
            SELECT f.following.id 
            FROM Follow f 
            WHERE f.follower.id = :userId
        ) AND p.isDeleted = false
        """)
    long countFeedPosts(@Param("userId") Long userId);

    @Modifying
    @Query(value = """
        UPDATE Posts 
        SET LikesCount = LikesCount + 1 
        WHERE PostID = :postId
        """, nativeQuery = true)
    void incrementLikesCount(@Param("postId") Long postId);

    @Modifying
    @Query(value = """
        UPDATE Posts 
        SET LikesCount = CASE 
            WHEN LikesCount > 0 THEN LikesCount - 1 
            ELSE 0 
        END 
        WHERE PostID = :postId
        """, nativeQuery = true)
    void decrementLikesCount(@Param("postId") Long postId);
}