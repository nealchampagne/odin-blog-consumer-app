import api from "./client.js";
import type { LoginResponse } from "../types/auth.js";

const loginRequest = async (email: string, password: string) => {
  return api<LoginResponse>("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
}

const signupRequest = async (name: string, email: string, password: string) => {
  return api<LoginResponse>("/users/signup", {
    method: "POST",
    body: JSON.stringify({ name, email, password })
  });
}

export { 
  signupRequest,
  loginRequest
};