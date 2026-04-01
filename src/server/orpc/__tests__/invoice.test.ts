import { call } from "@orpc/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockInvoice = {
  id: BigInt(1),
  nanoId: "abc123ABCDE",
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
  merchant: "Acme Corp",
  date: new Date("2026-01-01T00:00:00Z"),
  amount: "100.00",
  currency: "USD",
  category: "Software",
  description: "Software subscription",
  tax: "10.00",
};

const mockReturning = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockFrom = vi.fn();
const mockValues = vi.fn();
const mockSet = vi.fn();

vi.mock("@/server/db", () => ({
  db: {
    insert: vi.fn(() => ({ values: mockValues })),
    select: vi.fn(() => ({ from: mockFrom })),
    update: vi.fn(() => ({ set: mockSet })),
    delete: vi.fn(() => ({ where: mockWhere })),
  },
}));

// Import router after mocks are set up
const { appRouter } = await import("@/server/orpc/router");

describe("invoiceRouter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("list", () => {
    it("returns all invoices ordered by date descending", async () => {
      mockFrom.mockReturnValue({ orderBy: mockOrderBy });
      mockOrderBy.mockResolvedValue([mockInvoice]);

      const result = await call(appRouter.invoice.list, undefined);

      expect(result).toEqual([mockInvoice]);
      expect(mockOrderBy).toHaveBeenCalledTimes(1);
    });

    it("returns empty array when no invoices exist", async () => {
      mockFrom.mockReturnValue({ orderBy: mockOrderBy });
      mockOrderBy.mockResolvedValue([]);

      const result = await call(appRouter.invoice.list, undefined);

      expect(result).toEqual([]);
    });
  });

  describe("create", () => {
    const validInput = {
      merchant: "Acme Corp",
      date: new Date("2026-01-01T00:00:00Z"),
      amount: "100.00",
      currency: "USD",
      category: "Software",
      description: "Software subscription",
      tax: "10.00",
    };

    it("creates and returns the invoice", async () => {
      mockValues.mockReturnValue({ returning: mockReturning });
      mockReturning.mockResolvedValue([mockInvoice]);

      const result = await call(appRouter.invoice.create, validInput);

      expect(result).toEqual({ invoice: mockInvoice });
      expect(mockValues).toHaveBeenCalledWith(expect.objectContaining({
        merchant: "Acme Corp",
        currency: "USD",
        category: "Software",
        description: "Software subscription",
      }));
    });

    it("throws when DB returns empty result", async () => {
      mockValues.mockReturnValue({ returning: mockReturning });
      mockReturning.mockResolvedValue([]);

      await expect(
        call(appRouter.invoice.create, validInput)
      ).rejects.toThrow("Failed to create invoice");
    });
  });

  describe("update", () => {
    it("updates and returns the invoice by nanoId", async () => {
      mockSet.mockReturnValue({ where: mockWhere });
      mockWhere.mockReturnValue({ returning: mockReturning });
      mockReturning.mockResolvedValue([{ ...mockInvoice, merchant: "Updated Corp" }]);

      const result = await call(appRouter.invoice.update, {
        nanoId: "abc123ABCDE",
        data: { merchant: "Updated Corp" },
      });

      expect(result).toEqual({ invoice: expect.objectContaining({ merchant: "Updated Corp" }) });
      expect(mockWhere).toHaveBeenCalledTimes(1);
    });

    it("throws when invoice is not found", async () => {
      mockSet.mockReturnValue({ where: mockWhere });
      mockWhere.mockReturnValue({ returning: mockReturning });
      mockReturning.mockResolvedValue([]);

      await expect(
        call(appRouter.invoice.update, {
          nanoId: "notfound000",
          data: { merchant: "X" },
        })
      ).rejects.toThrow("Invoice not found");
    });
  });

  describe("delete", () => {
    it("deletes and returns the invoice by nanoId", async () => {
      mockWhere.mockReturnValue({ returning: mockReturning });
      mockReturning.mockResolvedValue([mockInvoice]);

      const result = await call(appRouter.invoice.delete, {
        nanoId: "abc123ABCDE",
      });

      expect(result).toEqual({ invoice: mockInvoice });
      expect(mockWhere).toHaveBeenCalledTimes(1);
    });

    it("throws when invoice is not found", async () => {
      mockWhere.mockReturnValue({ returning: mockReturning });
      mockReturning.mockResolvedValue([]);

      await expect(
        call(appRouter.invoice.delete, { nanoId: "notfound000" })
      ).rejects.toThrow("Invoice not found");
    });
  });
});
