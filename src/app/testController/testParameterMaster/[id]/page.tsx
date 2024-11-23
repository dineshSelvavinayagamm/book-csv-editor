'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getTestParameterMasterDetail } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import { PageTitle } from '@/constants';

const TestParameterMasterDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.TestParameterMasterDetails);
  }, [updateTitle, PageTitle]);
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
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default TestParameterMasterDetailPage;
