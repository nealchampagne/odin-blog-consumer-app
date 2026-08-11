import { act } from "@testing-library/react";
import { vi } from "vitest";
import { useAuth } from "../../src/store/auth.js";
import * as authApi from "../../src/api/auth.js";
import type { User } from "../../src/types/user.js";
import type { LoginResponse } from "../../src/types/auth.js";

describe("useAuth store", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Reset Zustand state between tests
    const { logout } = useAuth.getState();
    logout();
  });

  it("logs in successfully and updates state/localStorage", async () => {
    const fakeUser: User = {
      id: "u1",
      name: "Tester",
      email: "test@example.com",
      role: "USER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const fakeResponse: LoginResponse = {
      token: "abc123",
      user: fakeUser,
    };

    vi.spyOn(authApi, "loginRequest").mockResolvedValue(fakeResponse);

    await act(async () => {
      await useAuth.getState().login("test@example.com", "password");
    });

    const state = useAuth.getState();
    expect(state.user).toEqual(fakeUser);
    expect(state.token).toBe("abc123");
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();

    expect(localStorage.getItem("token")).toBe("abc123");
    expect(localStorage.getItem("user")).toContain("Tester");
  });

  it("handles login failure and sets error", async () => {
    vi.spyOn(authApi, "loginRequest").mockRejectedValue(new Error("Invalid credentials"));

    await act(async () => {
      await useAuth.getState().login("bad@example.com", "wrong");
    });

    const state = useAuth.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Invalid credentials");
  });

  it("logs out and clears state/localStorage", () => {
    localStorage.setItem("token", "abc123");
    localStorage.setItem("user", JSON.stringify({ id: "u1", name: "Tester" }));

    useAuth.getState().logout();

    const state = useAuth.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.loading).toBe(false);

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("restores state from localStorage", () => {
    const fakeUser: User = {
      id: "u1",
      name: "Tester",
      email: "test@example.com",
      role: "USER",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("token", "abc123");
    localStorage.setItem("user", JSON.stringify(fakeUser));

    useAuth.getState().restore();

    const state = useAuth.getState();
    expect(state.token).toBe("abc123");
    expect(state.user).toEqual(fakeUser);
    expect(state.loading).toBe(false);
  });

  it("handles restore with invalid JSON gracefully", () => {
    localStorage.setItem("token", "abc123");
    localStorage.setItem("user", "{bad json}");

    useAuth.getState().restore();

    const state = useAuth.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
  });
});
