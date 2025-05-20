import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api';

interface Author {
  _id: string;
  name: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  authorId: string;
  content: string;
  postId: string;
  createdAt: Date;
  likes: string[];
  replyTo: string | null;
  author?: Author;
}

interface CommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: CommentsState = {
  comments: [],
  loading: false,
  error: null,
};

// Async thunks
export const getCommentsForPost = createAsyncThunk(
  'comments/getForPost',
  async (postId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comments/${postId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error fetching comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comments/add',
  async (
    {
      postId,
      content,
      replyTo,
    }: {
      postId: string;
      content: string;
      replyTo?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/comments', {
        content,
        postId,
        replyTo,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Error adding comment');
    }
  }
);

export const likeComment = createAsyncThunk(
  'comments/like',
  async (commentId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/comments/like/${commentId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error liking comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comments/delete',
  async (commentId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/comments/${commentId}`);
      return commentId;
    } catch (error) {
      return rejectWithValue('Error deleting comment');
    }
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearComments(state) {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // getCommentsForPost
      .addCase(getCommentsForPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentsForPost.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })
      .addCase(getCommentsForPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // addComment
      .addCase(addComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
        state.loading = false;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // likeComment
      .addCase(likeComment.fulfilled, (state, action) => {
        const commentIndex = state.comments.findIndex(
          (comment) => comment._id === action.payload._id
        );
        if (commentIndex !== -1) {
          state.comments[commentIndex] = action.payload;
        }
      })
      // deleteComment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload
        );
      });
  },
});

export default commentsSlice.reducer;
export const { clearError, clearComments } = commentsSlice.actions; 