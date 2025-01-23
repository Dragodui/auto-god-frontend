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

export const getMe = async () => {
    try {
      const response = await api.get("/auth/me");
      return response;
    } catch (error) {
      console.error("Error while getting user data: ", error);
    }
  };

// export const checkIfLoggedIn = async (): Promise<boolean> => {
//   try {
//     const response = await getMe();
//     return (response?.status === 200 && response !== undefined)  ? true : false;
//   } catch (error) {
//     console.error("Error while checking if user is logged in: ", error);
//   }
// }