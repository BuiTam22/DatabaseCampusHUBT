import axios from 'axios';

export const getPosts = async (page = 0, limit = 10) => {
  const response = await axios.get(`/api/posts/feed?page=${page}&limit=${limit}`);
  return response.data;
};

export const createPost = async (content, media) => {
  const formData = new FormData();
  formData.append('content', content);
  if (media) {
    formData.append('media', media);
  }

  const response = await axios.post('/api/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deletePost = async (postId) => {
  await axios.delete(`/api/posts/${postId}`);
}; 