import api from '@/utils/api';
import { Activity, ChangeUserData, MessageResponse, User } from '@/types';

export const getCurrentProfileData = async (): Promise<
  User | MessageResponse
> => {
  try {
    const response = await api.get('/auth/me');
    return response.data || [];
  } catch (error) {
    console.error('Error while getting user info: ', error);
    return { message: 'Error while getting user info' };
  }
};

export const getLastUserActivity = async (): Promise<
  Activity[] | MessageResponse
> => {
  try {
    const response = await api.get('/user/activity');
    const lastActivity = response.data.lastActivityPosts;
    return lastActivity;
  } catch (error) {
    console.error('Error while getting last activity: ', error);
    return [];
  }
};

export const uploadUserAvatar = async (
  e: React.ChangeEvent<HTMLInputElement>
): Promise<void> => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('avatar', file);
  try {
    await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  } catch (error) {
    console.error('Error while uploading avatar: ', error);
  }
};

export const saveUserData = async (form: ChangeUserData): Promise<void> => {
  try {
    await api.put('/user/data', form);
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error while getting user by id: ', error);
  }
};
