import api from "./client.js";
import type { Post } from "../types/post.js";
import type { PaginatedResponse } from "../types/pagination.js";

const getPosts = (page = 1, pageSize = 10) => 
  api<PaginatedResponse<Post>>(`/posts?page=${page}&pageSize=${pageSize}`);

const getPost = (id: string) => api<Post>(`/posts/${id}`);

export { 
  getPosts, 
  getPost
};