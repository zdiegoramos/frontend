import { CalculatorIcon, HashIcon, ReceiptIcon } from "lucide-react";

export const TOOLS_NAV = [
  {
    name: "Amortization",
    description: "Calculate your loan repayment schedule.",
    href: "/tools/amortization",
    icon: CalculatorIcon,
    activePatterns: ["/tools/amortization", "/tools/amortization/*"],
  },
  {
    name: "Calculator",
    description: "Simple arithmetic calculator.",
    href: "/tools/calculator",
    icon: HashIcon,
    activePatterns: ["/tools/calculator", "/tools/calculator/*"],
  },
  {
    name: "Invoice Tracker",
    description: "Extract and record expenses from PDF and image invoices.",
    href: "/tools/invoice",
    icon: ReceiptIcon,
    activePatterns: ["/tools/invoice", "/tools/invoice/*"],
  },
];
