import { describe, it, expect, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PostCard from "../../src/components/PostCard.tsx"; // adjust path
import type { Post } from "../../src/types/post.ts";

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

import { useNavigate } from "react-router-dom";

describe("PostCard component", () => {
  const basePost: Post = {
    id: "p1",
    title: "Test Post",
    content: "This is some long content that should be truncated in preview.",
    published: true,
    authorId: "u1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
  };

  it("renders title and preview", () => {
    (useNavigate as unknown as Mock).mockReturnValue(vi.fn());

    render(<PostCard post={basePost} />);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Test Post");
    expect(screen.getByText(/This is some long content/)).toBeInTheDocument();
  });

  it("renders formatted publishedAt date", () => {
    (useNavigate as unknown as Mock).mockReturnValue(vi.fn());

    render(<PostCard post={basePost} />);

    const meta = screen.getByText(/- \d{1,2}:/); // matches "Jul 29, 2026 - 1:04 PM"
    expect(meta).toBeInTheDocument();
  });

  it("renders N/A when publishedAt is null", () => {
    (useNavigate as unknown as Mock).mockReturnValue(vi.fn());

    const postWithoutDate: Post = { ...basePost, publishedAt: null };
    render(<PostCard post={postWithoutDate} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("navigates to post detail on button click", () => {
    const navigateMock = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(navigateMock);

    render(<PostCard post={basePost} />);

    const button = screen.getByRole("button", { name: "View more" });
    fireEvent.click(button);

    expect(navigateMock).toHaveBeenCalledWith("/posts/p1");
  });
});
