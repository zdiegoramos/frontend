import { relations } from "drizzle-orm";
import {
  bigint,
  index,
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import {
  decimalField,
  enumField,
  integerField,
  textField,
  usernameField,
} from "@/lib/allowed-chars";
import { myNanoid, NANO_ID_LENGTH } from "@/lib/constants";

// ─── USER TABLE ──────────────────────────────────────────────────────────────

export const user = pgTable(
  "user",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    username: varchar("username", { length: 30 }).notNull().unique(),
    email: varchar("email", { length: 254 }).notNull().unique(),
  },
  (t) => [
    uniqueIndex("user_nano_id_idx").on(t.nanoId),
    uniqueIndex("user_username_idx").on(t.username),
    uniqueIndex("user_email_idx").on(t.email),
  ]
);

export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
  plans: many(plan),
}));

export const selectUserSchema = createSelectSchema(user);

export const insertUserSchema = createInsertSchema(user, {
  username: usernameField({
    chars: { preset: "username" },
    label: "Username",
    placeholder: "my_username",
  })
    .min(3, "Must be at least 3 characters")
    .max(30, "Cannot exceed 30 characters")
    .regex(
      /^[a-z0-9]+(_[a-z0-9]+)*$/,
      "Only lowercase letters, numbers, and underscores — no leading or trailing underscores"
    ),
  email: textField({
    chars: { preset: "email" },
    label: "Email",
    placeholder: "email@example.com",
  }).max(254, "Cannot exceed 254 characters"),
}).strict();

export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "archived",
]);

export type PostStatus = (typeof postStatusEnum.enumValues)[number];

export const post = pgTable(
  "post",
  {
    // ── Primary key ───────────────────────────────────────────────────────────
    // Internal bigint — never sent to clients. Fast joins, no enumeration risk.
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    // ── Public identifier ────────────────────────────────────────────────────
    // nanoId: the only ID safe to expose in URLs / API responses.
    // The bigint `id` is used exclusively for internal FK references.
    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    // ── Timestamps ───────────────────────────────────────────────────────────
    // withTimezone: always stores as UTC, avoids DST surprises.
    // $onUpdate is the Drizzle layer; the DB trigger is the safety net for
    // raw SQL updates (see drizzle/setup-triggers.sql).
    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    // ── Business columns ─────────────────────────────────────────────────────
    title: varchar("title", { length: 100 }).notNull(),
    content: text("content").notNull(),

    // ── Enum field ───────────────────────────────────────────────────────────
    // Native PG enum — DB enforces valid values at the type level.
    status: postStatusEnum("status").notNull().default("draft"),

    // ── Foreign key ──────────────────────────────────────────────────────────
    // bigint FK matches the bigint PK on user — no implicit casts needed.
    creatorId: bigint("creator_id", { mode: "bigint" })
      .notNull()
      .references(() => user.id),
  },
  (t) => [
    // Index on FK for efficient reverse-lookups (all posts by a user).
    index("post_creator_id_idx").on(t.creatorId),
    // Unique index on the public ID — used for URL lookups.
    uniqueIndex("post_nano_id_idx").on(t.nanoId),
  ]
);

export const postRelations = relations(post, ({ one }) => ({
  creator: one(user, { fields: [post.creatorId], references: [user.id] }),
}));

// ── Allowed characters ────────────────────────────────────────────────────────
// Drives both the input sanitiser and the keyboard filter in the UI.
// Co-located here so the constraint, the schema, and the UI config never drift.

// ── Schemas ───────────────────────────────────────────────────────────────────
// selectSchema: used in server-side reads. Exact shape of a DB row.
// insertSchema: used in forms AND server-side mutations. Single source of
// validation truth — the same schema validates the form and the API handler.

export const selectPostSchema = createSelectSchema(post);

export const insertPostSchema = createInsertSchema(post, {
  title: textField({
    chars: { preset: "proseEs" },
    label: "Title",
    placeholder: "My post",
  })
    .min(3, "Must be at least 3 characters")
    .max(100, "Cannot exceed 100 characters"),
  content: textField({
    chars: { preset: "multiline" },
    label: "Content",
  }).min(1, "Content cannot be empty"),
  status: z
    .enum(postStatusEnum.enumValues)
    .default("draft")
    .meta({ label: "Status" }),
}).strict();

// ─── WIDGET TABLE ─────────────────────────────────────────────────────────────

export const widgetCategoryEnum = pgEnum("widget_category", [
  "basic",
  "advanced",
  "premium",
]);

export type WidgetCategory = (typeof widgetCategoryEnum.enumValues)[number];

