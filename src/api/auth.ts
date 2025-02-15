import { useNavigate } from 'react-router-dom';
import { LoginData, RegisterData } from './../types';
import api from './api';

export const register = async (data: RegisterData) => {
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

export const login = async (formData: LoginData) => {
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


export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    console.log(response.data);
    window.location.reload();
    return response.data;
  } catch (error) {
    console.error('Error while logout: ', error);
  }
};

export const getMyInfo = async () => {
  try {
    const response = await api.get('/auth/me');
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error while getting me: ', error);
  }
};

// export const getMe = async () => {
//     try {
//       const response = await api.get("/auth/me");
//       return response;
//     } catch (error) {
//       console.error("Error while getting user data: ", error);
//     }
//   };

// export const checkIfLoggedIn = async (): Promise<boolean> => {
//   try {
//     const response = await getMe();
//     return (response?.status === 200 && response !== undefined)  ? true : false;
//   } catch (error) {
//     console.error("Error while checking if user is logged in: ", error);
//   }
// }
