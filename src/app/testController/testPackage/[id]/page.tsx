'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getTestPackageDetail } from '@/api';

const TestPackageDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['testPackageDetail', id],
    queryFn: () => getTestPackageDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const testPackageData = data?.data;

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
      label: 'Test Package Name',
      value: testPackageData?.testPackageNameFld || 'N/A',
    },
    {
      label: 'Test Package ID',
      value: testPackageData?.testPackageIDFld || 'N/A',
    },
    {
      label: 'Aliase',
      value: testPackageData?.parameterAliaseFld || 'N/A',
    },
    {
      label: 'Description',
      value: testPackageData?.descriptionFld || 'N/A',
    },
    {
      label: 'Active',
      value: testPackageData?.isActiveFld || 'N/A',
    },
    {
      label: 'Test ID',
      value: testPackageData?.testIDFld || 'N/A',
    },
    {
      label: 'Test Aliase',
      value: testPackageData?.testAliaseFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          Test Package Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default TestPackageDetailPage;
