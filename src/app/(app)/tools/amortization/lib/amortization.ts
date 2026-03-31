import Decimal from "decimal.js-light";

export interface AmortizationParams {
  annualInterestRate: number;
  loanAmount: number;
  termMonths: number;
  termYears: number;
}

export interface MonthlyRow {
  cumulativeInterest: number;
  endingBalance: number;
  interest: number;
  period: number;
  principal: number;
}

export interface YearlyRow {
  cumulativeInterest: number;
  endingBalance: number;
  interest: number;
  period: number;
  principal: number;
}

export interface AmortizationResult {
  monthlyPayment: number;
  monthlySchedule: MonthlyRow[];
  totalInterest: number;
  totalPayments: number;
  yearlySchedule: YearlyRow[];
}

export function calculateAmortization(
  params: AmortizationParams
): AmortizationResult {
  const { loanAmount, termYears, termMonths, annualInterestRate } = params;

  const n = termYears * 12 + termMonths;
  const principal = new Decimal(loanAmount);

  // Zero-interest edge case: equal principal splits
  if (annualInterestRate === 0) {
    const monthlyPayment = principal.div(n);
    const monthlySchedule: MonthlyRow[] = [];
    let balance = principal;

    for (let i = 1; i <= n; i++) {
      const pmt = i === n ? balance : monthlyPayment;
      balance = balance.minus(pmt);

      monthlySchedule.push({
        period: i,
        interest: 0,
        principal: pmt.toNumber(),
        endingBalance: balance.toNumber(),
        cumulativeInterest: 0,
      });
    }

    const yearlySchedule = buildYearlySchedule(monthlySchedule);

    return {
      monthlyPayment: monthlyPayment.toNumber(),
      totalPayments: principal.toNumber(),
      totalInterest: 0,
      monthlySchedule,
      yearlySchedule,
    };
  }

  // Standard amortization formula: M = P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = new Decimal(annualInterestRate).div(100).div(12);
  const onePlusR = monthlyRate.plus(1);
  const onePlusRpowN = onePlusR.pow(n);
  const monthlyPayment = principal
    .mul(monthlyRate)
    .mul(onePlusRpowN)
    .div(onePlusRpowN.minus(1));

  const monthlySchedule: MonthlyRow[] = [];
  let balance = principal;
  let cumulativeInterest = new Decimal(0);

  for (let i = 1; i <= n; i++) {
    const interestCharge = balance.mul(monthlyRate);
    let principalCharge = monthlyPayment.minus(interestCharge);

    // On the last payment, pay off whatever remains
    if (i === n) {
      principalCharge = balance;
    }

    balance = balance.minus(principalCharge);
    // Clamp to zero to avoid floating-point negatives
    if (balance.lessThan(0)) {
      balance = new Decimal(0);
    }

    cumulativeInterest = cumulativeInterest.plus(interestCharge);

    monthlySchedule.push({
      period: i,
      interest: interestCharge.toNumber(),
      principal: principalCharge.toNumber(),
      endingBalance: balance.toNumber(),
      cumulativeInterest: cumulativeInterest.toNumber(),
    });
  }

  const yearlySchedule = buildYearlySchedule(monthlySchedule);
  const totalInterest = cumulativeInterest.toNumber();
  const totalPayments = new Decimal(loanAmount).plus(totalInterest).toNumber();

  return {
    monthlyPayment: monthlyPayment.toNumber(),
    totalPayments,
    totalInterest,
    monthlySchedule,
    yearlySchedule,
  };
}

function buildYearlySchedule(monthly: MonthlyRow[]): YearlyRow[] {
  const yearly: YearlyRow[] = [];

  for (let i = 0; i < monthly.length; i += 12) {
    const chunk = monthly.slice(i, i + 12);
    const yearNumber = Math.floor(i / 12) + 1;
    const totalInterest = chunk.reduce((sum, r) => sum + r.interest, 0);
    const totalPrincipal = chunk.reduce((sum, r) => sum + r.principal, 0);
    const endingBalance = chunk.at(-1)?.endingBalance ?? 0;
    const cumulativeInterest = chunk.at(-1)?.cumulativeInterest ?? 0;

    yearly.push({
      period: yearNumber,
      interest: totalInterest,
      principal: totalPrincipal,
      endingBalance,
      cumulativeInterest,
    });
  }

  return yearly;
}
