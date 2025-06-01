import api from '@/utils/api';

export const deletePost = async (postId: string) => {
  try {
    const response = await api.delete(`/admin/posts/${postId}`);
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error deleting post:', error);
    return { success: false, error };
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const response = await api.delete(`/admin/comments/${commentId}`);
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error deleting comment:', error);
    return { success: false, error };
  }
};

export const deleteNews = async (newsId: string) => {
  try {
    const response = await api.delete(`/admin/news/${newsId}`);
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error deleting news:', error);
    return { success: false, error };
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const response = await api.delete(`/admin/events/${eventId}`);
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { success: false, error };
  }
};

export const getBannedUsers = async () => {
  try {
    const response = await api.get('/admin/bans');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching banned users:', error);
    return { success: false, error };
  }
};

export const getUnacceptedEvents = async () => {
  try {
    const response = await api.get('/admin/events');
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error fetching unaccepted events:', error);
    return { success: false, error };
  }
};

export const acceptEvent = async (eventId: string) => {
  try {
    const response = await api.put(`/admin/events/${eventId}`);
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error accepting event:', error);
    return { success: false, error };
  }
}