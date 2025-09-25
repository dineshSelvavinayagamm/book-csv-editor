/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { exportToCSV } from '@/lib/csv';
import { saveAs } from 'file-saver';

interface EnhancedToolbarProps {
  columns: string[] | null;
  rows: any[] | null;
  originalRows: any[] | null;
  setRows: (rows: any[]) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  filter: string;
  setFilter: (v: string) => void;
}

export default function EnhancedToolbar({
  columns,
  rows,
  originalRows,
  setRows,
  pageSize,
  setPageSize,
  filter,
  setFilter,
}: EnhancedToolbarProps) {
  function handleDownload() {
    if (!rows || !columns) return alert('No data to download');
    const blob = exportToCSV(columns, rows);
    saveAs(blob, `books-edited-${Date.now()}.csv`);
  }

  function handleReset() {
    if (!originalRows) return alert('No original data to reset to');
    // reset rows to original
    setRows(originalRows.map((r) => ({ ...r })));
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleDownload}
        className="px-3 py-1 bg-slate-700 text-white rounded"
      >
        Download CSV
      </button>

      <button onClick={handleReset} className="px-3 py-1 border rounded">
        Reset All Edits
      </button>

      <div className="ml-auto flex items-center gap-2">
        <label className="text-sm">Page size:</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border px-2 py-1 rounded text-sm"
        >
          {[25, 50, 100, 250].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-auto ml-2">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter (Title, Author, Genre)"
          className="border p-2 rounded w-full md:w-64"
        />
      </div>
    </div>
  );
}
