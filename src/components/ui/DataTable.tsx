"use client";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends { id: number }> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  className?: string;
}

export function DataTable<T extends { id: number }>({
  columns, data, loading = false, emptyText = "कुनै डेटा छैन।", className
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-xl border border-gray-200", className)}>
      <table className="w-full min-w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={cn("px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap", col.className)}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {loading ? (
            <tr><td colSpan={columns.length} className="py-12 text-center text-gray-400">लोड हुँदैछ...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length} className="py-12 text-center text-gray-400">{emptyText}</td></tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={cn("px-4 py-3 text-gray-700", col.className)}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
