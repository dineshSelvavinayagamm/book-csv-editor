'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { securityGroupUserDetail } from '@/api/User';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import { PageTitle } from '@/constants/PageTitle';

const SecurityGroupUserDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.SecurityGroupUserDetails);
  }, [updateTitle]);
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['securityGroupUser', id],
    queryFn: () => securityGroupUserDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const seccurityGroupUser = data?.data;

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
      label: 'Security Group',
      value: seccurityGroupUser?.securityGroup || 'N/A',
    },
    {
      label: 'Description',
      value: seccurityGroupUser?.user || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default SecurityGroupUserDetailPage;
