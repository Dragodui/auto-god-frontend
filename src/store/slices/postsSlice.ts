import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api';

interface Post {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  topicId: string;
  image?: string;
  likes: number;
  views: number;
  author: any;
  createdAt: string;
  updatedAt: string;
}

interface PostsState {
  posts: Post[];
  currentPost: Post | null;
  loading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
};

// Async thunks
export const createPost = createAsyncThunk(
  'posts/create',
  async (
    {
      title,
      content,
      tags,
      topicId,
      image,
    }: {
      title: string;
      content: string;
      tags: string[];
      topicId: string;
      image?: File | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/posts', {
        title,
        content,
        tags,
        topicId,
        image,
      });

      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        await api.post(`/posts/${response.data.post._id}/image`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      return response.data;
    } catch (error) {
      return rejectWithValue('Error creating post');
    }
  }
);

export const getPost = createAsyncThunk(
  'posts/getOne',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/posts/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error fetching post');
    }
  }
);

export const likePost = createAsyncThunk(
  'posts/like',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/posts/like/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error liking post');
    }
  }
);

export const viewPost = createAsyncThunk(
  'posts/view',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/posts/views/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error updating view count');
    }
  }
);

export const getPosts = createAsyncThunk(
  'posts/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      return rejectWithValue('Error fetching posts');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentPost(state) {
      state.currentPost = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createPost
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload.post);
        state.loading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getPost
      .addCase(getPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPost.fulfilled, (state, action) => {
        state.currentPost = action.payload;
        state.loading = false;
      })
      .addCase(getPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // likePost
      .addCase(likePost.fulfilled, (state, action) => {
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
        const postIndex = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload;
        }
      })
      // viewPost
      .addCase(viewPost.fulfilled, (state, action) => {
        if (state.currentPost?._id === action.payload._id) {
          state.currentPost = action.payload;
        }
        const postIndex = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (postIndex !== -1) {
          state.posts[postIndex] = action.payload;
        }
      })
      // getPosts
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.loading = false;
      })
      .addCase(getPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default postsSlice.reducer;
export const { clearError, clearCurrentPost } = postsSlice.actions;
