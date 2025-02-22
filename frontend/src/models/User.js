export class User {
  constructor(data) {
    this.userID = data.userID || data.UserID;
    this.username = data.username || data.Username;
    this.email = data.email || data.Email;
    this.fullName = data.fullName || data.FullName;
    this.image = data.image || data.Image;
    this.coverImage = data.coverImage || data.CoverImage;
    this.bio = data.bio || data.Bio;
    this.role = data.role || data.Role || 'STUDENT';
    this.status = data.status || data.Status || 'OFFLINE';
    this.accountStatus = data.accountStatus || data.AccountStatus || 'ACTIVE';
    this.provider = data.provider || data.Provider || 'local';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : 
                     data.CreatedAt ? new Date(data.CreatedAt) : new Date();
    this.lastLogin = data.lastLogin ? new Date(data.lastLogin) : 
                     data.LastLogin ? new Date(data.LastLogin) : null;
    this.lastLogout = data.lastLogout ? new Date(data.lastLogout) : 
                     data.LastLogout ? new Date(data.LastLogout) : null;
  }

  isAdmin() {
    return this.role === 'ADMIN';
  }

  isTeacher() {
    return this.role === 'TEACHER';
  }

  isStudent() {
    return this.role === 'STUDENT';
  }

  isActive() {
    return this.accountStatus === 'ACTIVE';
  }

  isOnline() {
    return this.status === 'ONLINE';
  }
} 