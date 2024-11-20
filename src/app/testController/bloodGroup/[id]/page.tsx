'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getBloodGroupDetail } from '@/api';

const BloodGroupDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['bloodGroupDetail', id],
    queryFn: () => getBloodGroupDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const bloodGroupData = data?.data;

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
      label: 'Short Name',
      value: bloodGroupData?.shortNameFld || 'N/A',
    },
    {
      label: 'Long Name',
      value: bloodGroupData?.longName_Fld || 'N/A',
    },
    {
      label: 'Alias',
      value: bloodGroupData?.aliasFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          Blood Group Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default BloodGroupDetailPage;
