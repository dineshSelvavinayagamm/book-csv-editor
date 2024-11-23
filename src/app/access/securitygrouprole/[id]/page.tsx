'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { securityGroupRoleDetail } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import { PageTitle } from '@/constants/PageTitle';

const SecurityGroupRoleDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.SecurityGroupRoleDetails);
  }, [updateTitle, PageTitle]);
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['SecuritygrouproleDetail', id],
    queryFn: () => securityGroupRoleDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const securitygrouproleData = data?.data;

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
      label: 'Security Role',
      value: securitygrouproleData?.securityRole || 'N/A',
    },
    {
      label: 'Security Group',
      value: securitygrouproleData?.securityGroup || 'N/A',
    },
    
  ];

  return (
    <div className="p-4">
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default SecurityGroupRoleDetailPage;
