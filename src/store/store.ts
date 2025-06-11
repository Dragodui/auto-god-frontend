import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import postsReducer from './slices/postsSlice';
import commentsReducer from './slices/commentsSlice';
import notificationsReducer from './slices/notificationsSlice';
import newsReducer from './slices/newsSlice';
import chatsReducer from './slices/chatsSlice';
import itemsReducer from './slices/itemsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    comments: commentsReducer,
    notifications: notificationsReducer,
    news: newsReducer,
    chats: chatsReducer,
    items: itemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
