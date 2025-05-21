import api from '@/utils/api';

export const createPost = async (
  title: string,
  content: string,
  tags: string[],
  topicId: string,
  image?: any | null
) => {
  const response = await api.post('/posts', {
    title,
    content,
    tags,
    topicId,
    image,
  });
  if (image) {
    const formData = new FormData();
    formData.append('image', image);
    await api.post(`/posts/${response.data.post._id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
  return response.data;
};

export const getPost = async (postId: string) => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};

export const likePost = async (postId: string) => {
  const response = await api.put(`/posts/like/${postId}`);
  return response.data;
};

export const viewPost = async (postId: string) => {
  const response = await api.put(`/posts/views/${postId}`);
  return response.data;
};

export const getPosts = async () => {
  const response = await api.get('/posts');
  return response.data;
};
