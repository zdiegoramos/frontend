"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

export type Invoice = {
  nanoId: string;
  merchant: string;
  date: string;
  amount: string;
  currency: string;
  category: string;
  description: string;
  tax: string;
};

function EditDialog({
  invoice,
  onSave,
}: {
  invoice: Invoice;
  onSave: (nanoId: string, data: Partial<Invoice>) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Invoice>(invoice);
  const [saving, setSaving] = useState(false);

  function reset() {
    setForm(invoice);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave(invoice.nanoId, form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      onOpenChange={(next) => {
        if (!next) {
          reset();
        }
        setOpen(next);
      }}
      open={open}
    >
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-sm" htmlFor="merchant">
                Merchant
              </label>
              <Input
                id="merchant"
                onChange={(e) =>
                  setForm((f) => ({ ...f, merchant: e.target.value }))
                }
                value={form.merchant}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-sm" htmlFor="date">
                Date
              </label>
              <Input
                id="date"
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                type="date"
                value={form.date.slice(0, 10)}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-sm" htmlFor="amount">
                Amount
              </label>
              <Input
                id="amount"
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                value={form.amount}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-sm" htmlFor="currency">
                Currency
              </label>
              <Input
                id="currency"
                onChange={(e) =>
                  setForm((f) => ({ ...f, currency: e.target.value }))
                }
                value={form.currency}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-medium text-sm" htmlFor="tax">
                Tax
              </label>
              <Input
                id="tax"
                onChange={(e) =>
                  setForm((f) => ({ ...f, tax: e.target.value }))
                }
                value={form.tax}
              />
            </div>
            <div className="space-y-1">
              <label className="font-medium text-sm" htmlFor="category">
                Category
              </label>
              <Input
                id="category"
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                value={form.category}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="font-medium text-sm" htmlFor="description">
              Description
            </label>
            <Textarea
              id="description"
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={2}
              value={form.description}
            />
          </div>
        </div>
        <DialogFooter>
          <Button disabled={saving} onClick={handleSave} type="button">
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function makeColumns(
  onEdit: (nanoId: string, data: Partial<Invoice>) => Promise<void>,
  onDelete: (nanoId: string) => Promise<void>
): ColumnDef<Invoice>[] {
  return [
    { accessorKey: "merchant", header: "Merchant" },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue }) => {
        const val = getValue() as string;
        return new Date(val).toLocaleDateString();
      },
    },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "currency", header: "Currency" },
    { accessorKey: "category", header: "Category" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "tax", header: "Tax" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const invoice = row.original;
        return (
          <div className="flex items-center gap-2">
            <EditDialog invoice={invoice} onSave={onEdit} />
            <AlertDialog>
              <AlertDialogTrigger
                render={<Button size="sm" variant="destructive" />}
              >
                Delete
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete invoice?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the invoice from{" "}
                    <strong>{invoice.merchant}</strong>. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(invoice.nanoId)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];
}

interface InvoiceTableProps {
  invoices: Invoice[];
  loading: boolean;
  onDelete: (nanoId: string) => Promise<void>;
  onEdit: (nanoId: string, data: Partial<Invoice>) => Promise<void>;
}

export function InvoiceTable({
  invoices,
  loading,
  onEdit,
  onDelete,
}: InvoiceTableProps) {
  const columns = makeColumns(onEdit, onDelete);

  const table = useReactTable({
    data: invoices,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((h) => (
                <TableHead key={h.id}>
                  {h.isPlaceholder
                    ? null
                    : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                className="h-24 text-center text-muted-foreground"
                colSpan={columns.length}
              >
                No invoices yet. Drop a file above to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
