'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { securityRolePrivilegeDetail } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import { PageTitle } from '@/constants/PageTitle';

const SecurityRolePrivilegeDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.SecurityRolePrivilegeDetails);
  }, [updateTitle, PageTitle]);
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['SecurityroleprivilegeDetail', id],
    queryFn: () => securityRolePrivilegeDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const securityroleprivilegeData = data?.data;

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
      label: 'Security Role Id',
      value: securityroleprivilegeData?.securityRoleIdFKFld || 'N/A',
    },
    {
      label: 'Security Privilege Id',
      value: securityroleprivilegeData?.securityPrivilegeIdFKFld || 'N/A',
    },
    
  ];

  return (
    <div className="p-4">
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default SecurityRolePrivilegeDetailPage;
