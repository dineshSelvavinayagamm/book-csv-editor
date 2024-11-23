'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getTestPackagePriceDetail } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader';
import { PageTitle } from '@/constants';

const TestPackagePriceDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.TestPackagePriceDetails);
  }, [updateTitle, PageTitle]);

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
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default TestPackagePriceDetailPage;
