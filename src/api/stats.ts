import api from "./api";

export const getStats = async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };