'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getTestPackageDetail } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader';
import { PageTitle } from '@/constants';

const TestPackageDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.TestPackageDetails);
  }, [updateTitle, PageTitle]);
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
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default TestPackageDetailPage;
