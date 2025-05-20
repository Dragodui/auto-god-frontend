import { Dispatch } from 'redux';
import api from '../../utils/api';
import { AxiosError } from 'axios';

// Action Types
export const FETCH_ITEMS_REQUEST = 'FETCH_ITEMS_REQUEST';
export const FETCH_ITEMS_SUCCESS = 'FETCH_ITEMS_SUCCESS';
export const FETCH_ITEMS_FAILURE = 'FETCH_ITEMS_FAILURE';
export const FETCH_ITEM_REQUEST = 'FETCH_ITEM_REQUEST';
export const FETCH_ITEM_SUCCESS = 'FETCH_ITEM_SUCCESS';
export const FETCH_ITEM_FAILURE = 'FETCH_ITEM_FAILURE';
export const CREATE_ITEM_REQUEST = 'CREATE_ITEM_REQUEST';
export const CREATE_ITEM_SUCCESS = 'CREATE_ITEM_SUCCESS';
export const CREATE_ITEM_FAILURE = 'CREATE_ITEM_FAILURE';
export const PURCHASE_ITEM_REQUEST = 'PURCHASE_ITEM_REQUEST';
export const PURCHASE_ITEM_SUCCESS = 'PURCHASE_ITEM_SUCCESS';
export const PURCHASE_ITEM_FAILURE = 'PURCHASE_ITEM_FAILURE';

// Action Creators
export const fetchItems = () => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_ITEMS_REQUEST });

  try {
    const response = await api.get('/items');
    dispatch({
      type: FETCH_ITEMS_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    dispatch({
      type: FETCH_ITEMS_FAILURE,
      payload: axiosError.response?.data?.message || 'Error fetching items'
    });
  }
};

export const fetchItemById = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_ITEM_REQUEST });

  try {
    const response = await api.get(`/items/${id}`);
    dispatch({
      type: FETCH_ITEM_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    dispatch({
      type: FETCH_ITEM_FAILURE,
      payload: axiosError.response?.data?.message || 'Error fetching item'
    });
  }
};

export const createItem = (formData: FormData) => async (dispatch: Dispatch) => {
  dispatch({ type: CREATE_ITEM_REQUEST });

  try {
    const response = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    dispatch({
      type: CREATE_ITEM_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    dispatch({
      type: CREATE_ITEM_FAILURE,
      payload: axiosError.response?.data?.message || 'Error creating item'
    });
  }
};

export const purchaseItem = (itemId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: PURCHASE_ITEM_REQUEST });

  try {
    const response = await api.post(`/items/${itemId}/purchase`);
    dispatch({
      type: PURCHASE_ITEM_SUCCESS,
      payload: response.data.item
    });
  } catch (error) {
    const axiosError = error as AxiosError;
    dispatch({
      type: PURCHASE_ITEM_FAILURE,
      payload: axiosError.response?.data?.message || 'Error purchasing item'
    });
  }
}; 