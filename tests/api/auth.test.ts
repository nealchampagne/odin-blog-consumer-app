import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Mock } from "vitest";
import { loginRequest, signupRequest } from "../../src/api/auth.js"; // adjust path
import api from "../../src/api/client.js"; // adjust path
import type { LoginResponse, SignupResponse } from "../../src/types/auth.js";
import type { User } from "../../src/types/user.js";

// Define the signature of your api function
type ApiFn = <T>(
  url: string,
  options: { method: string; body: string }
) => Promise<T>;

// Mock the api module with correct typing
vi.mock("../../src/api/client.js", () => {
  return {
    default: vi.fn() as Mock<ApiFn>,
  };
});

// Cast api to a Vitest Mock with the right signature
const mockedApi = api as unknown as Mock<ApiFn>;

describe("authRequests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("loginRequest", () => {
    it("calls api with correct endpoint and body", async () => {
      const fakeUser: User = {
        id: "1",
        email: "test@example.com",
        name: "Tester",
        role: "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const fakeResponse: LoginResponse = { token: "abc123", user: fakeUser };

      mockedApi.mockResolvedValueOnce(fakeResponse);

      const result = await loginRequest("test@example.com", "password123");

      expect(mockedApi).toHaveBeenCalledWith("/users/login", {
        method: "POST",
        body: JSON.stringify({ email: "test@example.com", password: "password123" }),
      });
      expect(result).toEqual(fakeResponse);
    });

    it("propagates errors from api", async () => {
      mockedApi.mockRejectedValueOnce(new Error("Network error"));
      await expect(loginRequest("bad@example.com", "oops")).rejects.toThrow("Network error");
    });
  });

  describe("signupRequest", () => {
    it("calls api with correct endpoint and body", async () => {
      const fakeUser: User = {
        id: "2",
        email: "new@example.com",
        name: "New User",
        role: "USER",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const fakeResponse: SignupResponse = { token: "xyz789", user: fakeUser };

      mockedApi.mockResolvedValueOnce(fakeResponse);

      const result = await signupRequest("New User", "new@example.com", "securePass");

      expect(mockedApi).toHaveBeenCalledWith("/users/signup", {
        method: "POST",
        body: JSON.stringify({ name: "New User", email: "new@example.com", password: "securePass" }),
      });
      expect(result).toEqual(fakeResponse);
    });

    it("propagates errors from api", async () => {
      mockedApi.mockRejectedValueOnce(new Error("Signup failed"));
      await expect(signupRequest("Bad", "bad@example.com", "oops")).rejects.toThrow("Signup failed");
    });
  });
});


