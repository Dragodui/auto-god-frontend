import { Tag } from '@/types';
import api from '@/utils/api';

export const getEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};
export const getEvent = async (eventId: string) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
  }
};

export const createEvent = async (
  image: any | null,
  date: Date,
  title: string,
  place: string,
  content: string,
  tags: string[]
) => {
  try {
    const eventData = {
      title,
      date: date.toISOString(),
      place,
      content,
      tags: tags,
    };
    const response = await api.post('/events', eventData);
    if (image) {
      const formData = new FormData();
      formData.append('image', image);
      await api.post(`/events/${response.data.event._id}/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
  }
};

export const likeEvent = async (eventId: string) => {
  const response = await api.put(`/events/like/${eventId}`);
  return response.data;
};

export const viewEvent = async (eventId: string) => {
  const response = await api.put(`/events/views/${eventId}`);
  return response.data;
};
