import { describe, expect, it } from "vitest";
import { calculateAmortization } from "../lib/amortization";

describe("calculateAmortization", () => {
  it("computes a standard 30-year mortgage at 6%", () => {
    const result = calculateAmortization({
      loanAmount: 200_000,
      termYears: 30,
      termMonths: 0,
      annualInterestRate: 6,
    });

    expect(result.monthlyPayment).toBeCloseTo(1199.1, 0);
    expect(result.totalPayments).toBeCloseTo(431_676, 0);
    expect(result.totalInterest).toBeCloseTo(231_676, 0);
    expect(result.monthlySchedule).toHaveLength(360);
    expect(result.yearlySchedule).toHaveLength(30);

    // First row sanity
    const firstMonth = result.monthlySchedule[0];
    expect(firstMonth?.period).toBe(1);
    expect(firstMonth?.interest).toBeCloseTo(1000, 0);
    expect(firstMonth?.principal).toBeCloseTo(199.1, 0);
    expect(firstMonth?.endingBalance).toBeCloseTo(199_800.9, 0);

    // Final row — balance should be ~0
    const lastMonth = result.monthlySchedule[359];
    expect(lastMonth?.endingBalance).toBeGreaterThanOrEqual(0);
    expect(lastMonth?.endingBalance).toBeLessThan(1);
  });

  it("computes a 15-year loan at 4%", () => {
    const result = calculateAmortization({
      loanAmount: 150_000,
      termYears: 15,
      termMonths: 0,
      annualInterestRate: 4,
    });

    expect(result.monthlyPayment).toBeCloseTo(1109.53, 1);
    expect(result.monthlySchedule).toHaveLength(180);
    expect(result.yearlySchedule).toHaveLength(15);
    expect(result.totalInterest).toBeGreaterThan(0);
    expect(result.totalPayments).toBeCloseTo(result.totalInterest + 150_000, 0);
  });

  it("handles the zero-interest edge case with equal principal splits", () => {
    const result = calculateAmortization({
      loanAmount: 12_000,
      termYears: 1,
      termMonths: 0,
      annualInterestRate: 0,
    });

    expect(result.monthlyPayment).toBeCloseTo(1000, 5);
    expect(result.totalInterest).toBeCloseTo(0, 5);
    expect(result.totalPayments).toBeCloseTo(12_000, 5);
    expect(result.monthlySchedule).toHaveLength(12);

    for (const row of result.monthlySchedule) {
      expect(row.interest).toBeCloseTo(0, 5);
      expect(row.principal).toBeCloseTo(1000, 5);
    }
  });

  it("supports termMonths to extend the loan period", () => {
    const result = calculateAmortization({
      loanAmount: 100_000,
      termYears: 5,
      termMonths: 6,
      annualInterestRate: 5,
    });

    expect(result.monthlySchedule).toHaveLength(66);
  });

  it("includes cumulativeInterest that grows through the schedule", () => {
    const result = calculateAmortization({
      loanAmount: 200_000,
      termYears: 30,
      termMonths: 0,
      annualInterestRate: 6,
    });

    const schedule = result.monthlySchedule;
    expect(schedule[0]?.cumulativeInterest).toBeGreaterThan(0);
    expect(schedule.at(-1)?.cumulativeInterest).toBeCloseTo(
      result.totalInterest,
      0
    );
  });
});
