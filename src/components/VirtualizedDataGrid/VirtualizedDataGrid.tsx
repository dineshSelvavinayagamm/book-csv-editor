/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useMemo, useState, useCallback, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import clsx from 'clsx';
import { Pencil } from 'lucide-react';
import EditCell from '../EditCell/EditCell';

export interface RowObj {
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
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);

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
  const pageSlice = sorted.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (col: string) => {
    if (sortBy !== col) {
      setSortBy(col);
      setSortDir('asc');
    } else setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
  };

  const handleCellChange = useCallback(
    (rowIndex: number, col: string, value: any) => {
      setRows((prevRows) =>
        prevRows.map((r, idx) => (idx === rowIndex ? { ...r, [col]: value } : r)),
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

  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];
    const ellipsis = '...';

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    const adjustedStartPage =
      endPage === totalPages ? Math.max(1, totalPages - maxPagesToShow + 1) : startPage;

    if (adjustedStartPage > 1) {
      pages.push(1);
      if (adjustedStartPage > 2) pages.push(ellipsis);
    }

    for (let i = adjustedStartPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push(ellipsis);
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-3 flex items-center gap-3 border-b bg-indigo-600 text-white text-sm font-medium">
        {sorted.length} rows — page {page} / {totalPages}
        <div className="ml-auto flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setCurrentPage(page - 1)}
            className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-40 transition"
          >
            Prev
          </button>
          <button
            disabled={page >= totalPages}
            onClick={() => setCurrentPage(page + 1)}
            className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 disabled:opacity-40 transition"
          >
            Next
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div className="flex bg-slate-100 border-b">
        <div style={{ flex: '0 0 60px' }} className="p-2 font-semibold text-slate-700">
          SI.No
        </div>
        {columns.map((col) => (
          <div
            key={col}
            style={{ flex: 1, minWidth: 150 }}
            className="p-2 font-semibold text-slate-700 hover:text-indigo-600 cursor-pointer transition"
            onClick={() => toggleSort(col)}
          >
            {col} {sortBy === col ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </div>
        ))}
        <div style={{ flex: '0 0 60px' }} className="p-2 font-semibold text-slate-700">
          Edit
        </div>
      </div>

      <div ref={parentRef} className="h-[600px] overflow-auto">
        <div
          style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = pageSlice[virtualRow.index];
            if (!row) return null;
            const rowIndex = (page - 1) * pageSize + virtualRow.index;
            const original = originalRows[rowIndex];
            const rowChanged = original
              ? columns.some((c) => String(original[c] ?? '') !== String(row[c] ?? ''))
              : false;

            const isEditing = editingRowIndex === rowIndex;

            return (
              <div
                key={rowIndex}
                style={{ top: virtualRow.start, position: 'absolute', width: '100%' }}
                className={clsx(
                  'flex items-stretch border-b',
                  rowChanged
                    ? 'bg-yellow-100'
                    : virtualRow.index % 2
                      ? 'bg-white hover:bg-indigo-200'
                      : 'bg-slate-50 hover:bg-indigo-200',
                )}
              >
                <div
                  style={{ flex: '0 0 60px' }}
                  className="p-2 text-sm font-medium text-slate-600"
                >
                  {rowIndex + 1}
                </div>

                {columns.map((col) => (
                  <div
                    key={col}
                    style={{ flex: 1, minWidth: 150 }}
                    className="p-2 text-sm"
                  >
                    <EditCell
                      value={row[col]}
                      onChange={(v) => handleCellChange(rowIndex, col, v)}
                      highlight={isEditing}
                      editable={isEditing}
                    />
                  </div>
                ))}

                {/* Edit Icon */}
                <div
                  style={{ flex: '0 0 60px' }}
                  className="flex items-center justify-center"
                >
                  <button
                    onClick={() => setEditingRowIndex(isEditing ? null : rowIndex)}
                    className="p-1 rounded hover:bg-indigo-100 text-indigo-600"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="p-3 flex items-center justify-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 border-t">
        {getPageNumbers().map((pageNum, index) => (
          <button
            key={index}
            onClick={() => typeof pageNum === 'number' && setCurrentPage(pageNum)}
            disabled={pageNum === '...' || pageNum === page}
            className={clsx(
              'px-3 py-1 rounded-lg text-sm font-medium transition',
              pageNum === page
                ? 'bg-indigo-500 text-white'
                : pageNum === '...'
                  ? 'text-slate-500 cursor-default'
                  : 'bg-white text-slate-700 hover:bg-indigo-100',
            )}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
}
