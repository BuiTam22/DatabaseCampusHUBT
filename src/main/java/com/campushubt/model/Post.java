package com.campushubt.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "Posts")
@NoArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PostID")
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID")
    private User user;

    @Column(name = "Content")
    private String content;

    @Column(name = "Type")
    private String type = "regular";

    @Column(name = "Visibility")
    private String visibility = "public";

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostMedia> mediaList = new ArrayList<>();

    @Column(name = "LikesCount")
    private Integer likesCount = 0;

    @Column(name = "CommentsCount")
    private Integer commentsCount = 0;

    @Column(name = "SharesCount")
    private Integer sharesCount = 0;

    @Column(name = "CreatedAt")
    private LocalDateTime createdAt;

    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @Column(name = "IsDeleted")
    private Boolean isDeleted = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void incrementCommentsCount() {
        this.commentsCount = (this.commentsCount != null ? this.commentsCount : 0) + 1;
    }

    public void decrementCommentsCount() {
        this.commentsCount = Math.max(0, (this.commentsCount != null ? this.commentsCount : 0) - 1);
    }

    public void incrementSharesCount() {
        this.sharesCount = (this.sharesCount != null ? this.sharesCount : 0) + 1;
    }

    public void decrementSharesCount() {
        this.sharesCount = Math.max(0, (this.sharesCount != null ? this.sharesCount : 0) - 1);
    }
}