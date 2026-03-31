import Link from "next/link";
import { orpc } from "@/lib/orpc";

export default async function WidgetsListPage() {
  const allWidgets = await orpc.widget.list();

  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Widgets</h1>
        <Link
          className="rounded bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
          href="/forms/widgets"
        >
          Create Widget
        </Link>
      </div>

      {allWidgets.length === 0 ? (
        <p className="text-gray-500 text-sm">No widgets yet.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="pb-2 font-medium">Name</th>
              <th className="pb-2 font-medium">Category</th>
              <th className="pb-2 font-medium">Amount</th>
              <th className="pb-2 font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {allWidgets.map((widget) => (
              <tr className="border-b last:border-0" key={widget.id}>
                <td className="py-2">{widget.name}</td>
                <td className="py-2 capitalize">{widget.category}</td>
                <td className="py-2">{widget.amount}</td>
                <td className="py-2 text-gray-500">
                  {widget.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
