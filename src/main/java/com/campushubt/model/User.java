package com.campushubt.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;

@Data
@Entity
@Table(name = "Users")
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Long userId;

    @Column(name = "Username", nullable = false, unique = true)
    private String username;

    @Column(name = "Email", nullable = false, unique = true)
    private String email;

    @Column(name = "Password", nullable = false)
    private String password;

    @Column(name = "FullName", nullable = false)
    private String fullName;

    @Column(name = "DateOfBirth")
    private Date dateOfBirth;

    @Column(name = "School")
    private String school;

    @Enumerated(EnumType.STRING)
    @Column(name = "Role")
    private UserRole role;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status")
    private UserStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "AccountStatus")
    private AccountStatus accountStatus;

    @Column(name = "Image")
    private String image;

    @Column(name = "Bio", length = 500)
    private String bio;

    @Column(name = "Provider", columnDefinition = "VARCHAR(20) DEFAULT 'local'")
    private String provider = "local";

    @Column(name = "ProviderID")
    private String providerId;

    @Column(name = "EmailVerified")
    private Boolean emailVerified = false;

    @Column(name = "PhoneNumber", length = 15)
    private String phoneNumber;

    @Column(name = "Address")
    private String address;

    @Column(name = "City")
    private String city;

    @Column(name = "Country")
    private String country;

    @Column(name = "LastLoginIP", length = 45)
    private String lastLoginIp;

    @Column(name = "LastLogin")
    private LocalDateTime lastLogin;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private Date updatedAt;

    @Column(name = "LastLoginAt")
    private Date lastLoginAt;

    @Column(name = "DeletedAt")
    private Date deletedAt;

    @Column(name = "GoogleId")
    private String googleId;

    @Column(name = "ResetToken", length = 255)
    private String resetToken;

    @Column(name = "ResetTokenExpiry")
    private LocalDateTime resetTokenExpiry;

    @Column(name = "LastLogout")
    private Date lastLogout;

    @Column(name = "IsDeleted")
    private Boolean isDeleted = false;

    @Column(name = "AvatarUrl")
    private String avatarUrl;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Getters for frontend compatibility
    public Long getId() {
        return this.userId;
    }

    public String getAvatarUrl() {
        return this.image;
    }

    public Long getUserID() {
        return this.getUserId();
    }

    // UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !AccountStatus.LOCKED.equals(accountStatus);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return !AccountStatus.DELETED.equals(accountStatus);
    }

    // Helper methods
    public void setLastLogin(LocalDateTime lastLogin) {
        this.lastLogin = lastLogin;
    }

    public LocalDateTime getLastLogin() {
        return this.lastLogin;
    }

    public void setLastLogin(Date date) {
        this.lastLoginAt = date;
    }

    public boolean isAccountLocked() {
        return AccountStatus.LOCKED.equals(this.accountStatus);
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public UserStatus getStatus() {
        return this.status;
    }

    public Long getUserId() {
        return this.userId;
    }
}