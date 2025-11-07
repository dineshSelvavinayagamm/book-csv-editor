'use client';

import React from 'react';
import { Select, Text } from '@radix-ui/themes';

interface EnhancedToolBarPaginationProps {
  pageSize: number;
  setPageSize: (n: number) => void;
  options?: number[];
  label?: string;
  disabled?: boolean;
}

const EnhancedToolBarPagination: React.FC<EnhancedToolBarPaginationProps> = ({
  pageSize,
  setPageSize,
  options = [25, 50, 100, 250],
  label = 'Rows per page:',
  disabled = false,
}) => {
  return (
    <div className="ml-auto flex items-center gap-3">
      <Text
        size="2"
        weight="medium"
        color="gray"
        className="text-sm font-medium text-gray-700"
      >
        {label}
      </Text>

      <Select.Root
        disabled={disabled}
        value={String(pageSize)}
        onValueChange={(value) => setPageSize(Number(value))}
      >
        <Select.Trigger
          className={`border border-indigo-300 rounded-lg px-3 py-2 text-sm bg-white
            focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200
            transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`}
        />
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option} value={String(option)}>
              {option}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  );
};

export default EnhancedToolBarPagination;
