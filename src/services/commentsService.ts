import api from '@/utils/api';

export const getCommentsForPost = async (postId: string) => {
  const response = await api.get(`/comments/${postId}`);
  return response.data;
};

export const addComment = async (
  postId: string,
  content: string,
  replyTo?: string
) => {
  const response = await api.post('/comments', {
    content,
    postId,
    replyTo,
  });
  return response.data;
};

export const likeComment = async (commentId: string) => {
  const response = await api.put(`/comments/like/${commentId}`);
  return response.data;
}
