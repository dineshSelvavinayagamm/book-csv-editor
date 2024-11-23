'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getRolesDetail } from '@/api/User';
import { useAppHeader } from '@/app/hooks/appHeader';
import { PageTitle } from '@/constants';

const RolesDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.RoleDetails);
  }, [updateTitle, PageTitle]);
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['rolesDetail', id],
    queryFn: () => getRolesDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const rolesData = data?.data;

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
      label: 'Enterprise Name',
      value: rolesData?.nameFld || 'N/A',
    },
    {
      label: 'Description',
      value: rolesData?.descriptionFld || 'N/A',
    },
    {
      label: 'System Defined',
      value: rolesData?.isSystemDefinedFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default RolesDetailPage;
