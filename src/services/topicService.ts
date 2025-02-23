import api from '@/api/api';
import { MessageResponse, Topic } from '@/types';

export const getForumTopics = async (): Promise<MessageResponse | Topic[]> => {
  try {
    const response = await api.get('/topics');
    return response.data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
