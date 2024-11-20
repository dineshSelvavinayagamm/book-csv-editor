'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getTestPriceDetail } from '@/api';

const TestPriceDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['testPriceDetail', id],
    queryFn: () => getTestPriceDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const testPriceData = data?.data;

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
      value: testPriceData?.testNameFld || 'N/A',
    },
    {
      label: 'Active',
      value: testPriceData?.isActiveFld || 'N/A',
    },
    {
      label: 'Price',
      value: testPriceData?.priceFld || 'N/A',
    },
    {
      label: 'Discount',
      value: testPriceData?.discountFld || 'N/A',
    },
    {
      label: 'Description',
      value: testPriceData?.descriptionFld || 'N/A',
    },
    {
      label: 'Test ID',
      value: testPriceData?.testIDFld || 'N/A',
    },
    {
      label: 'Test Aliase',
      value: testPriceData?.testAliaseFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          Test Price Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default TestPriceDetailPage;
