import { describe, it, expect, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../src/pages/Login.tsx";

// Mock useAuth and useNavigate
vi.mock("../../src/store/auth.js", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

import { useAuth } from "../../src/store/auth.js";
import { useNavigate } from "react-router-dom";

describe("Login component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title and form fields", () => {
    (useAuth as unknown as Mock).mockReturnValue({
      login: vi.fn(),
      loading: false,
      error: null,
    });
    (useNavigate as unknown as Mock).mockReturnValue(vi.fn());

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Log In");
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("updates state when typing into inputs", () => {
    (useAuth as unknown as Mock).mockReturnValue({
      login: vi.fn(),
      loading: false,
      error: null,
    });
    (useNavigate as unknown as Mock).mockReturnValue(vi.fn());

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText("Email") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "secret" } });

    expect(emailInput.value).toBe("test@example.com");
    expect(passwordInput.value).toBe("secret");
  });

  it("calls login and navigates on submit when no error", async () => {
    const loginMock = vi.fn().mockResolvedValue(undefined);
    const navigateMock = vi.fn();
    (useAuth as unknown as Mock).mockReturnValue({
      login: loginMock,
      loading: false,
      error: null,
    });
    (useNavigate as unknown as Mock).mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "secret" } });
    fireEvent.submit(screen.getByRole("form", { name: "login-form" }));

    expect(loginMock).toHaveBeenCalledWith("test@example.com", "secret");
    // navigate should be called after login resolves
    await vi.waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/");
    });
  });

  it("shows error message when error is present", () => {
    (useAuth as unknown as Mock).mockReturnValue({
      login: vi.fn(),
      loading: false,
      error: "Invalid credentials",
    });
    (useNavigate as unknown as Mock).mockReturnValue(vi.fn());

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("disables button and shows loading text when loading", () => {
    (useAuth as unknown as Mock).mockReturnValue({
      login: vi.fn(),
      loading: true,
      error: null,
    });
    (useNavigate as unknown as Mock).mockReturnValue(vi.fn());

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent("Logging in…");
  });

  it("navigates to signup when clicking signup link", () => {
    const navigateMock = vi.fn();
    (useAuth as unknown as Mock).mockReturnValue({
      login: vi.fn(),
      loading: false,
      error: null,
    });
    (useNavigate as unknown as Mock).mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Sign up"));
    expect(navigateMock).toHaveBeenCalledWith("/signup");
  });
});
