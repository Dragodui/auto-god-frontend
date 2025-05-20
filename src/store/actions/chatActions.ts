import { Dispatch } from 'redux';
import { Chat, Message } from '../../types';
import api from '../../utils/api';

// Action Types
export const FETCH_CHAT_REQUEST = 'FETCH_CHAT_REQUEST';
export const FETCH_CHAT_SUCCESS = 'FETCH_CHAT_SUCCESS';
export const FETCH_CHAT_FAILURE = 'FETCH_CHAT_FAILURE';
export const CREATE_CHAT_REQUEST = 'CREATE_CHAT_REQUEST';
export const CREATE_CHAT_SUCCESS = 'CREATE_CHAT_SUCCESS';
export const CREATE_CHAT_FAILURE = 'CREATE_CHAT_FAILURE';
export const SEND_MESSAGE_REQUEST = 'SEND_MESSAGE_REQUEST';
export const SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS';
export const SEND_MESSAGE_FAILURE = 'SEND_MESSAGE_FAILURE';
export const ADD_MESSAGE = 'ADD_MESSAGE';

// Action Creators
export const fetchChat = (itemId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: FETCH_CHAT_REQUEST });

  try {
    const response = await api.get(`/chat/item/${itemId}`);
    dispatch({
      type: FETCH_CHAT_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: FETCH_CHAT_FAILURE,
      payload: error.response?.data?.message || 'Error fetching chat'
    });
  }
};

export const createChat = (itemId: string) => async (dispatch: Dispatch) => {
  dispatch({ type: CREATE_CHAT_REQUEST });

  try {
    const response = await api.post(`/chat/item/${itemId}`);
    dispatch({
      type: CREATE_CHAT_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: CREATE_CHAT_FAILURE,
      payload: error.response?.data?.message || 'Error creating chat'
    });
  }
};

export const sendMessage = (chatId: string, message: Message) => async (dispatch: Dispatch) => {
  dispatch({ type: SEND_MESSAGE_REQUEST });

  try {
    const response = await api.post(`/chat/${chatId}/messages`, message);
    dispatch({
      type: SEND_MESSAGE_SUCCESS,
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: SEND_MESSAGE_FAILURE,
      payload: error.response?.data?.message || 'Error sending message'
    });
  }
};

export const addMessage = (message: Message) => ({
  type: ADD_MESSAGE,
  payload: message
}); 