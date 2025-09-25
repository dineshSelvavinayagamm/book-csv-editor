/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';
import EditCell from '../EditCell/EditCell';

export interface RowObj {
  _id: string;
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
  const [editingRowId, setEditingRowId] = useState<string | null>(null);

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
    (rowId: string, col: string, value: any) => {
      setRows((prevRows) =>
        prevRows.map((r) => (r._id === rowId ? { ...r, [col]: value } : r)),
      );
    },
    [setRows],
  );

  const rowVirtualizer = useVirtualizer({
    count: pageSlice.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
  });

  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center gap-3 border-b bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <div className="text-sm font-medium">
          {sorted.length} rows — page {page} / {totalPages}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setCurrentPage(page - 1)}
            className="px-3 py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 disabled:opacity-40 transition"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setCurrentPage(page + 1)}
            className="px-3 py-1 rounded-lg bg-white/20 text-white hover:bg-white/30 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex bg-gradient-to-r from-slate-100 to-slate-200 border-b">
        {columns.map((col) => (
          <div
            key={col}
            style={{
              flex: col === '_id' ? '0 0 120px' : 1,
              minWidth: col === '_id' ? 120 : 150,
            }}
            className="p-2 font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer transition"
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

            const isEditing = editingRowId === row._id;

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
                  'flex items-stretch border-b transition-colors duration-200',
                  rowChanged
                    ? 'bg-yellow-100'
                    : virtualRow.index % 2
                      ? 'bg-white hover:bg-indigo-50'
                      : 'bg-slate-50 hover:bg-indigo-50',
                )}
              >
                {isEditing ? (
                  // 🔹 MERGED ROW IN EDIT MODE
                  <div className="p-4 w-full bg-indigo-50">
                    <div className="flex flex-col gap-3">
                      {columns.map((col) =>
                        col === '_id' ? (
                          <div key={col} className="text-xs font-medium text-slate-600">
                            ID: {row[col]}
                          </div>
                        ) : (
                          <div key={col} className="flex gap-2 items-center">
                            <span className="w-32 text-sm font-medium text-slate-700">
                              {col}:
                            </span>
                            <EditCell
                              value={row[col]}
                              onChange={(v) => handleCellChange(row._id, col, v)}
                              highlight
                              onFocus={() => setEditingRowId(row._id)}
                              onBlur={() => setEditingRowId(null)}
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                ) : (
                  // 🔹 NORMAL ROW
                  columns.map((col) => {
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
                        className="p-2 text-sm"
                      >
                        {col === '_id' ? (
                          <div className="text-xs font-medium text-slate-600">{val}</div>
                        ) : (
                          <EditCell
                            value={val}
                            onChange={(v) => handleCellChange(row._id, col, v)}
                            highlight={changed}
                            onFocus={() => setEditingRowId(row._id)}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
