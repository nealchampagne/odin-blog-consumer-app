import api from "./client";
import type { Comment } from "../types/comment";
import type { PaginatedResponse } from "../types/pagination";

// Get all comments for a post (non-paginated)
const getAllCommentsForPost = (postId: string) =>
  api<Comment[]>(`/posts/${postId}/comments`);

// Get paginated comments for a post
const getCommentsForPost = (
  postId: string,
  page = 1,
  pageSize = 10
) =>
  api<PaginatedResponse<Comment>>(
    `/posts/${postId}/comments?page=${page}&pageSize=${pageSize}`
  );

// Create a new comment under a post
const createComment = (postId: string, data: { content: string }) =>
  api<Comment>(`/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(data)
  });

// Update a comment (requires commentId + postId)
const updateComment = (
  postId: string,
  commentId: string,
  data: { content: string }
) =>
  api<Comment>(`/posts/${postId}/comments/${commentId}`, {
    method: "PATCH",
    body: JSON.stringify(data)
  });

// Delete a comment
const deleteComment = (postId: string, commentId: string) =>
  api<{ success: boolean }>(`/posts/${postId}/comments/${commentId}`, {
    method: "DELETE"
  });

export {
  getAllCommentsForPost,
  getCommentsForPost,
  createComment,
  updateComment,
  deleteComment
};