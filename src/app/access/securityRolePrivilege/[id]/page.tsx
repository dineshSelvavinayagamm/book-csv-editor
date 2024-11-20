'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { securityRolePrivilegeDetail } from '@/api';

const SecurityRolePrivilegeDetailPage = () => {
  const { id } = useParams();
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
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          Security Role Privilege Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default SecurityRolePrivilegeDetailPage;
