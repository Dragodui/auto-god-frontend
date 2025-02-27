import api from '../utils/api';

export const getNews = async () => {
  try {
    const response = await api.get('/news');
    return response.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const createNew = async(title:string, content: string, topicId: string, isMarkDown: boolean, image: any | null, tags: string[]) => {
    const response = await api.post('/news', {
      title,
      content,
      tags,
      topicId,
      isMarkDown,
      image
    });
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      await api.post(`/news/${response.data.news._id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return response.data;
}
