import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Mock } from "vitest";
import { getPosts, getPost } from "../../src/api/posts.js"; // adjust path
import api from "../../src/api/client.js"; // adjust path
import type { Post } from "../../src/types/post.js";
import type { PaginatedResponse } from "../../src/types/pagination.js";

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

describe("postsRequests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPosts", () => {
    it("calls api with correct endpoint and pagination params", async () => {
      const fakePosts: PaginatedResponse<Post> = {
        data: [
          {
            id: "p1",
            title: "First Post",
            content: "Hello world",
            published: true,
            authorId: "u1",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: new Date().toISOString(),
          },
        ],
        page: 2,
        pageSize: 5,
        total: 20,
        totalPages: 4,
      };
      mockedApi.mockResolvedValueOnce(fakePosts);

      const result = await getPosts(2, 5);

      expect(mockedApi).toHaveBeenCalledWith("/posts?page=2&pageSize=5");
      expect(result).toEqual(fakePosts);
    });

    it("propagates errors from api", async () => {
      mockedApi.mockRejectedValueOnce(new Error("Failed to fetch posts"));
      await expect(getPosts()).rejects.toThrow("Failed to fetch posts");
    });
  });

  describe("getPost", () => {
    it("calls api with correct endpoint", async () => {
      const fakePost: Post = {
        id: "p2",
        title: "Second Post",
        content: "More content",
        published: false,
        authorId: "u2",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: null,
      };
      mockedApi.mockResolvedValueOnce(fakePost);

      const result = await getPost("p2");

      expect(mockedApi).toHaveBeenCalledWith("/posts/p2");
      expect(result).toEqual(fakePost);
    });

    it("propagates errors from api", async () => {
      mockedApi.mockRejectedValueOnce(new Error("Post not found"));
      await expect(getPost("bad-id")).rejects.toThrow("Post not found");
    });
  });
});
