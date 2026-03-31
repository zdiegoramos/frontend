import { FormsNav } from "@/components/nav/section-nav";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";
import { ReportBugForm } from "./report-bug-form";

export default function ReportPage() {
  return (
    <WireframeDefault>
      <Providers>
        <FormsNav />
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
      </Providers>
    </WireframeDefault>
  );
}
