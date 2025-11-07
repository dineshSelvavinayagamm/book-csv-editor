'use client';

import React from 'react';
import { Filter as FilterIcon } from 'lucide-react';

interface EnhancedToolbarFilterProps {
  filter: string;
  setFilter: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const EnhancedToolbarFilter: React.FC<EnhancedToolbarFilterProps> = ({
  filter,
  setFilter,
  placeholder = 'Filter by Title, Author, Genre...',
  disabled = false,
}) => {
  return (
    <div className="relative w-full md:w-72">
      <FilterIcon
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />

      <input
        value={filter}
        disabled={disabled}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilter(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-4 py-2 border border-indigo-300 rounded-lg w-full focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 bg-white disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>
  );
};

export default EnhancedToolbarFilter;
