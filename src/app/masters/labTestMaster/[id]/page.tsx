'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { getLabTestMasterDetail } from '@/api/Masters';
import { AppTable } from '@/components/Table';

const LabTestMasterDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['labTestMasterDetail', id],
    queryFn: () => getLabTestMasterDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const labTestMasterData = data?.data;

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
      label: 'Test Name',
      value: labTestMasterData?.labTestFKFld || 'N/A',
    },
    {
      label: 'Lab Name',
      value: labTestMasterData?.labTestFKFld || 'N/A',
    },
    {
      label: 'Active',
      value: labTestMasterData?.isActiveFld || 'N/A',
    },
    {
      label: 'Custom',
      value: labTestMasterData?.custom1Fld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          LabTest Master Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default LabTestMasterDetailPage;
