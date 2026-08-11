// tests/commentsRequests.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Mock } from "vitest";
import {
  getAllCommentsForPost,
  getCommentsForPost,
  createComment,
  updateComment,
  deleteComment,
} from "../../src/api/comments.js"; // adjust path
import api from "../../src/api/client.js"; // adjust path
import type { Comment } from "../../src/types/comment.js";
import type { PaginatedResponse } from "../../src/types/pagination.js";
import type { User } from "../../src/types/user.ts";

// Define the signature of your api function
type ApiFn = <T>(
  url: string,
  options?: { method?: string; body?: string }
) => Promise<T>;

// Mock the api module with correct typing
vi.mock("../../src/api/client.js", () => {
  return {
    default: vi.fn() as Mock<ApiFn>,
  };
});

const mockedApi = api as unknown as Mock<ApiFn>;

describe("commentsRequests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllCommentsForPost", () => {
    it("calls api with correct endpoint", async () => {
      const fakeUser: User = {
        id: "u1",
        email: "fake@email.com",
        name: "Fake User",
        role: "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const fakeComments: Comment[] = [
        { id: "c1", postId: "p1", content: "First!", authorId: "u1", author: fakeUser, createdAt: "", updatedAt: "" },
      ];
      mockedApi.mockResolvedValueOnce(fakeComments);

      const result = await getAllCommentsForPost("p1");

      expect(mockedApi).toHaveBeenCalledWith("/posts/p1/comments");
      expect(result).toEqual(fakeComments);
    });
  });

  describe("getCommentsForPost", () => {
    it("calls api with correct endpoint and pagination params", async () => {
      const fakeUser: User = {
        id: "u2",
        email: "fake@email.com",
        name: "Fake User",
        role: "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const fakeResponse: PaginatedResponse<Comment> = {
        data: [
          { 
            id: "c2", 
            postId: "p1",
            content: "Paginated",
            authorId: "u2",
            author: fakeUser,
            createdAt: "",
            updatedAt: "",
          },
        ],
        page: 2,
        pageSize: 5,
        total: 10,
        totalPages: 2,
      };
      mockedApi.mockResolvedValueOnce(fakeResponse);

      const result = await getCommentsForPost("p1", 2, 5);

      expect(mockedApi).toHaveBeenCalledWith("/posts/p1/comments?page=2&pageSize=5");
      expect(result).toEqual(fakeResponse);
    });
  });

  describe("createComment", () => {
    it("calls api with correct endpoint and body", async () => {
      const fakeUser: User = {
        id: "u3",
        email: "fake@email.com",
        name: "Fake User",
        role: "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const fakeComment: Comment = {
        id: "c3",
        postId: "p1",
        content: "New comment",
        authorId: "u3",
        author: fakeUser,
        createdAt: "",
        updatedAt: "",
      };
      mockedApi.mockResolvedValueOnce(fakeComment);

      const result = await createComment("p1", { content: "New comment" });

      expect(mockedApi).toHaveBeenCalledWith("/posts/p1/comments", {
        method: "POST",
        body: JSON.stringify({ content: "New comment" }),
      });
      expect(result).toEqual(fakeComment);
    });
  });

  describe("updateComment", () => {
    it("calls api with correct endpoint and body", async () => {
      const fakeUser: User = {
        id: "u4",
        email: "fake@email.com",
        name: "Fake User",
        role: "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const fakeComment: Comment = {
        id: "c4",
        postId: "p1",
        content: "Updated comment",
        authorId: "u4",
        author: fakeUser,
        createdAt: "",
        updatedAt: "",
      };
      mockedApi.mockResolvedValueOnce(fakeComment);

      const result = await updateComment("p1", "c4", { content: "Updated comment" });

      expect(mockedApi).toHaveBeenCalledWith("/posts/p1/comments/c4", {
        method: "PATCH",
        body: JSON.stringify({ content: "Updated comment" }),
      });
      expect(result).toEqual(fakeComment);
    });
  });

  describe("deleteComment", () => {
    it("calls api with correct endpoint and DELETE method", async () => {
      const fakeResponse = { success: true };
      mockedApi.mockResolvedValueOnce(fakeResponse);

      const result = await deleteComment("p1", "c5");

      expect(mockedApi).toHaveBeenCalledWith("/posts/p1/comments/c5", {
        method: "DELETE",
      });
      expect(result).toEqual(fakeResponse);
    });
  });
});
