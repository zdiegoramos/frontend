"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { YearlyRow } from "../lib/amortization";

const chartConfig = {
  endingBalance: {
    label: "Ending Balance",
    color: "var(--chart-1)",
  },
  cumulativeInterest: {
    label: "Cumulative Interest",
    color: "var(--chart-3)",
  },
  annualPayment: {
    label: "Annual Payment",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig;

function formatAbbreviated(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }
  return `$${Math.round(value)}`;
}

interface Props {
  monthlyPayment: number;
  yearlySchedule: YearlyRow[];
}

export function AmortizationLineChart({
  monthlyPayment,
  yearlySchedule,
}: Props) {
  const annualPayment = monthlyPayment * 12;

  const data = yearlySchedule.map((row) => ({
    year: row.period,
    endingBalance: row.endingBalance,
    cumulativeInterest: row.cumulativeInterest,
    annualPayment,
  }));

  return (
    <ChartContainer className="h-64 w-full" config={chartConfig}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          axisLine={false}
          dataKey="year"
          interval="preserveStartEnd"
          label={{ value: "Year", position: "insideBottomRight", offset: -4 }}
          tickCount={8}
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          tickFormatter={formatAbbreviated}
          tickLine={false}
          width={52}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              formatter={(value) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(Number(value))
              }
              labelFormatter={(label) => `Year ${label}`}
              labelKey="year"
            />
          }
        />
        <Line
          dataKey="endingBalance"
          dot={false}
          name="endingBalance"
          stroke="var(--color-endingBalance)"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          dataKey="cumulativeInterest"
          dot={false}
          name="cumulativeInterest"
          stroke="var(--color-cumulativeInterest)"
          strokeWidth={2}
          type="monotone"
        />
        <Line
          dataKey="annualPayment"
          dot={false}
          name="annualPayment"
          stroke="var(--color-annualPayment)"
          strokeDasharray="4 2"
          strokeWidth={2}
          type="monotone"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </LineChart>
    </ChartContainer>
  );
}
