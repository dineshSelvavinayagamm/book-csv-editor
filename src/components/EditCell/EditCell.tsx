'use client';

import React, { useState, useEffect } from 'react';

interface EditCellProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChange: (v: any) => void;
  highlight?: boolean;
}

export default function EditCell({ value, onChange, highlight }: EditCellProps) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(value ?? '');

  useEffect(() => {
    setVal(value ?? '');
  }, [value]);

  return (
    <div className={`${highlight ? 'bg-yellow-50' : ''} p-1`}>
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
          className="w-full border rounded px-2 py-1 text-sm"
          autoFocus
        />
      ) : (
        <div className="text-sm truncate" onDoubleClick={() => setEditing(true)}>
          {String(val ?? '')}
        </div>
      )}
    </div>
  );
}
