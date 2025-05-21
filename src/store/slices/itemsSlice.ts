import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/api';
import { Item } from '@/types';

interface ItemsState {
  items: Item[];
  currentItem: Item | null;
  userItems: Item[];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  items: [],
  currentItem: null,
  userItems: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchItems = createAsyncThunk(
  'items/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/items');
      return response.data;
    } catch (error) {
      return rejectWithValue('Error fetching items');
    }
  }
);

export const fetchItemById = createAsyncThunk(
  'items/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/items/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue('Error fetching item');
    }
  }
);

export const createItem = createAsyncThunk(
  'items/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/items', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Error creating item');
    }
  }
);

export const purchaseItem = createAsyncThunk(
  'items/purchase',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/items/${itemId}/purchase`);
      return response.data.item;
    } catch (error) {
      return rejectWithValue('Error purchasing item');
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearCurrentItem(state) {
      state.currentItem = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchItems
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // fetchItemById
      .addCase(fetchItemById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.currentItem = action.payload;
        state.loading = false;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createItem
      .addCase(createItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        state.loading = false;
      })
      .addCase(createItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // purchaseItem
      .addCase(purchaseItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(purchaseItem.fulfilled, (state, action) => {
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
        state.currentItem = action.payload;
        state.loading = false;
      })
      .addCase(purchaseItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default itemsSlice.reducer;
export const { clearError, clearCurrentItem } = itemsSlice.actions;
