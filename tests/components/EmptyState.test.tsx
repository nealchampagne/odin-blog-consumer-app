// tests/EmptyState.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EmptyState from "../../src/components/EmptyState.tsx"; // adjust path

describe("EmptyState component", () => {
  it("renders title and message", () => {
    render(
      <MemoryRouter>
        <EmptyState title="No Data" message="There are no items to show." />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("No Data");
    expect(screen.getByText("There are no items to show.")).toBeInTheDocument();
  });

  it("renders action link when actionLabel and actionTo are provided", () => {
    render(
      <MemoryRouter>
        <EmptyState
          title="Empty"
          message="Nothing here yet."
          actionLabel="Create Post"
          actionTo="/posts/new"
        />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: "Create Post" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/posts/new");
  });

  it("does not render action link when props are missing", () => {
    render(
      <MemoryRouter>
        <EmptyState title="Empty" message="Nothing here yet." />
      </MemoryRouter>
    );

    expect(screen.queryByRole("link")).toBeNull();
  });
});
