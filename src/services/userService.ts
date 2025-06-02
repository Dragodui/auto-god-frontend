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

export const changePassword = async (passwordForm: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    console.log(passwordForm)
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      return {message: 'Both current and new passwords are required'};
    }
  if (passwordForm.currentPassword === passwordForm.newPassword) {
    return {message: 'New password must be different from the current password'};
  }
    const response = await api.patch('/user/changePassword', {
      oldPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error while changing password: ', error);
    
    const errorData = error.response?.data;
    if (errorData?.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      return errorData.errors[0];
    }
    return errorData || 'An error occurred';
  }
}