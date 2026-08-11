import { render, act } from "@testing-library/react";
import { vi } from "vitest";
import Root from "../src/Root.jsx";
import * as authStore from "../src/store/auth.js";
import type { AuthState } from "../src/store/auth.js";
import { createMemoryRouter, RouterProvider } from "react-router-dom";

const router = createMemoryRouter([{ path: "/", element: <div>Home</div> }]);

beforeAll(() => {
  // Prevent real network calls
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  }) as unknown as typeof fetch;
});

describe("Root component", () => {
  it("calls restore on mount", async () => {
    const mockRestore = vi.fn();

    vi.spyOn(authStore, "useAuth").mockImplementation(
      (selector?: (state: AuthState) => unknown) => {
      const fakeAuthState = {
        user: null,
        token: null,
        loading: false,
        error: null,
        restore: mockRestore,
        login: vi.fn(),
        logout: vi.fn(),
      };

      return typeof selector === "function" ? selector(fakeAuthState) : fakeAuthState;
    });

    await act(async () => {
      render(<Root />);
    });
    expect(mockRestore).toHaveBeenCalled();
  });

  it("renders RouterProvider", () => {
    const fakeAuthState = {
      user: null,
      token: null,
      loading: false,
      error: null,
      restore: vi.fn(),
      login: vi.fn(),
      logout: vi.fn(),
    };

    vi.spyOn(authStore, "useAuth").mockImplementation((selector) =>
      selector(fakeAuthState)
    );

    const { getByText } = render(<RouterProvider router={router} />);
    expect(getByText("Home")).toBeInTheDocument();
  });
});
