import api from "../utils/api";

export const getTags = async () => {
    try {
        const response = await api.get('/tags');
        return response.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}