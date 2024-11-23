'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getPrivilegeDetail } from '@/api/User';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import { PageTitle } from '@/constants';

const PrivilegeDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.SecurityPrivilegeDetails);
  }, [updateTitle, PageTitle]);

  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['privilegeDetail', id],
    queryFn: () => getPrivilegeDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const privilegeData = data?.data;

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
      label: 'Privilege Name',
      value: privilegeData?.nameFld || 'N/A',
    },
    {
      label: 'Description',
      value: privilegeData?.descriptionFld || 'N/A',
    },
    {
      label: 'System Defined',
      value: privilegeData?.isSystemDefinedFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default PrivilegeDetailPage;
