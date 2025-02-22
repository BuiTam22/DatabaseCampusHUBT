package com.campushubt.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Data
@Entity
@Table(name = "Stories")
public class Story {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "StoryID")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID")
    private User user;

    @Column(name = "MediaUrl")
    private String mediaUrl;

    @Column(name = "MediaType")
    private String mediaType;

    @Column(name = "CreatedAt")
    private Instant createdAt;

    @Column(name = "ExpiresAt")
    private Instant expiresAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        expiresAt = createdAt.plus(24, ChronoUnit.HOURS);
    }

    public void setImageUrl(String imageUrl) {
        this.mediaUrl = imageUrl;
        this.mediaType = "IMAGE";
    }
}