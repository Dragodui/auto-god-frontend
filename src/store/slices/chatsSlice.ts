import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api';

interface User {
  _id: string;
  name: string;
  avatar?: string;
}

interface Item {
  _id: string;
  title: string;
  image?: string;
}

interface Message {
  _id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export interface Chat {
  _id: string;
  participants: User[];
  item: Item;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatsState {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatsState = {
  chats: [],
  currentChat: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchChats = createAsyncThunk(
  'chats/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chat');
      return response.data;
    } catch (error) {
      return rejectWithValue('Error fetching chats');
    }
  }
);

export const fetchChatById = createAsyncThunk(
  'chats/fetchById',
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chat/${chatId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error fetching chat');
    }
  }
);

export const createChat = createAsyncThunk(
  'chats/create',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/chat/item/${itemId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error creating chat');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chats/sendMessage',
  async (
    { chatId, content }: { chatId: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/chat/${chatId}/messages`, { content });
      return response.data;
    } catch (error) {
      return rejectWithValue('Error sending message');
    }
  }
);

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentChat(state) {
      state.currentChat = null;
    },
    addMessage(state, action: PayloadAction<Message>) {
      if (state.currentChat) {
        state.currentChat.messages.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchChats
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.loading = false;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchChatById
      .addCase(fetchChatById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatById.fulfilled, (state, action) => {
        state.currentChat = action.payload;
        state.loading = false;
      })
      .addCase(fetchChatById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createChat
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.chats.unshift(action.payload);
        state.currentChat = action.payload;
        state.loading = false;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // sendMessage
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (state.currentChat) {
          state.currentChat.messages.push(action.payload);
        }
      });
  },
});

export default chatsSlice.reducer;
export const { clearError, clearCurrentChat, addMessage } = chatsSlice.actions;
