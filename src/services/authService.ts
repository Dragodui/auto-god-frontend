import { LoginData, MessageResponse, RegisterData } from '../types';
import api from '../utils/api';

export const register = async (
  data: RegisterData
): Promise<MessageResponse> => {
  try {
    const { email, name, lastName, nickname, password } = data;
    const response = await api.post('/auth/register', {
      email,
      name,
      lastName,
      nickname,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error while register: ', error);
    if (error.response && error.response.data.errors) {
      throw error.response.data.errors;
    } else {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }
};

export const login = async (formData: LoginData): Promise<MessageResponse> => {
  try {
    const { login, password } = formData;
    const response = await api.post('/auth/login', {
      login,
      password,
    });
    return response.data;
  } catch (error: any) {
    console.error('Error while login: ', error);

    if (error.response && error.response.data.errors) {
      throw error.response.data.errors;
    } else {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }
};

export const logout = async (): Promise<MessageResponse> => {
  try {
    const response = await api.post('/auth/logout');
    window.location.reload();
    return response.data;
  } catch (error: any) {
    console.error('Error while logout: ', error);
    return { message: 'Logout failed' };
  }
};
