"use client";

import { useState } from "react";
import type { AmortizationInputValues } from "./components/amortization-inputs";
import {
  AmortizationInputs,
  DEFAULT_INPUTS,
} from "./components/amortization-inputs";
import { AmortizationSummary } from "./components/amortization-summary";
import {
  type AmortizationResult,
  calculateAmortization,
} from "./lib/amortization";

export default function AmortizationPage() {
  const [inputs, setInputs] = useState<AmortizationInputValues>(DEFAULT_INPUTS);
  const [result, setResult] = useState<AmortizationResult | null>(null);

  function handleCalculate() {
    const loanAmount = Number.parseFloat(inputs.loanAmount);
    const termYears = Number.parseInt(inputs.termYears, 10);
    const termMonths = Number.parseInt(inputs.termMonths, 10);
    const annualInterestRate = Number.parseFloat(inputs.annualInterestRate);

    if (
      Number.isNaN(loanAmount) ||
      Number.isNaN(termYears) ||
      Number.isNaN(termMonths) ||
      Number.isNaN(annualInterestRate) ||
      loanAmount <= 0 ||
      termYears * 12 + termMonths <= 0 ||
      annualInterestRate < 0
    ) {
      return;
    }

    const computed = calculateAmortization({
      loanAmount,
      termYears,
      termMonths,
      annualInterestRate,
    });
    setResult(computed);
  }

  function handleClear() {
    setInputs(DEFAULT_INPUTS);
    setResult(null);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <h1 className="font-bold text-2xl">Amortization Calculator</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Calculate your loan repayment schedule instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <AmortizationInputs
            onCalculate={handleCalculate}
            onChange={setInputs}
            onClear={handleClear}
            values={inputs}
          />
        </div>

        <div>
          {result ? (
            <AmortizationSummary result={result} />
          ) : (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed p-8 text-center text-muted-foreground text-sm">
              Enter your loan details and click Calculate.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
