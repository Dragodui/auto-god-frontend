import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api';

interface News {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  topicId: string;
  isMarkDown: boolean;
  image?: string;
  likes: string[];
  views: string[];
  author: any;
  createdAt: string;
  updatedAt: string;
}

interface NewsState {
  news: News[];
  currentNews: News | null;
  loading: boolean;
  error: string | null;
}

const initialState: NewsState = {
  news: [],
  currentNews: null,
  loading: false,
  error: null,
};

// Async thunks
export const getNews = createAsyncThunk(
  'news/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/news');
      return response.data;
    } catch (error) {
      return rejectWithValue('Error fetching news');
    }
  }
);

export const getOneNews = createAsyncThunk(
  'news/getOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error fetching news');
    }
  }
);

export const createNews = createAsyncThunk(
  'news/create',
  async (
    {
      title,
      content,
      topicId,
      isMarkDown,
      image,
      tags,
    }: {
      title: string;
      content: string;
      topicId: string;
      isMarkDown: boolean;
      image?: File | null;
      tags: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/news', {
        title,
        content,
        tags,
        topicId,
        isMarkDown,
        image,
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
    } catch (error) {
      return rejectWithValue('Error creating news');
    }
  }
);

export const likeNews = createAsyncThunk(
  'news/like',
  async (newsId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/news/like/${newsId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error liking news');
    }
  }
);

export const viewNews = createAsyncThunk(
  'news/view',
  async (newsId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/news/views/${newsId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error updating view count');
    }
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentNews(state) {
      state.currentNews = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getNews
      .addCase(getNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNews.fulfilled, (state, action) => {
        state.news = action.payload;
        state.loading = false;
      })
      .addCase(getNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getOneNews
      .addCase(getOneNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOneNews.fulfilled, (state, action) => {
        state.currentNews = action.payload;
        state.loading = false;
      })
      .addCase(getOneNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createNews
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNews.fulfilled, (state, action) => {
        state.news.unshift(action.payload.news);
        state.loading = false;
      })
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // likeNews
      .addCase(likeNews.fulfilled, (state, action) => {
        if (state.currentNews?._id === action.payload._id) {
          state.currentNews = action.payload;
        }
        const newsIndex = state.news.findIndex(
          (news) => news._id === action.payload._id
        );
        if (newsIndex !== -1) {
          state.news[newsIndex] = action.payload;
        }
      })
      // viewNews
      .addCase(viewNews.fulfilled, (state, action) => {
        if (state.currentNews?._id === action.payload._id) {
          state.currentNews = action.payload;
        }
        const newsIndex = state.news.findIndex(
          (news) => news._id === action.payload._id
        );
        if (newsIndex !== -1) {
          state.news[newsIndex] = action.payload;
        }
      });
  },
});

export default newsSlice.reducer;
export const { clearError, clearCurrentNews } = newsSlice.actions;
