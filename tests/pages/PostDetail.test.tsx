import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PostDetail from "../../src/pages/PostDetail.tsx";

// Mock API modules
vi.mock("../../src/api/posts.js", () => ({
  getPost: vi.fn(),
}));
vi.mock("../../src/api/comments.js", () => ({
  getCommentsForPost: vi.fn(),
  createComment: vi.fn(),
  deleteComment: vi.fn(),
  updateComment: vi.fn(),
}));

import { getPost } from "../../src/api/posts.js";
import { getCommentsForPost, createComment, deleteComment, updateComment } from "../../src/api/comments.js";

describe("PostDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("shows loading state initially", async () => {
    (getPost as Mock).mockImplementation(() => new Promise(() => {}));
    
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/posts/1"]}>
          <PostDetail />
        </MemoryRouter>
      );
    });
    expect(await waitFor(() => screen.getByText("Loading…"))).toBeInTheDocument();
  });

  it("renders post content when loaded", async () => {
    (getPost as Mock).mockResolvedValueOnce({
      id: "1",
      title: "Test Post",
      content: "Hello **Markdown**",
      published: true,
    });
    (getCommentsForPost as Mock).mockResolvedValueOnce({ data: [], totalPages: 1 });

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent("Test Post");
    expect(
      await screen.findByText(
        (_, element) => element?.tagName.toLowerCase() === "p" && element.textContent === "Hello Markdown"
      )
    ).toBeInTheDocument();
  });

  it("shows 'No comments yet.' when no comments", async () => {
    (getPost as Mock).mockResolvedValueOnce({ id: "1", title: "Test Post", published: true });
    (getCommentsForPost as Mock).mockResolvedValueOnce({ data: [], totalPages: 0 });

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText("No comments yet.")).toBeInTheDocument();
  });

  it("allows adding a comment when logged in", async () => {
    localStorage.setItem("user", JSON.stringify({ id: "u1", role: "USER" }));
    (getPost as Mock).mockResolvedValueOnce({ id: "1", title: "Test Post", published: true });
    (getCommentsForPost as Mock).mockResolvedValueOnce({ data: [], totalPages: 1 });
    (createComment as Mock).mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Add Comment"));

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText("Write a comment…"), { target: { value: "Nice post!" } });
      fireEvent.click(screen.getByText("Add Comment"));
    });

    expect(createComment).toHaveBeenCalledWith("1", { content: "Nice post!" });
  });

  const basePost = { id: "1", title: "Test Post", published: true, content: "Hello" };
  const baseComment = {
    id: "c1",
    postId: "1",
    content: "Original comment",
    authorId: "u1",
    author: { name: "Tester" },
    createdAt: new Date().toISOString(),
  };

  it("allows deleting a comment when user is author", async () => {
    localStorage.setItem("user", JSON.stringify({ id: "u1", role: "USER" }));
    (getPost as Mock).mockResolvedValueOnce(basePost);
    (getCommentsForPost as Mock).mockResolvedValueOnce({ data: [baseComment], totalPages: 1 });
    (deleteComment as Mock).mockResolvedValueOnce({ success: true });

    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Original comment"));

    await act(async () => {
      fireEvent.click(screen.getByText("Delete"));
    });

    expect(deleteComment).toHaveBeenCalledWith("1", "c1");
  });

  it("allows editing and saving a comment", async () => {
    localStorage.setItem("user", JSON.stringify({ id: "u1", role: "USER" }));
    (getPost as Mock).mockResolvedValueOnce(basePost);
    (getCommentsForPost as Mock).mockResolvedValueOnce({ data: [baseComment], totalPages: 1 });
    (updateComment as Mock).mockResolvedValueOnce({});

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Original comment"));

    await act(async () => {
      fireEvent.click(screen.getByText("Edit"));
    });

    // Now wait until the textarea is rendered
    const textarea = await screen.findByDisplayValue("Original comment");

    await act(async () => {
      fireEvent.change(textarea, { target: { value: "Updated comment" } });
      fireEvent.click(screen.getByText("Save"));
    });

    expect(updateComment).toHaveBeenCalledWith("1", "c1", { content: "Updated comment" });
  });

  it("cancels editing a comment", async () => {
    localStorage.setItem("user", JSON.stringify({ id: "u1", role: "USER" }));
    (getPost as Mock).mockResolvedValueOnce(basePost);
    (getCommentsForPost as Mock).mockResolvedValueOnce({ data: [baseComment], totalPages: 1 });

    render(
      <MemoryRouter initialEntries={["/posts/1"]}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Original comment"));

    await act(async () => {
      fireEvent.click(screen.getByText("Edit"));
    });

    expect(screen.getByText("Save")).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByText("Cancel"));
    });

    expect(screen.queryByText("Save")).toBeNull();
  });
});