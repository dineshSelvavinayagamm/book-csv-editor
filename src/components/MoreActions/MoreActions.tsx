'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EyeOpenIcon, TrashIcon } from '@radix-ui/react-icons';

interface MoreActionsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: any;
  detailPath: string;
  idField: string;
  onDelete?: (id: string | number) => void;
  showView?: boolean; // Optional boolean prop to show/hide the Eye icon
}

const MoreActions: React.FC<MoreActionsProps> = ({ row, detailPath, idField, onDelete, showView = true }) => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleViewClick = () => {
    const id = row[idField];
    console.log('Row data:', row);
    if (id) {
      console.log(`Viewing details for ID: ${id}`);
      router.push(`${detailPath}/${id}`);
    } else {
      console.error('ID is undefined or null');
    }
  };

  const handleDeleteClick = () => {
    const id = row[idField];
    if (id && onDelete) {
      console.log(`Deleting row with ID: ${id}`);
      onDelete(id);
    } else {
      console.error('ID is undefined or null, or delete action is not provided');
    }
  };

  if (!isMounted || !router) return null;

  return (
    <div className="flex space-x-2">
      {showView && (
        <button onClick={handleViewClick} title="View Details">
          <EyeOpenIcon className="w-5 h-5 text-black-200 hover:text-black-700" />
        </button>
      )}
      {onDelete && (
        <button onClick={handleDeleteClick} title="Delete">
          <TrashIcon className="w-5 h-5 text-red-500 hover:text-red-700" />
        </button>
      )}
    </div>
  );
};

export default MoreActions;
