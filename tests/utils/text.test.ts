import { describe, it, expect } from "vitest";
import { getPreview } from "../../src/utils/text.js";

describe("getPreview", () => {
  it("removes basic markdown characters", () => {
    const result = getPreview("# Heading *bold* _italic_ `code`");
    expect(result).toBe("Heading bold italic code");
  });

  it("converts links to text only", () => {
    const result = getPreview("Check [this link](http://example.com)");
    expect(result).toBe("Check this link");
  });

  it("removes images entirely", () => {
    const result = getPreview("![alt text](image.png) Some text");
    expect(result).toBe("Some text");
  });

  it("collapses newlines into spaces", () => {
    const result = getPreview("Line one\n\nLine two");
    expect(result).toBe("Line one Line two");
  });

  it("trims whitespace", () => {
    const result = getPreview("   padded text   ");
    expect(result).toBe("padded text");
  });

  it("truncates long text with ellipsis", () => {
    const longText = "a".repeat(120);
    const result = getPreview(longText, 100);
    expect(result).toBe("a".repeat(100) + "…");
  });

  it("returns full text if shorter than length", () => {
    const result = getPreview("short text", 100);
    expect(result).toBe("short text");
  });
});