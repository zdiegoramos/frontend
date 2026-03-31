"use client";

import { Cell, Pie, PieChart } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  principal: {
    label: "Principal",
    color: "var(--chart-1)",
  },
  interest: {
    label: "Interest",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

interface Props {
  totalInterest: number;
  totalPayments: number;
}

export function AmortizationPieChart({ totalInterest, totalPayments }: Props) {
  const principal = totalPayments - totalInterest;

  const data = [
    { name: "principal", value: principal },
    { name: "interest", value: totalInterest },
  ];

  return (
    <ChartContainer className="h-64 w-full" config={chartConfig}>
      <PieChart>
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
            />
          }
        />
        <Pie
          cx="50%"
          cy="50%"
          data={data}
          dataKey="value"
          innerRadius="55%"
          nameKey="name"
          outerRadius="80%"
        >
          {data.map((entry) => (
            <Cell
              fill={`var(--color-${entry.name})`}
              key={entry.name}
              stroke="transparent"
            />
          ))}
        </Pie>
        <ChartLegend content={<ChartLegendContent nameKey="name" />} />
      </PieChart>
    </ChartContainer>
  );
}
