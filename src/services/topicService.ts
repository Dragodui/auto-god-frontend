import api from '@/utils/api';
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

export const getTopicItems = async (
  topicName: string,
  type: 'news' | 'posts'
) => {
  try {
    const response = await api.get(`/${type}/topic/${topicName}`);
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
