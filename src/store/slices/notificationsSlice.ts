import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api';

export interface Notification {
  _id: string;
  userId: string;
  type: 'comment' | 'like' | 'reply' | 'mention' | 'system';
  content: string;
  link: string;
  read: boolean;
  createdAt: string;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

export const getNotifications = createAsyncThunk(
  'notifications/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications');
      return response.data;
    } catch (error) {
      return rejectWithValue('Error fetching notifications');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/notifications/read/${notificationId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error marking notification as read');
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.put('/notifications/read-all');
      return response.data;
    } catch (error) {
      return rejectWithValue('Error marking all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      return notificationId;
    } catch (error) {
      return rejectWithValue('Error deleting notification');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getNotifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n: Notification) => !n.read).length;
        state.loading = false;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // markAsRead
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
          if (!state.notifications[index].read) {
            state.unreadCount -= 1;
          }
        }
      })
      // markAllAsRead
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map(n => ({ ...n, read: true }));
        state.unreadCount = 0;
      })
      // deleteNotification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload);
        if (notification && !notification.read) {
          state.unreadCount -= 1;
        }
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      });
  },
});

export const { addNotification, clearError } = notificationsSlice.actions;
export default notificationsSlice.reducer; 