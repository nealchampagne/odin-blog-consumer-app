import api from "./client";
import type { Post } from "../types/post";
import type { PaginatedResponse } from "../types/pagination";

const getPosts = (page = 1, pageSize = 10) => 
  api<PaginatedResponse<Post>>(`/posts?page=${page}&pageSize=${pageSize}`);

const getPost = (id: string) => api<Post>(`/posts/${id}`);

export { 
  getPosts, 
  getPost
};