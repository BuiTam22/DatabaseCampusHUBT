import axios from 'axios';
import authService from './authService';
import { API_BASE_URL } from '../config';

class ApiService {
  static async fetch(endpoint, options = {}) {
    try {
      if (!authService.isAuthenticated()) {
        authService.handleUnauthorized();
        return;
      }

      // Chuẩn hóa endpoint
      const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const url = `${API_BASE_URL}${cleanEndpoint}`;

      // Thêm query params nếu có
      if (options.params) {
        const params = new URLSearchParams(options.params);
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...authService.getAuthHeader(),
          ...options.headers
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  static async get(endpoint) {
    try {
      // Đảm bảo endpoint không bắt đầu bằng /api/
      const cleanEndpoint = endpoint.replace(/^\/api\//, '/');
      
      const response = await axios.get(`${API_BASE_URL}${cleanEndpoint}`, {
        headers: {
          ...authService.getAuthHeader()
        }
      });

      // Đảm bảo response data hợp lệ
      if (response.data === null || response.data === undefined) {
        return { data: [] };
      }

      return response;
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      throw error;
    }
  }

  // Post related methods
  static async getPosts(page = 1, limit = 10) {
    try {
      // Sửa endpoint để khớp với backend
      const response = await axios.get(`${API_BASE_URL}/posts`, { // Bỏ /feed
        params: {
          page: page - 1,
          size: limit
        },
        headers: {
          ...authService.getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      // Log response để debug
      console.log('API Response:', response);

      // Kiểm tra và xử lý response
      if (!response || !response.data) {
        throw new Error('Không nhận được dữ liệu từ server');
      }

      // Chuẩn hóa dữ liệu trả về
      const posts = response.data.content || response.data;
      if (!Array.isArray(posts)) {
        console.error('Invalid posts data:', posts);
        return { content: [], last: true };
      }

      return {
        content: posts.map(post => ({
          id: post.PostID || post.id,
          content: post.Content || post.content,
          type: post.Type || post.type,
          visibility: post.Visibility || post.visibility,
          createdAt: post.CreatedAt || post.createdAt,
          likesCount: post.LikesCount || post.likesCount || 0,
          commentsCount: post.CommentsCount || post.commentsCount || 0,
          user: post.user || {
            id: post.UserID,
            // Thêm các trường user khác nếu cần
          }
        })),
        last: response.data.last || false
      };

    } catch (error) {
      console.error('API Error:', error);
      if (error.response?.status === 401) {
        authService.handleUnauthorized();
      }
      throw new Error(error.response?.data?.message || 'Lỗi khi tải bài viết');
    }
  }

  static async getFeedPosts(page = 0, headers = {}) {
    try {
      // Thêm limit cố định là 10 posts mỗi trang
      const response = await axios.get(`/api/posts/feed`, {
        params: {
          page: page,
          limit: 10 // Đặt limit cố định thay vì truyền object
        },
        headers: {
          ...headers,
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      throw error;
    }
  }

  static async createPost(postData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, postData, {
        headers: {
          ...authService.getAuthHeader()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  static async updatePost(postId, formData) {
    return this.fetch(`/api/posts/${postId}`, {
      method: 'PUT',
      body: formData
    });
  }

  static async deletePost(postId) {
    return this.fetch(`/api/posts/${postId}`, {
      method: 'DELETE'
    });
  }

  static async likePost(postId) {
    try {
        const response = await this.fetch(`/api/posts/${postId}/like`, {
            method: 'POST'
        });
        
        return {
            data: {
                success: true,
                liked: response.liked,
                likesCount: response.likesCount
            }
        };
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
  }

  static async getPostComments(postId) {
    try {
        const response = await this.fetch(`/api/posts/${postId}/comments`);
        return {
            data: response || []
        };
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
  }

  static async addComment(postId, content) {
    try {
        const response = await this.fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify(content),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return {
            data: response
        };
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
  }

  static async searchUsers(query) {
    try {
      const response = await this.fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      console.log('Search API response:', response); // Thêm log để debug
      
      // Kiểm tra nếu response là array
      if (Array.isArray(response)) {
        return response;
      }
      
      // Kiểm tra nếu response có property data là array
      if (response && Array.isArray(response.data)) {
        return response.data;
      }
      
      // Trường hợp khác trả về mảng rỗng
      console.warn('Unexpected response format:', response);
      return [];
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }

  static async checkCourseEnrollment(courseId) {
    try {
      const response = await axios.get(`/api/courses/${courseId}/enrollment-status`, {
        headers: {
          ...authService.getAuthHeader()
        }
      });
      return response;
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      throw error;
    }
  }

  static async enrollCourse(courseId) {
    try {
      const response = await axios.post(`/api/courses/${courseId}/enroll`, null, {
        headers: {
          ...authService.getAuthHeader()
        }
      });
      return response;
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  }
}

export default ApiService;