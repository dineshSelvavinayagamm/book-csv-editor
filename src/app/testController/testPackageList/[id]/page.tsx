'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getTestPackageListDetail } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import { PageTitle } from '@/constants';

const TestPackageListPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.TestPackageListDetails);
  }, [updateTitle, PageTitle]);
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['testPackageListDetail', id],
    queryFn: () => getTestPackageListDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const testPackageListData = data?.data;

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
      value: testPackageListData?.testPackageNameFld || 'N/A',
    },
    {
      label: 'Test Name',
      value: testPackageListData?.labTestFKFld || 'N/A',
    },
    {
      label: 'Active',
      value: testPackageListData?.isActiveFld || 'N/A',
    },
    {
      label: 'Aliase',
      value: testPackageListData?.parameterAliaseFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default TestPackageListPage;
