'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { getMasterEnterpriseDetail } from '@/api/Masters';
import { AppTable } from '@/components/Table';

const EnterpriseDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['enterpriseDetail', id],
    queryFn: () => getMasterEnterpriseDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const enterpriseData = data;

  const columns = [
    {
      accessor: 'label',
      header: 'Detail',
    },
    {
      accessor: 'value',
      header: 'Information',
    },
  ];

  const tableData = enterpriseData
    ? Object.entries(enterpriseData).map(([key, value]) => ({
        label: key,
        value:
          typeof value === 'object' && value !== null
            ? JSON.stringify(value)
            : String(value ?? 'N/A'),
      }))
    : [];

  return (
    <div className="p-4">
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          Enterprise Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default EnterpriseDetailPage;
