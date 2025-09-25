'use client';
import React, { useState } from 'react';
import EnhancedToolbar from '@/components/EnhancedToolBar/EnhancedToolBar';
import CSVUploader from '@/components/CSVUploader/CSVUploader';
import VirtualizedDataGrid, {
  RowObj,
} from '@/components/VirtualizedDataGrid/VirtualizedDataGrid';

export default function CsvMainPage() {
  // Columns and rows cannot be null; initialize as empty arrays
  const [columns, setColumns] = useState<string[]>([]);
  const [rows, setRows] = useState<RowObj[]>([]);
  const [originalRows, setOriginalRows] = useState<RowObj[]>([]);

  // Pagination & filtering
  const [pageSize, setPageSize] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filter, setFilter] = useState<string>('');

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold">CSV Editor Assignment</h1>

      {/* Toolbar: filtering, pageSize */}
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

      {/* CSV File Upload */}
      <CSVUploader
        onData={(parsedColumns: string[], parsedRows: RowObj[]) => {
          setColumns(parsedColumns);
          setRows(parsedRows);
          setOriginalRows(parsedRows.map((r) => ({ ...r })));
          setCurrentPage(1);
        }}
      />

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
        <div className="text-center text-gray-500 py-20">
          Upload a CSV file (even 10k+ rows supported) to start editing.
        </div>
      )}
    </div>
  );
}
