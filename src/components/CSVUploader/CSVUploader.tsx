'use client';
import React, { useRef, useState } from 'react';
import { parseCSVFile } from '@/lib/csv';

interface CSVUploaderProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onData: (cols: string[], rows: any[]) => void;
}

export default function CSVUploader({ onData }: CSVUploaderProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedRowsCount, setParsedRowsCount] = useState(0);
  const [fileName, setFileName] = useState<string>('');

  async function handleFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setParsedRowsCount(0);

    try {
      const { columns, rows } = await parseCSVFile(file, (chunk) => {
        setParsedRowsCount((prev) => prev + chunk.length);
      });
      onData(columns, rows);
    } catch (err) {
      console.error('parse error', err);
      alert('Error parsing CSV: ' + String(err));
    } finally {
      setLoading(false);
    }
  }

  function clearFile() {
    setFileName('');
    setParsedRowsCount(0);
    if (fileRef.current) {
      fileRef.current.value = ''; // reset the file input
    }
  }

  return (
    <div className="bg-white rounded shadow p-4 flex flex-col gap-4">
      <label className="block text-sm font-medium text-slate-700">Upload CSV</label>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => fileRef.current?.click()}
        >
          Choose File
        </button>

        <span className="text-sm text-slate-600">{fileName || 'No file selected'}</span>

        {fileName && (
          <button
            type="button"
            className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            onClick={clearFile}
          >
            Clear
          </button>
        )}
      </div>

      {/* hidden native file input */}
      <input
        ref={fileRef}
        type="file"
        accept=".csv,.txt,text/csv,text/plain"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
      />

      <div className="flex-1">
        {loading && (
          <>
            <div className="text-sm">Parsing... rows parsed: {parsedRowsCount}</div>
            <div className="w-full bg-slate-200 h-2 rounded mt-2">
              <div
                style={{
                  width: Math.min(100, Math.round((parsedRowsCount / 10000) * 100)) + '%',
                }}
                className="h-2 rounded bg-slate-600"
              />
            </div>
          </>
        )}

        {!loading && (
          <div className="text-sm text-slate-500">
            Streaming parse enabled. Supports large CSVs.
          </div>
        )}
      </div>
    </div>
  );
}
