export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface Item {
  _id: string;
  title: string;
  description: string;
  price: number;
  photos: string[];
  seller: User;
  status: 'available' | 'sold';
  buyer?: User;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ItemState {
  items: Item[];
  currentItem: Item | null;
  userItems: Item[];
  loading: boolean;
  error: string | null;
}

export interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  loading: boolean;
  error: string | null;
} 