import { configureStore } from '@reduxjs/toolkit';
import itemReducer from './reducers/itemReducer';
import chatReducer from './reducers/chatReducer';
import authReducer from './reducers/authReducer';

const store = configureStore({
  reducer: {
    items: itemReducer,
    chat: chatReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
