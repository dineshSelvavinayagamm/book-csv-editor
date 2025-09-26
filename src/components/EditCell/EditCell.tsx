/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useEffect } from 'react';

interface EditCellProps {
  value: any;
  onChange: (v: any) => void;
  highlight?: boolean;
  editable?: boolean;
}

export default function EditCell({
  value,
  onChange,
  highlight,
  editable,
}: EditCellProps) {
  const [val, setVal] = useState(value ?? '');

  useEffect(() => {
    setVal(value ?? '');
  }, [value]);

  return editable ? (
    <input
      value={val}
      onChange={(e) => setVal(e.target.value)}
      onBlur={() => onChange(val)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      className={`w-full border border-indigo-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-indigo-500 ${
        highlight ? 'bg-yellow-50' : ''
      }`}
      autoFocus
    />
  ) : (
    <span
      className={`block text-sm truncate ${
        highlight ? 'bg-yellow-100 rounded px-1' : ''
      }`}
    >
      {String(val ?? '')}
    </span>
  );
}
