'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getTestParameterMasterDetail } from '@/api';

const TestParameterMasterDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['testParameterMasterDetail', id],
    queryFn: () => getTestParameterMasterDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const testParameterMasterData = data?.data;

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
      label: 'Test Parameter Name',
      value: testParameterMasterData?.testParameterNameFld || 'N/A',
    },
    {
      label: 'Test Parameter ID',
      value: testParameterMasterData?.testParameterIDFld || 'N/A',
    },
    {
      label: 'Parameter Aliase',
      value: testParameterMasterData?.parameterAliaseFld || 'N/A',
    },
    {
      label: 'Description',
      value: testParameterMasterData?.descriptionFld || 'N/A',
    },
    {
      label: 'Active',
      value: testParameterMasterData?.isActiveFld || 'N/A',
    },
    {
      label: 'Remarks',
      value: testParameterMasterData?.custom1Fld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          Test Parameter Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default TestParameterMasterDetailPage;
