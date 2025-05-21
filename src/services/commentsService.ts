import api from '@/utils/api';
import { Comment } from '@/types';

export const getCommentsForPost = async (
  postId: string
): Promise<Comment[]> => {
  try {
    const response = await api.get(`/comments/${postId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const addComment = async (
  postId: string,
  content: string,
  replyTo?: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const response = await api.post('/comments', {
      content,
      postId,
      replyTo,
    });
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error adding comment:', error);
    return { success: false, error };
  }
};

export const likeComment = async (
  commentId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const response = await api.put(`/comments/like/${commentId}`);
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error liking comment:', error);
    return { success: false, error };
  }
};

export const deleteComment = async (
  commentId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const response = await api.delete(`/admin/comments/${commentId}`);
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error };
  }
};
