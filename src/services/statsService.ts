import api from '@/utils/api';
import { Stats } from '@/types';

export const getForumStats = async (): Promise<Stats | null> => {
  try {
    const response = await api.get('/stats');
    return response.data || null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
