import Link from "next/link";
import { notFound } from "next/navigation";
import { orpc } from "@/lib/orpc";

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { widget } = await orpc.widget.get({ id }).catch(() => notFound());

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">{widget.name}</h1>
        <Link
          className="text-gray-500 text-sm hover:text-gray-800"
          href="/forms/widgets/list"
        >
          All Widgets
        </Link>
      </div>

      <dl className="space-y-4 text-sm">
        <div className="flex gap-4 border-b pb-4">
          <dt className="w-32 font-medium text-gray-500">Category</dt>
          <dd className="capitalize">{widget.category}</dd>
        </div>
        <div className="flex gap-4 border-b pb-4">
          <dt className="w-32 font-medium text-gray-500">Amount</dt>
          <dd>{widget.amount}</dd>
        </div>
        <div className="flex gap-4">
          <dt className="w-32 font-medium text-gray-500">Created</dt>
          <dd>{widget.createdAt.toLocaleDateString()}</dd>
        </div>
      </dl>
    </main>
  );
}
