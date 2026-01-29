import type { User } from "./user";

export type LoginResponse = {
  user: User;
  token: string;
};

export type SignupResponse = {
  user: User;
  token: string;
};