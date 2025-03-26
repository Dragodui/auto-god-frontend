export interface MessageResponse {
  message: string;
}

export interface RegisterData {
  email: string;
  name: string;
  lastName: string;
  nickname?: string;
  password: string;
}

export interface LoginData {
  login: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  car?: string;
  createdAt: string;
  rank: string;
  name: string;
  lastName: string;
  nickname?: string;
}

export interface User {
  _id: string;
  email: string;
  car?: string;
  avatar?: string;
  createdAt: string;
  rank: string;
  name: string;
  lastName: string;
  nickname?: string;
}

export interface ChangeUserData {
  name?: string;
  lastName?: string;
  nickname?: string;
  car?: string;
}

export interface Post {
  _id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: Date;
  likes: number;
  views: number;
  topicId: string;
  tags: string[];
}

export interface News {
  _id: string;
  authorId: string;
  title: string;
  content: string;
  createdAt: Date;
  likes: number;
  views: number;
  topicId: string;
  tags: string[];
  isMarkDown: boolean;
}

export interface Comment {
  authorId: string;
  postId: string;
  content: string;
  replyTo?: string;
  createdAt: Date;
  likes: number;
}

export interface Activity {
  post: Post;
  comment: Comment | string;
}

export interface Topic {
  _id: string;
  title: string;
  cover: string;
}

export interface Stats {
  users: number;
  posts: number;
  news: number;
  topics: number;
}

export interface Tag {
  _id: string;
  title: string;
}
