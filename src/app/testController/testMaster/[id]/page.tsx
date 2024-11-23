'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getTestMasterDetail } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader';
import { PageTitle } from '@/constants';

const TestMasterDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.TestMasterDetails);
  }, [updateTitle, PageTitle]);
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['testMasterDetail', id],
    queryFn: () => getTestMasterDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const testMasterData = data?.data;

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
      value: testMasterData?.testNameFld || 'N/A',
    },
    {
      label: 'Test ID',
      value: testMasterData?.testIDFld || 'N/A',
    },
    {
      label: 'Aliase',
      value: testMasterData?.testAliaseFld || 'N/A',
    },
    {
      label: 'Description',
      value: testMasterData?.descriptionFld || 'N/A',
    },
    {
      label: 'Test Parameter',
      value: testMasterData?.testParameterNameFld || 'N/A',
    },
    {
      label: 'Active',
      value: testMasterData?.isActiveFld || 'N/A',
    },
    {
      label: 'Test Category',
      value: testMasterData?.testCategoryFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default TestMasterDetailPage;
