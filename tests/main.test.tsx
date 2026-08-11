beforeAll(() => {
  // Prevent real network calls
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  }) as unknown as typeof fetch;
});

describe("main entry point", () => {
  it("runs without crashing", async () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);

    await import("../src/main.tsx");
    expect(root).toBeDefined();
  });
});