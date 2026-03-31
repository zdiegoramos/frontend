import { DashboardCards } from "./cards";
import { ChartBarDemoLegend } from "./chart";

export default function DashboardPage() {
  return (
    <main className="flex flex-col gap-6 p-6">
      <DashboardCards />
      <ChartBarDemoLegend />
    </main>
  );
}
