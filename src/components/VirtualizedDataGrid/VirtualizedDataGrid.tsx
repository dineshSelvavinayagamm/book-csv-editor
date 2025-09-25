import React, { useMemo, useState, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';
import EditCell from '../EditCell/EditCell';

export interface RowObj {
  _id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface VirtualizedDataGridProps {
  columns: string[];
  rows: RowObj[];
  setRows: React.Dispatch<React.SetStateAction<RowObj[]>>;
  originalRows: RowObj[];
  pageSize: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  filter: string;
}

export default function VirtualizedDataGrid({
  columns,
  rows,
  setRows,
  originalRows,
  pageSize,
  currentPage,
  setCurrentPage,
  filter,
}: VirtualizedDataGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Filter rows
  const filtered = useMemo(() => {
    if (!filter) return rows;
    const q = filter.toLowerCase();
    return rows.filter((r) =>
      columns.some((c) =>
        String(r[c] ?? '')
          .toLowerCase()
          .includes(q),
      ),
    );
  }, [rows, filter, columns]);

  // Sort rows
  const sorted = useMemo(() => {
    if (!sortBy) return filtered;
    const copy = [...filtered];
    copy.sort((a, b) => {
      const A = String(a[sortBy] ?? '');
      const B = String(b[sortBy] ?? '');
      if (A === B) return 0;
      return sortDir === 'asc' ? (A > B ? 1 : -1) : A > B ? -1 : 1;
    });
    return copy;
  }, [filtered, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.min(Math.max(1, currentPage), totalPages);
  const pageStart = (page - 1) * pageSize;
  const pageSlice = sorted.slice(pageStart, pageStart + pageSize);

  const toggleSort = (col: string) => {
    if (sortBy !== col) {
      setSortBy(col);
      setSortDir('asc');
    } else setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  };

  const handleCellChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (rowId: string, col: string, value: any) => {
      setRows((prevRows) =>
        prevRows.map((r) => (r._id === rowId ? { ...r, [col]: value } : r)),
      );
    },
    [setRows],
  );

  // Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: pageSlice.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center gap-3 border-b">
        <div className="text-sm text-slate-500">
          {sorted.length} rows — page {page} / {totalPages}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setCurrentPage(page - 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setCurrentPage(page + 1)}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex bg-slate-100 border-b">
        {columns.map((col) => (
          <div
            key={col}
            style={{
              flex: col === '_id' ? '0 0 120px' : 1,
              minWidth: col === '_id' ? 120 : 150,
            }}
            className="p-2 font-medium cursor-pointer"
            onClick={() => toggleSort(col)}
          >
            {col} {sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </div>
        ))}
      </div>

      {/* Virtualized list */}
      <div ref={parentRef} className="h-[600px] overflow-auto">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = pageSlice[virtualRow.index];
            if (!row) return null;
            const original = originalRows.find((r) => r._id === row._id);
            const rowChanged = original
              ? columns.some((c) => String(original[c] ?? '') !== String(row[c] ?? ''))
              : false;

            return (
              <div
                key={row._id}
                style={{
                  position: 'absolute',
                  top: virtualRow.start,
                  left: 0,
                  width: '100%',
                }}
                className={clsx(
                  'flex items-stretch border-b',
                  rowChanged
                    ? 'bg-yellow-50'
                    : virtualRow.index % 2
                      ? 'bg-white'
                      : 'bg-slate-50',
                )}
              >
                {columns.map((col) => {
                  const val = row[col];
                  const origVal = original ? original[col] : undefined;
                  const changed =
                    origVal !== undefined && String(origVal) !== String(val);
                  return (
                    <div
                      key={col}
                      style={{
                        flex: col === '_id' ? '0 0 120px' : 1,
                        minWidth: col === '_id' ? 120 : 150,
                      }}
                      className="p-2"
                    >
                      {col === '_id' ? (
                        <div className="text-xs text-slate-600">{val}</div>
                      ) : (
                        <EditCell
                          value={val}
                          onChange={(v) => handleCellChange(row._id, col, v)}
                          highlight={changed}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
