export type User = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  name: string;
  createdAt: string;
  updatedAt: string;
}