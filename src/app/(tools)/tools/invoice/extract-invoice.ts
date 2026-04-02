"use server";

import { extractInvoiceFromOllama } from "@/server/ollama";

export type ExtractedInvoice = {
  merchant: string;
  date: string;
  amount: string;
  currency: string;
  category: string;
  description: string;
  tax: string;
};

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function extractInvoice(
  formData: FormData
): Promise<ExtractedInvoice> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No file provided");
  }

  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      `Unsupported file type "${file.type}". Accepted types: PDF, JPG, PNG, WEBP.`
    );
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const extracted = await extractInvoiceFromOllama(buffer, file.type);

  return {
    merchant: extracted.merchant,
    date: extracted.date || new Date().toISOString().slice(0, 10),
    amount: extracted.amount || "0.00",
    currency: extracted.currency || "USD",
    category: extracted.category,
    description: extracted.description,
    tax: extracted.tax || "0.00",
  };
}
