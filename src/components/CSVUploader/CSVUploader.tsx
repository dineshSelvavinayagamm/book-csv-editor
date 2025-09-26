/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useRef, useState, Dispatch, SetStateAction } from 'react';
import { parseCSVFile } from '@/lib/csv';
import { Upload } from 'lucide-react';
import clsx from 'clsx';

interface RowObj {
  [key: string]: any;
}

interface CSVUploaderProps {
  onData: (cols: string[], rows: RowObj[]) => void;
  onClear: () => void;
  isFileUploaded: boolean;
  setIsFileUploaded: Dispatch<SetStateAction<boolean>>;
}

export default function CSVUploader({
  onData,
  onClear,
  isFileUploaded,
  setIsFileUploaded,
}: CSVUploaderProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [parsedRowsCount, setParsedRowsCount] = useState(0);
  const [fileName, setFileName] = useState<string>('');
  const [inputKey, setInputKey] = useState(0);

  async function handleFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    setParsedRowsCount(0);

    try {
      const { columns, rows } = await parseCSVFile(file, (chunk) => {
        setParsedRowsCount((prev) => prev + chunk.length);
      });

      onData(
        columns.filter((col) => col !== '_id'),
        rows.map((row) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { _id, ...rest } = row;
          return rest;
        }),
      );
      setIsFileUploaded(true);
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
      fileRef.current.value = '';
    }
    setInputKey((prev) => prev + 1);
    setIsFileUploaded(false);
    onClear();
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 flex flex-col gap-4 border border-gray-200">
      <label className="block text-lg font-semibold text-gray-800">
        Upload Your CSV File
      </label>

      <div className="flex items-center gap-4">
        <button
          type="button"
          className={clsx(
            'px-6 py-3 bg-indigo-600 text-white rounded-lg flex items-center gap-2 shadow-md transition-all duration-300',
            isFileUploaded || loading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-indigo-700',
          )}
          onClick={() => fileRef.current?.click()}
          disabled={isFileUploaded || loading}
        >
          <Upload size={18} />
          Choose File
        </button>

        <span className="text-sm text-gray-700 font-medium">
          {fileName || 'No file selected'}
        </span>

        {fileName && (
          <button
            type="button"
            className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 shadow-md"
            onClick={clearFile}
          >
            Clear
          </button>
        )}
      </div>

      <input
        key={inputKey}
        ref={fileRef}
        type="file"
        accept=".csv,.txt,text/csv,text/plain"
        onChange={(e) => handleFile(e.target.files?.[0])}
        className="hidden"
        disabled={isFileUploaded || loading}
      />

      <div className="flex-1">
        {loading && (
          <>
            <div className="text-sm text-indigo-600 font-medium">
              Parsing... rows parsed: {parsedRowsCount}
            </div>
            <div className="w-full bg-gray-200 h-3 rounded-full mt-2 overflow-hidden">
              <div
                style={{
                  width: Math.min(100, Math.round((parsedRowsCount / 10000) * 100)) + '%',
                }}
                className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
              />
            </div>
          </>
        )}

        {!loading && (
          <div className="text-sm text-gray-600 italic">
            {isFileUploaded
              ? 'File uploaded. Clear to upload a new file.'
              : 'Streaming parse enabled. Supports large CSVs up to 10k+ rows.'}
          </div>
        )}
      </div>
    </div>
  );
}
