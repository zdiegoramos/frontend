import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AmortizationResult } from "../lib/amortization";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface Props {
  result: AmortizationResult;
}

export function AmortizationSummary({ result }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">Monthly Payment</p>
            <p className="font-bold text-3xl tabular-nums">
              {usd.format(result.monthlyPayment)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Payments</p>
              <p className="font-semibold text-lg tabular-nums">
                {usd.format(result.totalPayments)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Interest</p>
              <p className="font-semibold text-lg tabular-nums">
                {usd.format(result.totalInterest)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
