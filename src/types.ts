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
  id: string;
  email: string;
  car?: string;
  createdAt: string;
  rank: string;
  name: string;
  lastName: string;
  nickname?: string;
}