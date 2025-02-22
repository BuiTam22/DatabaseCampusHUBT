import axios from 'axios';
import authService from './authService';

class ApiService {
  // ... other methods ...

  static async createPost(formData) {
    try {
      const token = authService.getToken();
      const uploadHeaders = {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      };

      const response = await axios.post('/api/posts', formData, {
        headers: uploadHeaders,
        transformRequest: [(data) => {
          if (data instanceof FormData) return data;
          return JSON.stringify(data);
        }],
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted);
        }
      });

      // Normalize response data
      if (response.data) {
        return {
          data: {
            postId: response.data.postId,
            content: response.data.content,
            createdAt: response.data.createdAt,
            mediaList: response.data.mediaList || []
          }
        };
      }

      throw new Error('Invalid response from server');
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  }

  static async getFeedPosts(page = 0, limit = 10) {
    try {
      const token = authService.getToken();
      const response = await axios.get('/api/posts/feed', {
        params: { page, limit },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.error('Error fetching feed posts:', error);
      throw error;
    }
  }

  static async getCurrentUser() {
    try {
      const token = authService.getToken();
      const response = await axios.get('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  // Các methods khác...
}

export default ApiService; 