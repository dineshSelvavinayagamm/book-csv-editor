/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import { exportToCSV } from '@/lib/csv';
import { saveAs } from 'file-saver';
import { Download, RotateCcw, Filter } from 'lucide-react';

interface RowObj {
  [key: string]: any;
}

interface EnhancedToolbarProps {
  columns: string[] | null;
  rows: RowObj[] | null;
  originalRows: RowObj[] | null;
  setRows: (rows: RowObj[]) => void;
  pageSize: number;
  setPageSize: (n: number) => void;
  filter: string;
  setFilter: (v: string) => void;
  isFileUploaded: boolean;
  setIsFileUploaded: (value: boolean) => void;
  uploadedFileName?: string | null;
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
  isFileUploaded,
  setIsFileUploaded,
  uploadedFileName,
}: EnhancedToolbarProps) {
  function handleDownload() {
    if (!rows || !columns) return alert('No data to download');

    const exportColumns = columns.filter((col) => col !== '_id');
    const exportRows = rows.map((row) => {
      const rest = { ...row };
      delete rest._id;
      return rest;
    });

    const blob = exportToCSV(exportColumns, exportRows);

    const baseName = uploadedFileName
      ? uploadedFileName.replace(/\.[^/.]+$/, '')
      : `CSV-downloaded-${Date.now()}`;

    const fileName = `${baseName}_processed.csv`;

    saveAs(blob, fileName);
  }

  function handleReset() {
    if (!originalRows) return alert('No original data to reset to');
    setRows(originalRows.map((r) => ({ ...r })));
    setIsFileUploaded(false);
  }

  return (
    <div className="flex flex-wrap items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl shadow-md p-4 border border-indigo-100">
      <button
        onClick={handleDownload}
        disabled={!isFileUploaded}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={16} />
        Download CSV
      </button>

      <button
        onClick={handleReset}
        disabled={!isFileUploaded}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
