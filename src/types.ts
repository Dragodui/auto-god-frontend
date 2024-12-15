export interface RegisterData {
  email: string;
  name: string;
  lastName: string;
  nickname?: string;
  password: string;
}

export interface LoginData {
  email: string;
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