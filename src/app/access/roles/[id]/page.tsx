'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getRolesDetail } from '@/api/User';

const RolesDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['rolesDetail', id],
    queryFn: () => getRolesDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const rolesData = data?.data;

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
      value: rolesData?.nameFld || 'N/A',
    },
    {
      label: 'Description',
      value: rolesData?.descriptionFld || 'N/A',
    },
    {
      label: 'System Defined',
      value: rolesData?.isSystemDefinedFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          Roles Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default RolesDetailPage;
