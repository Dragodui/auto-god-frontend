import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { UserData, Activity, ChangeUserData, MessageResponse } from '@/types';
import api from '@/utils/api';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  user: UserData | null;
  loading: boolean;
  error: string | null;
  lastActivity: Activity[];
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  lastActivity: [],
};

// Async thunks
export const getCurrentProfileData = createAsyncThunk(
  'user/getCurrentProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      return rejectWithValue('Error while getting user info');
    }
  }
);

export const getLastUserActivity = createAsyncThunk(
  'user/getLastActivity',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/user/activity');
      return response.data.lastActivityPosts;
    } catch (error) {
      return rejectWithValue('Error while getting last activity');
    }
  }
);

export const uploadUserAvatar = createAsyncThunk(
  'user/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return true;
    } catch (error) {
      return rejectWithValue('Error while uploading avatar');
    }
  }
);

export const saveUserData = createAsyncThunk(
  'user/saveData',
  async (form: ChangeUserData, { rejectWithValue }) => {
    try {
      await api.put('/user/data', form);
      return form;
    } catch (error) {
      return rejectWithValue('Error updating profile');
    }
  }
);

export const getUserById = createAsyncThunk(
  'user/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error while getting user by id');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<UserData | null>) {
      state.user = action.payload;
      state.loading = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getCurrentProfileData
      .addCase(getCurrentProfileData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentProfileData.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(getCurrentProfileData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getLastUserActivity
      .addCase(getLastUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLastUserActivity.fulfilled, (state, action) => {
        state.lastActivity = action.payload;
        state.loading = false;
      })
      .addCase(getLastUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // saveUserData
      .addCase(saveUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUserData.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
        state.loading = false;
      })
      .addCase(saveUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
export const { setUser, setLoading, clearError } = userSlice.actions;
