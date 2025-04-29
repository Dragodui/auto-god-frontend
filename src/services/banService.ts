import api from '@/utils/api';

interface BanUserData {
  userId: string;
  reason: string;
  duration?: number;
}

export const banUser = async (data: BanUserData) => {
  try {
    const response = await api.post('/admin/bans', data);
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error banning user:', error);
    return { success: false, error };
  }
};

export const unbanUser = async (userId: string) => {
  try {
    const response = await api.delete(`/admin/bans/${userId}`);
    return { success: true, ...response.data };
  } catch (error) {
    console.error('Error unbanning user:', error);
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