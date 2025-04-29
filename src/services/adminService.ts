import api from '../utils/api';

export const deletePost = async (postId: string) => {
  try {
    await api.delete(`/admin/posts/${postId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error };
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    await api.delete(`/admin/comments/${commentId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error };
  }
};

export const deleteNews = async (newsId: string) => {
  try {
    await api.delete(`/admin/news/${newsId}`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting news:', error);
    return { success: false, error };
  }
}; 