'use client';

import React, { useState, useEffect } from 'react';

interface EditCellProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void;
  highlight?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export default function EditCell({ value, onChange, highlight }: EditCellProps) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? '');

  useEffect(() => {
    setVal(value ?? '');
  }, [value]);

  return (
    <div
      className={`${highlight ? 'bg-yellow-100 rounded-md' : ''} p-2 transition-all duration-200`}
    >
      {editing ? (
        <input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onBlur={() => {
            setEditing(false);
            onChange(val);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          className="w-full border border-indigo-300 rounded-lg px-3  text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
          autoFocus
        />
      ) : (
        <div
          className="text-sm truncate cursor-pointer hover:text-indigo-600 transition-colors duration-200"
          onDoubleClick={() => setEditing(true)}
        >
          {String(val ?? '')}
        </div>
      )}
    </div>
  );
}
