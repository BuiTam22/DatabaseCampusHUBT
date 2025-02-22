package com.campushubt.repository;

import com.campushubt.model.User;
import com.campushubt.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    Optional<User> findByGoogleId(String googleId);
    
    Boolean existsByUsername(String username);
    
    Boolean existsByEmail(String email);
    
    @Modifying
    @Query("UPDATE User u SET u.lastLogin = ?2 WHERE u.userId = ?1")
    void updateLastLogin(Long userId, LocalDateTime lastLogin);
    
    @Modifying
    @Query("UPDATE User u SET u.status = :status WHERE u.userId = :userId")
    void updateUserStatus(@Param("userId") Long userId, @Param("status") UserStatus status);
    
    @Modifying
    @Query("UPDATE User u SET u.resetToken = ?2, u.resetTokenExpiry = ?3 WHERE u.email = ?1")
    void updateResetToken(String email, String resetToken, LocalDateTime resetTokenExpiry);
    
    Optional<User> findByResetToken(String resetToken);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.lastLogin = CURRENT_TIMESTAMP WHERE u.username = :username")
    void updateLastLogin(@Param("username") String username);

    @Modifying
    @Query("UPDATE User u SET u.lastLogin = :lastLogin WHERE u.userId = :userId")
    void updateLastLogin(@Param("userId") Long userId, @Param("lastLogin") Date lastLogin);

    Optional<User> findByUsernameOrEmail(String username, String email);

    List<User> findByUsernameContainingOrEmailContainingOrFullNameContaining(
        String username, String email, String fullName
    );

    List<User> findByUsernameContainingIgnoreCaseOrFullNameContainingIgnoreCase(
        String username, String fullName
    );

    @Query(value = "SELECT COUNT(1) FROM Users WHERE IsDeleted = 0", 
           nativeQuery = true)
    long countByIsDeletedFalse();
    
    @Query(value = """
        SELECT COUNT(1) FROM Users 
        WHERE LastLoginAt > :date AND IsDeleted = 0
        """, nativeQuery = true)
    long countByLastLoginAtAfterAndIsDeletedFalse(@Param("date") LocalDateTime date);
}