/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { exportToCSV } from '@/lib/csv';
import { saveAs } from 'file-saver';
import { Download, RotateCcw, Filter } from 'lucide-react'; // Assuming lucide-react for icons

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
    <div className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-md p-4 border border-indigo-100">
      <button
        onClick={handleDownload}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-sm"
      >
        <Download size={16} />
        Download CSV
      </button>

      <button
        onClick={handleReset}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 shadow-sm"
      >
        <RotateCcw size={16} />
        Reset All Edits
      </button>

      <div className="ml-auto flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700">Rows per page:</label>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border border-indigo-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-indigo-500 transition-all duration-200 bg-white"
        >
          {[25, 50, 100, 250].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      <div className="relative w-full md:w-72">
        <Filter
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by Title, Author, Genre..."
          className="pl-10 pr-4 py-2 border border-indigo-300 rounded-lg w-full focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white"
        />
      </div>
    </div>
  );
}
