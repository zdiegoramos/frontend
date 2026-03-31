import { CreateWidgetForm } from "./create-widget-form";

export default function WidgetsPage() {
  return (
    <main className="mx-auto max-w-md p-8">
      <h1 className="mb-6 font-bold text-2xl">Create Widget</h1>
      <CreateWidgetForm />
    </main>
  );
}
