"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { orpc } from "@/lib/orpc";
import { type ExtractedInvoice, extractInvoice } from "./extract-invoice";

const ACCEPTED_EXTENSIONS = ".pdf,.jpg,.jpeg,.png,.webp";
const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

interface ReviewForm extends ExtractedInvoice {}

interface InvoiceDropZoneProps {
  onCreated: () => Promise<void>;
}

export function InvoiceDropZone({ onCreated }: InvoiceDropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [review, setReview] = useState<ReviewForm | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function processFile(file: File) {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Accepted: PDF, JPG, PNG, WEBP.");
      return;
    }

    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const extracted = await extractInvoice(formData);
      setReview(extracted);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to process file"
      );
    } finally {
      setProcessing(false);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await processFile(file);
    }
  }

  async function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
    // Reset so the same file can be dropped again
    e.target.value = "";
  }

  async function handleSave() {
    if (!review) {
      return;
    }
    setSaving(true);
    try {
      await orpc.invoice.create({
        merchant: review.merchant,
        date: new Date(review.date),
        amount: review.amount,
        currency: review.currency,
        category: review.category,
        description: review.description,
        tax: review.tax,
      });
      toast.success("Invoice saved");
      setReview(null);
      await onCreated();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save invoice"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      {/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: drop zone requires drag events on container */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: drop zone requires drag events on container */}
      <section
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/30 bg-muted/20"
        }`}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {processing ? (
          <p className="text-muted-foreground text-sm">Processing file…</p>
        ) : (
          <>
            <p className="text-muted-foreground text-sm">
              Drag and drop a PDF or image here
            </p>
            <span className="text-muted-foreground text-xs">or</span>
            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              type="button"
              variant="outline"
            >
              Choose file
            </Button>
          </>
        )}
        <input
          accept={ACCEPTED_EXTENSIONS}
          className="hidden"
          onChange={handleFileInput}
          ref={fileInputRef}
          type="file"
        />
      </section>

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setReview(null);
          }
        }}
        open={review !== null}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Extracted Invoice</DialogTitle>
          </DialogHeader>
          {review && (
            <div className="grid gap-3 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-sm" htmlFor="rv-merchant">
                    Merchant
                  </label>
                  <Input
                    id="rv-merchant"
                    onChange={(e) =>
                      setReview((r) =>
                        r ? { ...r, merchant: e.target.value } : r
                      )
                    }
                    value={review.merchant}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-sm" htmlFor="rv-date">
                    Date
                  </label>
                  <Input
                    id="rv-date"
                    onChange={(e) =>
                      setReview((r) => (r ? { ...r, date: e.target.value } : r))
                    }
                    type="date"
                    value={review.date.slice(0, 10)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-sm" htmlFor="rv-amount">
                    Amount
                  </label>
                  <Input
                    id="rv-amount"
                    onChange={(e) =>
                      setReview((r) =>
                        r ? { ...r, amount: e.target.value } : r
                      )
                    }
                    value={review.amount}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-sm" htmlFor="rv-currency">
                    Currency
                  </label>
                  <Input
                    id="rv-currency"
                    onChange={(e) =>
                      setReview((r) =>
                        r ? { ...r, currency: e.target.value } : r
                      )
                    }
                    value={review.currency}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-sm" htmlFor="rv-tax">
                    Tax
                  </label>
                  <Input
                    id="rv-tax"
                    onChange={(e) =>
                      setReview((r) => (r ? { ...r, tax: e.target.value } : r))
                    }
                    value={review.tax}
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-sm" htmlFor="rv-category">
                    Category
                  </label>
                  <Input
                    id="rv-category"
                    onChange={(e) =>
                      setReview((r) =>
                        r ? { ...r, category: e.target.value } : r
                      )
                    }
                    value={review.category}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-medium text-sm" htmlFor="rv-description">
                  Description
                </label>
                <Textarea
                  id="rv-description"
                  onChange={(e) =>
                    setReview((r) =>
                      r ? { ...r, description: e.target.value } : r
                    )
                  }
                  rows={2}
                  value={review.description}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button disabled={saving} onClick={handleSave} type="button">
              {saving ? "Saving…" : "Save Invoice"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
