'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { getLabTestMasterDetail } from '@/api/Masters';
import { AppTable } from '@/components/Table';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import { PageTitle } from '@/constants/PageTitle';

const LabTestMasterDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.UserHealthParamDetails);
  }, [updateTitle]);
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
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default LabTestMasterDetailPage;
