import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReportBugForm } from "./report-bug-form";

export default function ReportPage() {
  return (
    <main className="flex min-h-screen items-start justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bug Report</CardTitle>
          <CardDescription>
            Help us improve by reporting bugs you encounter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReportBugForm />
        </CardContent>
      </Card>
    </main>
  );
}
