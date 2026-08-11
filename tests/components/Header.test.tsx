import { describe, it, expect, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "../../src/components/Header.tsx"; // adjust path

// Mock useAuth hook
vi.mock("../../src/store/auth.js", () => {
  return {
    useAuth: vi.fn(),
  };
});

import { useAuth } from "../../src/store/auth.js";

describe("Header component", () => {
  it("renders log in link when no user", () => {
    (useAuth as unknown as Mock).mockReturnValue({
      user: null,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const link = screen.getByRole("link", { name: "Log in" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });

  it("renders log out button when user exists", () => {
    const logoutMock = vi.fn();
    (useAuth as unknown as Mock).mockReturnValue({
      user: { id: "u1", email: "test@example.com" },
      logout: logoutMock,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: "Log out" });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(logoutMock).toHaveBeenCalled();
  });

  it("always renders the blog title", () => {
    (useAuth as unknown as Mock).mockReturnValue({
      user: null,
      logout: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText("Super Cool Blog")).toBeInTheDocument();
  });
});
