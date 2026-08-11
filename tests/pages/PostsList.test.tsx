import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PostsList from "../../src/pages/PostsList.jsx";
import * as postsApi from "../../src/api/posts.js";
import type { Post } from "../../src/types/post.js";
import type { PaginatedResponse } from "../../src/types/pagination.js";

describe("PostsList component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    vi.spyOn(postsApi, "getPosts").mockImplementation(
      () => new Promise(() => {}) // never resolves
    );

    render(
      <MemoryRouter>
        <PostsList />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("renders empty state when no posts", async () => {
    const fakeResponse: PaginatedResponse<Post> = {
      data: [],
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 1,
    };
    vi.spyOn(postsApi, "getPosts").mockResolvedValue(fakeResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <PostsList />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText(/No posts yet./i)).toBeInTheDocument();
    expect(screen.getByText(/Check back later for updates./i)).toBeInTheDocument();
  });

  it("renders posts when data is returned", async () => {
    const fakePosts: Post[] = [
      {
        id: "1",
        title: "First Post",
        content: "Hello world",
        published: true,
        authorId: "u1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      },
    ];
    const fakeResponse: PaginatedResponse<Post> = {
      data: fakePosts,
      page: 1,
      pageSize: 10,
      total: fakePosts.length,
      totalPages: 1,
    };
    vi.spyOn(postsApi, "getPosts").mockResolvedValue(fakeResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <PostsList />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText(/First Post/i)).toBeInTheDocument();
  });

  it("renders pagination controls when multiple pages", async () => {
    const fakePosts: Post[] = [
      {
        id: "1",
        title: "Paged Post",
        content: "Page test",
        published: true,
        authorId: "u1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: new Date().toISOString(),
      },
    ];
    const fakeResponse: PaginatedResponse<Post> = {
      data: fakePosts,
      page: 1,
      pageSize: 10,
      total: 30,
      totalPages: 3,
    };
    vi.spyOn(postsApi, "getPosts").mockResolvedValue(fakeResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <PostsList />
        </MemoryRouter>
      );
    });

    expect(await screen.findByText(/Page 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Next/i })).toBeEnabled();
    expect(screen.getByRole("button", { name: /Previous/i })).toBeDisabled();

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Next/i }));
    });

    expect(await screen.findByText(/Page 2 of 3/i)).toBeInTheDocument();
  });
});