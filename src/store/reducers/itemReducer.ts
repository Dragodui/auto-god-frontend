import {
  FETCH_ITEMS_REQUEST,
  FETCH_ITEMS_SUCCESS,
  FETCH_ITEMS_FAILURE,
  FETCH_ITEM_REQUEST,
  FETCH_ITEM_SUCCESS,
  FETCH_ITEM_FAILURE,
  CREATE_ITEM_REQUEST,
  CREATE_ITEM_SUCCESS,
  CREATE_ITEM_FAILURE,
  PURCHASE_ITEM_REQUEST,
  PURCHASE_ITEM_SUCCESS,
  PURCHASE_ITEM_FAILURE,
} from '../actions/itemActions';
import { ItemState } from '../../types';

const initialState: ItemState = {
  items: [],
  currentItem: null,
  userItems: [],
  loading: false,
  error: null,
};

const itemReducer = (state = initialState, action: any): ItemState => {
  switch (action.type) {
    case FETCH_ITEMS_REQUEST:
    case FETCH_ITEM_REQUEST:
    case CREATE_ITEM_REQUEST:
    case PURCHASE_ITEM_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ITEMS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };

    case FETCH_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        currentItem: action.payload,
      };

    case CREATE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [action.payload, ...state.items],
      };

    case PURCHASE_ITEM_SUCCESS:
      return {
        ...state,
        loading: false,
        items: state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        ),
        currentItem: action.payload,
      };

    case FETCH_ITEMS_FAILURE:
    case FETCH_ITEM_FAILURE:
    case CREATE_ITEM_FAILURE:
    case PURCHASE_ITEM_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default itemReducer;
