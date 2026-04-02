import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Mock server-only to avoid crashing in test environment
vi.mock("server-only", () => ({}));

const { extractInvoiceFromOllama } = await import("@/server/ollama");

const RE_OLLAMA_NOT_RUNNING = /Ollama is not running/;
const RE_HTTP_404 = /404/;
const RE_MODEL_NOT_FOUND = /llama3.2-vision not found/;
const RE_PDF = /PDF/;

const VALID_EXTRACTION = {
  merchant: "Acme Corp",
  date: "2026-01-15",
  amount: "142.50",
  currency: "USD",
  category: "Software",
  description: "Annual software subscription",
  tax: "12.50",
};

function makeOllamaResponse(responseBody: string, ok = true) {
  return Promise.resolve(
    new Response(JSON.stringify({ response: responseBody, done: true }), {
      status: ok ? 200 : 500,
    })
  );
}

describe("extractInvoiceFromOllama", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe("prompt construction", () => {
    it("sends a POST to the Ollama endpoint with the image and model", async () => {
      vi.mocked(fetch).mockReturnValueOnce(
        makeOllamaResponse(JSON.stringify(VALID_EXTRACTION))
      );

      const buffer = Buffer.from("fake-image-bytes");
      await extractInvoiceFromOllama(buffer, "image/jpeg");

      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:11434/api/generate",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining('"model":"llama3.2-vision"'),
        })
      );
    });

    it("base64-encodes the image and includes it in the request body", async () => {
      vi.mocked(fetch).mockReturnValueOnce(
        makeOllamaResponse(JSON.stringify(VALID_EXTRACTION))
      );

      const buffer = Buffer.from("hello");
      const expectedBase64 = buffer.toString("base64");

      await extractInvoiceFromOllama(buffer, "image/png");

      const callArg = vi.mocked(fetch).mock.calls[0]?.[1];
      expect(callArg?.body).toContain(expectedBase64);
    });

    it("includes stream:false and format:json in the request body", async () => {
      vi.mocked(fetch).mockReturnValueOnce(
        makeOllamaResponse(JSON.stringify(VALID_EXTRACTION))
      );

      await extractInvoiceFromOllama(Buffer.from("x"), "image/webp");

      const callArg = vi.mocked(fetch).mock.calls[0]?.[1];
      const body = JSON.parse(callArg?.body as string) as Record<
        string,
        unknown
      >;
      expect(body.stream).toBe(false);
      expect(body.format).toBe("json");
    });
  });

  describe("JSON parsing", () => {
    it("parses a valid Ollama response into structured fields", async () => {
      vi.mocked(fetch).mockReturnValueOnce(
        makeOllamaResponse(JSON.stringify(VALID_EXTRACTION))
      );

      const result = await extractInvoiceFromOllama(
        Buffer.from("img"),
        "image/jpeg"
      );

      expect(result).toEqual(VALID_EXTRACTION);
    });

    it("strips markdown code fences before parsing", async () => {
      const wrapped = `\`\`\`json\n${JSON.stringify(VALID_EXTRACTION)}\n\`\`\``;
      vi.mocked(fetch).mockReturnValueOnce(makeOllamaResponse(wrapped));

      const result = await extractInvoiceFromOllama(
        Buffer.from("img"),
        "image/jpeg"
      );

      expect(result.merchant).toBe("Acme Corp");
    });

    it("returns empty strings for missing fields in partial JSON", async () => {
      const partial = JSON.stringify({
        merchant: "Partial Store",
        amount: "55.00",
      });
      vi.mocked(fetch).mockReturnValueOnce(makeOllamaResponse(partial));

      const result = await extractInvoiceFromOllama(
        Buffer.from("img"),
        "image/jpeg"
      );

      expect(result.merchant).toBe("Partial Store");
      expect(result.amount).toBe("55.00");
      expect(result.date).toBe("");
      expect(result.currency).toBe("");
      expect(result.category).toBe("");
      expect(result.description).toBe("");
      expect(result.tax).toBe("");
    });

    it("returns all empty strings for completely unparseable output — no crash", async () => {
      vi.mocked(fetch).mockReturnValueOnce(
        makeOllamaResponse("This is not JSON at all, sorry!")
      );

      const result = await extractInvoiceFromOllama(
        Buffer.from("img"),
        "image/jpeg"
      );

      expect(result).toEqual({
        merchant: "",
        date: "",
        amount: "",
        currency: "",
        category: "",
        description: "",
        tax: "",
      });
    });
  });

  describe("error handling", () => {
    it("throws a human-readable error when Ollama is unreachable (ECONNREFUSED)", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(
        new Error("connect ECONNREFUSED 127.0.0.1:11434")
      );

      await expect(
        extractInvoiceFromOllama(Buffer.from("img"), "image/jpeg")
      ).rejects.toThrow(RE_OLLAMA_NOT_RUNNING);
    });

    it("throws a human-readable error when fetch fails generically", async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error("fetch failed"));

      await expect(
        extractInvoiceFromOllama(Buffer.from("img"), "image/jpeg")
      ).rejects.toThrow(RE_OLLAMA_NOT_RUNNING);
    });

    it("throws an error with the HTTP status when Ollama returns non-200", async () => {
      vi.mocked(fetch).mockReturnValueOnce(
        Promise.resolve(
          new Response(JSON.stringify({ error: "model not found" }), {
            status: 404,
          })
        )
      );

      await expect(
        extractInvoiceFromOllama(Buffer.from("img"), "image/jpeg")
      ).rejects.toThrow(RE_HTTP_404);
    });

    it("throws when the response contains an error field", async () => {
      vi.mocked(fetch).mockReturnValueOnce(
        Promise.resolve(
          new Response(
            JSON.stringify({ error: "model llama3.2-vision not found" }),
            { status: 200 }
          )
        )
      );

      await expect(
        extractInvoiceFromOllama(Buffer.from("img"), "image/jpeg")
      ).rejects.toThrow(RE_MODEL_NOT_FOUND);
    });

    it("throws a clear error for PDF files", async () => {
      await expect(
        extractInvoiceFromOllama(Buffer.from("%PDF-1.4"), "application/pdf")
      ).rejects.toThrow(RE_PDF);
    });
  });
});
