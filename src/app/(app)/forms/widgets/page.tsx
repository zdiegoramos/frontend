import { FormsNav } from "@/components/nav/section-nav";
import { WireframeDefault } from "@/components/wireframe-default";
import { Providers } from "@/providers";
import { CreateWidgetForm } from "./create-widget-form";

export default function WidgetsPage() {
  return (
    <WireframeDefault>
      <Providers>
        <FormsNav />
        <main className="mx-auto max-w-md p-8">
          <h1 className="mb-6 font-bold text-2xl">Create Widget</h1>
          <CreateWidgetForm />
        </main>
      </Providers>
    </WireframeDefault>
  );
}
