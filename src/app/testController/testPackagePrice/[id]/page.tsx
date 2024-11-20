'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getTestPackagePriceDetail } from '@/api';

const TestPackagePriceDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['testPackagePriceDetail', id],
    queryFn: () => getTestPackagePriceDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const testPackagePriceData = data?.data;

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
      value: testPackagePriceData?.testPackageNameFld || 'N/A',
    },
    {
      label: 'Active',
      value: testPackagePriceData?.isActiveFld || 'N/A',
    },
    {
      label: 'Price',
      value: testPackagePriceData?.priceFld || 'N/A',
    },
    {
      label: 'Discount',
      value: testPackagePriceData?.discountFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          Test Package Price Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default TestPackagePriceDetailPage;
