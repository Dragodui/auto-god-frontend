import { LoginData, RegisterData } from "./../types";
import api from "./api";

export const register = async (data: RegisterData) => {
  try {
    const { email, name, lastName, nickname, password } = data;
    const response = await api.post("/auth/register", {
      email,
      name,
      lastName,
      nickname,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error while register: ", error);
  }
};

export const login = async (formData: LoginData) => {
    try {
      const { email, password } = formData;
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      return response;
    } catch (error) {
      console.error("Error while login: ", error);
    }
  };
  
export const logOut = async() => {
    try {
        const response = await api.post("/auth/logout");
        return response;
    } catch (error) {
        console.error("Error while logout: ", error);
        
    }
}

export const getMe = async () => {
    try {
      const response = await api.get("/auth/me");
      return response;
    } catch (error) {
      console.error("Error while getting user data: ", error);
    }
  };
  