export const widget = pgTable(
  "widget",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    name: varchar("name", { length: 100 }).notNull(),
    category: widgetCategoryEnum("category").notNull().default("basic"),
    amount: integer("amount").notNull(),
  },
  (t) => [
    uniqueIndex("widget_nano_id_idx").on(t.nanoId),
    index("widget_category_idx").on(t.category),
  ]
);
export const selectWidgetSchema = createSelectSchema(widget);

export const insertWidgetSchema = createInsertSchema(widget, {
  name: textField({
    chars: { preset: "proseEs" },
    label: "Name",
    placeholder: "My widget",
  })
    .min(2, "Must be at least 2 characters")
    .max(100, "Cannot exceed 100 characters"),
  category: enumField(widgetCategoryEnum.enumValues, { label: "Category" }),
  amount: integerField({ label: "Amount", chars: { custom: ["numbers"] } }),
}).strict();

// ─── BUG TABLE ────────────────────────────────────────────────────────────────

export const bug = pgTable(
  "bug",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    title: varchar("title", { length: 200 }).notNull(),
    description: varchar("description", { length: 1000 }).notNull(),
  },
  (t) => [uniqueIndex("bug_nano_id_idx").on(t.nanoId)]
);

export const selectBugSchema = createSelectSchema(bug);

export const insertBugSchema = createInsertSchema(bug, {
  title: textField({
    chars: { preset: "prose" },
    label: "Bug Title",
    placeholder: "Login button not working on mobile",
  })
    .min(3, "Must be at least 3 characters")
    .max(200, "Cannot exceed 200 characters"),
  description: textField({
    chars: { preset: "multiline" },
    label: "Description",
    placeholder: "I'm having an issue with the login button on mobile.",
  })
    .min(1, "Description cannot be empty")
    .max(1000, "Cannot exceed 1000 characters"),
}).strict();

// ─── PLAN TABLE ───────────────────────────────────────────────────────────────

export const planTypeEnum = pgEnum("plan_type", ["basic", "pro"]);

export type PlanType = (typeof planTypeEnum.enumValues)[number];

export const plan = pgTable(
  "plan",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    type: planTypeEnum("type").notNull(),

    userId: bigint("user_id", { mode: "bigint" })
      .notNull()
      .references(() => user.id),
  },
  (t) => [
    uniqueIndex("plan_nano_id_idx").on(t.nanoId),
    index("plan_user_id_idx").on(t.userId),
  ]
);

export const planRelations = relations(plan, ({ one }) => ({
  user: one(user, { fields: [plan.userId], references: [user.id] }),
}));

export const selectPlanSchema = createSelectSchema(plan);

export const insertPlanSchema = createInsertSchema(plan, {
  type: enumField(planTypeEnum.enumValues, { label: "Plan" }),
}).strict();

// ─── CREDIT CARD TABLE ───────────────────────────────────────────────────────

export const cardBrandEnum = pgEnum("card_brand", [
  "visa",
  "mastercard",
  "amex",
  "discover",
  "unknown",
]);

export type CardBrand = (typeof cardBrandEnum.enumValues)[number];

export const expiryMonthEnum = pgEnum("expiry_month", [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
]);

export type ExpiryMonth = (typeof expiryMonthEnum.enumValues)[number];

export const creditCard = pgTable(
  "credit_card",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    cardholderName: varchar("cardholder_name", { length: 100 }).notNull(),
    // Only the last 4 digits are stored — full PANs must never be persisted.
    lastFourDigits: varchar("last_four_digits", { length: 4 }).notNull(),
    expiryMonth: expiryMonthEnum("expiry_month").notNull(),
    expiryYear: varchar("expiry_year", { length: 4 }).notNull(),
    brand: cardBrandEnum("brand").notNull().default("unknown"),
  },
  (t) => [uniqueIndex("credit_card_nano_id_idx").on(t.nanoId)]
);

export const selectCreditCardSchema = createSelectSchema(creditCard);

export const insertCreditCardSchema = createInsertSchema(creditCard, {
  cardholderName: textField({
    chars: { preset: "name" },
    label: "Name on Card",
    placeholder: "John Doe",
  })
    .min(2, "Must be at least 2 characters")
    .max(100, "Cannot exceed 100 characters"),
  lastFourDigits: textField({
    chars: { custom: ["numbers"] },
    label: "Last Four Digits",
  })
    .length(4, "Must be exactly 4 digits")
    .regex(/^\d{4}$/, "Must contain only digits"),
  expiryMonth: enumField(expiryMonthEnum.enumValues, {
    label: "Month",
    placeholder: "MM",
  }),
  expiryYear: textField({
    chars: { custom: ["numbers"] },
    label: "Year",
    placeholder: "YYYY",
  }).regex(/^\d{4}$/, "Select a valid year"),
  brand: enumField(cardBrandEnum.enumValues, { label: "Card Brand" }),
}).strict();

