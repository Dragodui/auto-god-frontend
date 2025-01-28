import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserData } from '@/types';

interface UserState {
  user: UserData | null;
  loading: boolean;
}

const initialState: UserState = {
  user: null,
  loading: false,
};

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
  },
});

export default userSlice.reducer;
export const { setUser, setLoading } = userSlice.actions;
