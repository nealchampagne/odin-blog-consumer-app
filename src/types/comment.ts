import type { User } from "./user";

export type Comment = {
  id: string;
  content: string;
  postId: string;
  author: User;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};