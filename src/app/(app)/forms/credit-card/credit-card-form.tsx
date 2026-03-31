"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod/v4";
import { Form, useAppForm } from "@/components/form";
import { Button } from "@/components/ui/button";
import { orpc } from "@/lib/orpc";
import type { CardBrand, ExpiryMonth } from "@/server/db/schema";
import { insertCreditCardSchema } from "@/server/db/schema";

// ─── Form-level schema ────────────────────────────────────────────────────────
// Derived from the DB insert schema. cardholderName validation is reused directly.
// cardNumber and cvv are UI-only (not stored); expiryMonth/Year use string selects
// in the form and are converted to numbers before hitting the server.

export const creditCardFormSchema = insertCreditCardSchema
  .pick({ cardholderName: true, expiryMonth: true, expiryYear: true })
  .extend({
    cardNumber: z
      .string()
      .refine(
        (v) => v.replace(/\s/g, "").length === 16,
        "Card number must be 16 digits"
      )
      .meta({ label: "Card Number", placeholder: "1234 5678 9012 3456" }),
    cvv: z
      .string()
      .min(3, "Must be at least 3 digits")
      .max(4, "Cannot exceed 4 digits")
      .regex(/^\d+$/, "Must contain only digits")
      .meta({ label: "CVV", placeholder: "123" }),
  });

// ─── Month / Year options ─────────────────────────────────────────────────────

export const MONTH_OPTIONS: [string, string][] = [
  ["01", "01 - Jan"],
  ["02", "02 - Feb"],
  ["03", "03 - Mar"],
  ["04", "04 - Apr"],
  ["05", "05 - May"],
  ["06", "06 - Jun"],
  ["07", "07 - Jul"],
  ["08", "08 - Aug"],
  ["09", "09 - Sep"],
  ["10", "10 - Oct"],
  ["11", "11 - Nov"],
  ["12", "12 - Dec"],
] as const;

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS: [string, string][] = Array.from({ length: 11 }, (_, i) => {
  const y = String(CURRENT_YEAR + i);
  return [y, y];
});

// ─── Card brand detection ─────────────────────────────────────────────────────

const VISA_REGEX = /^4/;
const MASTERCARD_REGEX = /^(5[1-5]|2(2[2-9][1-9]|[3-6]\d\d|7[01]\d|720))/;
const AMEX_REGEX = /^3[47]/;
const DISCOVER_REGEX = /^(6011|65|64[4-9]|622)/;

function detectBrand(cardNumber: string): CardBrand {
  const digits = cardNumber.replace(/\s/g, "");
  if (VISA_REGEX.test(digits)) {
    return "visa";
  }
  if (MASTERCARD_REGEX.test(digits)) {
    return "mastercard";
  }
  if (AMEX_REGEX.test(digits)) {
    return "amex";
  }
  if (DISCOVER_REGEX.test(digits)) {
    return "discover";
  }
  return "unknown";
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CreditCardForm() {
  const router = useRouter();

  const form = useAppForm({
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      cvv: "",
      expiryMonth: "",
      expiryYear: "",
    },
    validators: {
      onChange: creditCardFormSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        toast("Saving card…");
        const digits = value.cardNumber.replace(/\s/g, "");
        await orpc.creditCard.create({
          cardholderName: value.cardholderName,
          lastFourDigits: digits.slice(-4),
          expiryMonth: value.expiryMonth as ExpiryMonth,
          expiryYear: value.expiryYear,
          brand: detectBrand(value.cardNumber),
        });
        toast("Card saved successfully!");
        router.push("/");
      } catch {
        toast("Error saving card");
      }
    },
  });

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.AppField name="cardholderName">
        {(field) => (
          <field.TextInput schema={creditCardFormSchema.shape.cardholderName} />
        )}
      </form.AppField>

      <form.AppField name="cardNumber">
        {(field) => (
          <field.CardNumberInput
            schema={creditCardFormSchema.shape.cardNumber}
          />
        )}
      </form.AppField>

      <form.AppField name="cvv">
        {(field) => <field.CvvInput schema={creditCardFormSchema.shape.cvv} />}
      </form.AppField>

      <div className="grid grid-cols-2 gap-3">
        <form.AppField name="expiryMonth">
          {(field) => (
            <field.SelectInput
              items={MONTH_OPTIONS}
              schema={creditCardFormSchema.shape.expiryMonth}
            />
          )}
        </form.AppField>

        <form.AppField name="expiryYear">
          {(field) => (
            <field.SelectInput
              items={YEAR_OPTIONS}
              schema={creditCardFormSchema.shape.expiryYear}
            />
          )}
        </form.AppField>
      </div>

      <form.Subscribe selector={(state) => [state.canSubmit]}>
        {([canSubmit]) => (
          <Button className="mt-2" disabled={canSubmit === false} type="submit">
            <Save />
            Save Card
          </Button>
        )}
      </form.Subscribe>
    </Form>
  );
}
