'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { getMasterEnterpriseDetail } from '@/api/Masters';
import { AppTable } from '@/components/Table';

const EnterpriseDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);

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

  const enterpriseData = data?.data;

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

  const tableData = [
    {
      label: 'Enterprise Name',
      value: enterpriseData?.enterpriseNameFld || 'N/A',
    },
    {
      label: 'Enterprise ID',
      value: enterpriseData?.enterpriseIDFld || 'N/A',
    },
    {
      label: 'Remarks',
      value: enterpriseData?.remarksFld || 'N/A',
    },
  ];

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
