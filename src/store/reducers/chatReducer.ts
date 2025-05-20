import {
  FETCH_CHAT_REQUEST,
  FETCH_CHAT_SUCCESS,
  FETCH_CHAT_FAILURE,
  CREATE_CHAT_REQUEST,
  CREATE_CHAT_SUCCESS,
  CREATE_CHAT_FAILURE,
  SEND_MESSAGE_REQUEST,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_FAILURE,
  ADD_MESSAGE
} from '../actions/chatActions';
import { ChatState } from '../../types/index';

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  loading: false,
  error: null
};

const chatReducer = (state = initialState, action: any): ChatState => {
  switch (action.type) {
    case FETCH_CHAT_REQUEST:
    case CREATE_CHAT_REQUEST:
    case SEND_MESSAGE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case FETCH_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        currentChat: action.payload
      };

    case CREATE_CHAT_SUCCESS:
      return {
        ...state,
        loading: false,
        currentChat: action.payload,
        chats: [action.payload, ...state.chats]
      };

    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        loading: false,
        currentChat: state.currentChat
          ? {
              ...state.currentChat,
              messages: [...state.currentChat.messages, action.payload]
            }
          : null
      };

    case ADD_MESSAGE:
      return {
        ...state,
        currentChat: state.currentChat
          ? {
              ...state.currentChat,
              messages: [...state.currentChat.messages, action.payload]
            }
          : null
      };

    case FETCH_CHAT_FAILURE:
    case CREATE_CHAT_FAILURE:
    case SEND_MESSAGE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

export default chatReducer; 