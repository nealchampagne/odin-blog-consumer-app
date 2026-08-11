import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Signup from "../../src/pages/Signup.jsx";
import type { SignupResponse } from "../../src/types/auth.js";
import * as authApi from "../../src/api/auth.js";
import type { User } from "../../src/types/user.js";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Signup component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("shows error when passwords do not match", async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm password/), {
      target: { value: "xyz789" },
    });

    expect(screen.getByText(/Sign up/i)).toBeDisabled();
  });

  it("calls signupRequest and navigates on success", async () => {
    const fakeUser: User = {
      id: "u1",
      name: "Tester",
      email: "fake@email.com",
      role: "USER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const fakeResponse: SignupResponse = {
      token: "abc123",
      user: fakeUser,
    };

    vi.spyOn(authApi, "signupRequest").mockResolvedValue(fakeResponse);

    await act(async () => {
      render(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Tester" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm password/), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByText(/Sign up/i));

    await waitFor(() => {
      expect(authApi.signupRequest).toHaveBeenCalledWith("Tester", "test@example.com", "abc123");
      expect(localStorage.getItem("token")).toBe("abc123");
      expect(localStorage.getItem("user")).toContain("Tester");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("shows error when signupRequest fails", async () => {
    vi.spyOn(authApi, "signupRequest").mockRejectedValue(new Error("Email already exists"));

    await act(async () => {
      render(
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      );
    });

    fireEvent.change(screen.getByLabelText(/Name/i), {
      target: { value: "Tester" },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^Password/), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText(/^Confirm password/), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByText(/Sign up/i));

    expect(await screen.findByText("Email already exists")).toBeInTheDocument();
  });
});