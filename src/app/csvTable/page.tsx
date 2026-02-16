'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react';
import { Button } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { PageTitle } from '@/constants';
import { useAppHeader } from '../hooks/appHeader';
import CustomerAdd from '../../components/CustomerAdd';
import CustomerView from '../../components/CustomerView';

const CsvTable = () => {
  const { updateTitle } = useAppHeader();
  useEffect(() => {
    updateTitle(PageTitle.CSVTable);
  }, [updateTitle]);
  const columns = [
    {
      header: 'File Name',
      accessor: 'fileName',
    },
    {
      header: 'Rows Count',
      accessor: 'rowsCount',
    },
    {
      header: 'Uploaded By',
      accessor: 'uploadedBy',
    },
    {
      header: 'Upload Date',
      accessor: 'uploadDate',
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row: any) => (
        <span
          className={
            row.status === 'Completed'
              ? 'text-green-600 font-medium'
              : 'text-yellow-600 font-medium'
          }
        >
          {row.status}
        </span>
      ),
    },
    {
      header: 'Action',
      accessor: 'action',
      render: (row: any) => (
        <Button
          size="1"
          variant="soft"
          onClick={() => {
            console.log('View CSV:', row.id);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      fileName: 'patients_list.csv',
      rowsCount: 120,
      uploadedBy: 'Admin',
      uploadDate: '01-02-2026',
      status: 'Completed',
    },
    {
      id: 2,
      fileName: 'lab_results.csv',
      rowsCount: 85,
      uploadedBy: 'Dinesh',
      uploadDate: '30-01-2026',
      status: 'Processing',
    },
    {
      id: 3,
      fileName: 'billing_data.csv',
      rowsCount: 45,
      uploadedBy: 'System',
      uploadDate: '29-01-2026',
      status: 'Completed',
    },
  ];

  return (
    <div>
      <AppTable
        columns={columns}
        data={data}
        isCreateEnabled
        onCreate={() => {
          console.log('Create new CSV');
        }}
      />
    </div>
  );
};

export default CsvTable;
