export type Post = {
  id: string;
  title: string;
  content?: string | null;
  published: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
};