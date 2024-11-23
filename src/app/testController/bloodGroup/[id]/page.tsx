'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getBloodGroupDetail } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import { PageTitle } from '@/constants';

const BloodGroupDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.BloodGroupDetails);
  }, [updateTitle, PageTitle]);
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['bloodGroupDetail', id],
    queryFn: () => getBloodGroupDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const bloodGroupData = data?.data;

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
      label: 'Short Name',
      value: bloodGroupData?.shortNameFld || 'N/A',
    },
    {
      label: 'Long Name',
      value: bloodGroupData?.longName_Fld || 'N/A',
    },
    {
      label: 'Alias',
      value: bloodGroupData?.aliasFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default BloodGroupDetailPage;
