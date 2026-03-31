import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MonthlyRow, YearlyRow } from "../lib/amortization";

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

interface Props {
  monthlySchedule: MonthlyRow[];
  yearlySchedule: YearlyRow[];
}

export function AmortizationTable({ monthlySchedule, yearlySchedule }: Props) {
  return (
    <Tabs defaultValue="annual">
      <TabsList>
        <TabsTrigger value="annual">Annual Schedule</TabsTrigger>
        <TabsTrigger value="monthly">Monthly Schedule</TabsTrigger>
      </TabsList>

      <TabsContent value="annual">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Interest</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Ending Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearlySchedule.map((row) => (
                <TableRow key={row.period}>
                  <TableCell>{row.period}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {usd.format(row.interest)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {usd.format(row.principal)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {usd.format(row.endingBalance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>

      <TabsContent value="monthly">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Interest</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Ending Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {monthlySchedule.map((row) => (
                <TableRow key={row.period}>
                  <TableCell>{row.period}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {usd.format(row.interest)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {usd.format(row.principal)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {usd.format(row.endingBalance)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  );
}
