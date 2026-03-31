import { CalculatorIcon, HashIcon } from "lucide-react";

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
];
