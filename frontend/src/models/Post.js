export class Post {
  constructor(data) {
    // Core post data
    this.postID = data.postID;
    this.content = data.content;
    this.mediaUrl = data.mediaUrl;
    this.type = data.type || 'NORMAL';
    this.privacy = data.privacy || 'PUBLIC';
    
    // Metrics
    this.likesCount = data.likesCount || 0;
    this.commentsCount = data.commentsCount || 0;
    this.sharesCount = data.sharesCount || 0;

    // Timestamps
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
    
    // Status flags
    this.isDeleted = data.isDeleted || false;
    this.isLiked = data.isLiked || false;
    
    // User data normalization
    if (data.user) {
      this.user = {
        id: data.user.id,
        fullName: data.user.fullName,
        username: data.user.username,
        imageUrl: data.user.imageUrl
      };
    }
  }

  // Helper methods
  isPublic() {
    return this.privacy === 'PUBLIC';
  }

  canEdit(currentUserId) {
    return this.user && this.user.id === currentUserId;
  }

  getTypeLabel() {
    switch (this.type) {
      case 'ANNOUNCEMENT':
        return 'Announcement';
      case 'EVENT':
        return 'Event';
      default:
        return 'Post';
    }
  }

  getTimeAgo() {
    const now = new Date();
    const diffInSeconds = Math.floor((now - this.createdAt) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths}mo`;
    
    return `${Math.floor(diffInMonths / 12)}y`;
  }
}