// ─── ADDRESS TABLE ────────────────────────────────────────────────────────────

export const address = pgTable(
  "address",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    creditCardId: bigint("credit_card_id", { mode: "bigint" })
      .notNull()
      .references(() => creditCard.id),

    line1: varchar("line1", { length: 200 }).notNull(),
    line2: varchar("line2", { length: 200 }),
    city: varchar("city", { length: 100 }).notNull(),
    state: varchar("state", { length: 100 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    country: varchar("country", { length: 100 }).notNull(),
  },
  (t) => [
    uniqueIndex("address_nano_id_idx").on(t.nanoId),
    index("address_credit_card_id_idx").on(t.creditCardId),
  ]
);

export const creditCardRelations = relations(creditCard, ({ one }) => ({
  address: one(address, {
    fields: [creditCard.id],
    references: [address.creditCardId],
  }),
}));

export const addressRelations = relations(address, ({ one }) => ({
  creditCard: one(creditCard, {
    fields: [address.creditCardId],
    references: [creditCard.id],
  }),
}));

export const selectAddressSchema = createSelectSchema(address);

export const insertAddressSchema = createInsertSchema(address, {
  line1: textField({
    chars: { preset: "prose" },
    label: "Address Line 1",
    placeholder: "123 Main St",
  })
    .min(1, "Required")
    .max(200, "Cannot exceed 200 characters"),
  line2: textField({
    chars: { preset: "prose" },
    label: "Address Line 2",
    placeholder: "Apt 4B",
  })
    .max(200, "Cannot exceed 200 characters")
    .optional()
    .meta({
      label: "Address Line 2",
      placeholder: "Apt 4B",
      chars: { preset: "prose" },
    }),
  city: textField({
    chars: { preset: "prose" },
    label: "City",
    placeholder: "New York",
  })
    .min(1, "Required")
    .max(100, "Cannot exceed 100 characters"),
  state: textField({
    chars: { preset: "prose" },
    label: "State / Province",
    placeholder: "NY",
  })
    .min(1, "Required")
    .max(100, "Cannot exceed 100 characters"),
  postalCode: textField({
    chars: { custom: ["letters", "numbers"] },
    label: "Postal Code",
    placeholder: "10001",
  })
    .min(1, "Required")
    .max(20, "Cannot exceed 20 characters"),
  country: textField({
    chars: { preset: "prose" },
    label: "Country",
    placeholder: "United States",
  })
    .min(1, "Required")
    .max(100, "Cannot exceed 100 characters"),
}).strict();

// ─── INVOICE TABLE ───────────────────────────────────────────────────────────

export const invoice = pgTable(
  "invoice",
  {
    id: bigint("id", { mode: "bigint" })
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    nanoId: varchar("nano_id", { length: NANO_ID_LENGTH })
      .$defaultFn(() => myNanoid())
      .notNull()
      .unique(),

    createdAt: timestamp("created_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .$defaultFn(() => new Date())
      .$onUpdate(() => new Date())
      .notNull(),

    merchant: varchar("merchant", { length: 200 }).notNull(),
    date: timestamp("date", { withTimezone: true }).notNull(),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull(),
    category: varchar("category", { length: 100 }).notNull(),
    description: text("description").notNull(),
    tax: numeric("tax", { precision: 12, scale: 2 }).notNull(),
  },
  (t) => [uniqueIndex("invoice_nano_id_idx").on(t.nanoId)]
);

export const selectInvoiceSchema = createSelectSchema(invoice);

export const insertInvoiceSchema = createInsertSchema(invoice, {
  merchant: textField({
    chars: { preset: "prose" },
    label: "Merchant",
    placeholder: "Acme Corp",
  })
    .min(1, "Required")
    .max(200, "Cannot exceed 200 characters"),
  currency: textField({
    chars: { custom: ["letters"] },
    label: "Currency",
    placeholder: "USD",
  })
    .min(1, "Required")
    .max(10, "Cannot exceed 10 characters"),
  category: textField({
    chars: { preset: "prose" },
    label: "Category",
    placeholder: "Software",
  })
    .min(1, "Required")
    .max(100, "Cannot exceed 100 characters"),
  description: textField({
    chars: { preset: "multiline" },
    label: "Description",
  }).min(1, "Required"),
  amount: decimalField({ label: "Amount" }),
  tax: decimalField({ label: "Tax" }),
}).strict();

export default { user, post, widget, bug, plan, creditCard, address, invoice };
