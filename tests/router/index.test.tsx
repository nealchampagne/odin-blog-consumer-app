import { render, screen, act } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { router } from "../../src/router/index.js";

beforeAll(() => {
  // Prevent real network calls
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  }) as unknown as typeof fetch;
});

describe("App router", () => {
  it("renders login page at /login", async () => {
    const testRouter = createMemoryRouter(router.routes, { initialEntries: ["/login"] });
    
    await act(async () => {
      render(<RouterProvider router={testRouter} />);
    });

    expect(screen.getByText(/Log in/i)).toBeInTheDocument();
  });

  it("renders posts list at /", async () => {
    const testRouter = createMemoryRouter(router.routes, { initialEntries: ["/"] });
    
    await act(async () => {
      render(<RouterProvider router={testRouter} />);
    });
    expect(screen.getByText(/Hot Content/i)).toBeInTheDocument();
  });
});