import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { PageSpinner } from '@/atoms/Spinner';
import { cn } from '@/utils';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
}

type SortDir = 'asc' | 'desc' | null;

export function DataTable<T extends object>({
  columns,
  data,
  loading,
  emptyMessage = 'No data found',
  keyExtractor,
  onRowClick,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : d === 'desc' ? null : 'asc'));
      if (sortDir === 'desc') setSortKey(null);
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const av = (a as Record<string, unknown>)[sortKey];
    const bv = (b as Record<string, unknown>)[sortKey];
    const cmp = String(av ?? '').localeCompare(String(bv ?? ''), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });


  return (
    <div className="table-wrapper">
      <table className="data-table" role="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={col.sortable ? () => handleSort(col.key) : undefined}
                style={{ width: col.width, cursor: col.sortable ? 'pointer' : 'default' }}
                className={cn(col.sortable && 'select-none hover:text-brand-400 transition-colors')}
              >
                <span className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && (
                    <span style={{ color: 'var(--text-muted)' }}>
                      {sortKey === col.key && sortDir === 'asc' ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : sortKey === col.key && sortDir === 'desc' ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronsUpDown className="w-3 h-3 opacity-40" />
                      )}
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-12">
                <PageSpinner />
              </td>
            </tr>
          ) : sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-12 text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sorted.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={cn(onRowClick && 'cursor-pointer')}
              >
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '—')}
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
