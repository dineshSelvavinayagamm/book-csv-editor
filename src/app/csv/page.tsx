'use client';
import React, { useEffect, useState } from 'react';
import EnhancedToolbar from '@/components/EnhancedToolBar/EnhancedToolBar';
import CSVUploader from '@/components/CSVUploader/CSVUploader';
import { useAppHeader } from '../hooks/appHeader';
import VirtualizedDataGrid, {
  RowObj,
} from '@/components/VirtualizedDataGrid/VirtualizedDataGrid';
import { PageTitle } from '@/constants';

export default function CsvMainPage() {
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.CSVEditor);
  }, [updateTitle]);
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<RowObj[]>([]);
  const [originalRows, setOriginalRows] = useState<RowObj[]>([]);

  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('');

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50 min-h-screen">
      <h1 className="text-xl font-bold text-indigo-600 drop-shadow-sm">
        📑 CSV Editor Assignment
        <p className="text-gray-600 mt-1 text-sm">
          Upload, edit, and manage your CSV data with ease.
        </p>
      </h1>

      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
        <EnhancedToolbar
          columns={columns}
          rows={rows}
          originalRows={originalRows}
          setRows={setRows}
          pageSize={pageSize}
          setPageSize={(n: number) => {
            setPageSize(n);
            setCurrentPage(1);
          }}
          filter={filter}
          setFilter={setFilter}
        />
      </div>

      {/* CSV File Upload */}
      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <CSVUploader
          onData={(parsedColumns: string[], parsedRows: RowObj[]) => {
            setColumns(parsedColumns);
            setRows(parsedRows);
            setOriginalRows(parsedRows.map((r) => ({ ...r })));
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Virtualized Table */}
      {rows.length > 0 && columns.length > 0 ? (
        <VirtualizedDataGrid
          columns={columns}
          rows={rows}
          setRows={setRows}
          originalRows={originalRows}
          pageSize={pageSize}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          filter={filter}
        />
      ) : (
        <div className="text-center text-gray-500 py-20 italic">
          🌟 Upload a CSV file (even 10k+ rows supported) to start editing.
        </div>
      )}
    </div>
  );
}
