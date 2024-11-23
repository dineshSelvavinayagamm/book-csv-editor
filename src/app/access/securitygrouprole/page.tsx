'use client';
import React, { useCallback, useEffect } from 'react';
import { getAccessSecurityGroupRole, securitygrouproleDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation, PageTitle } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useParams, useRouter } from 'next/navigation';
import { useAppHeader } from '@/app/hooks/appHeader';

const SecurityGroupRole = () => {
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.RoleGroup);
  }, [updateTitle]);
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();
  console.log('Fetching details for ID:', id);

  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateSecurityGroupRole);
  }, [router]);

  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.accessSecurityGroupRole],
    queryFn: getAccessSecurityGroupRole,
  });

  const handleDeleteOnPress = async (id: string) => {
    try {
      await securitygrouproleDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.accessSecurityGroupRole] });
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };

  const columns = [
    {
      accessor: 'securityRole',
      header: 'Security Role',
    },
    {
      accessor: 'securityGroup',
      header: 'Security Group',
    },

    {
      accessor: 'actions',
      header: 'Actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (row: any) => (
        <MoreActions
          row={row}
          detailPath={Navigation.AccessSecurityGroupRole}
          idField="oidPkFld"
          onDelete={handleDeleteClick(row.oidPkFld)}
        />
      ),
    },
  ];

  return (
    <div>
      <AppTable
        isCreateEnabled={true}
        columns={columns}
        data={data?.data ?? []}
        isLoading={isPending || isFetching}
        onCreate={handleCreateClick}
      />
    </div>
  );
};

export default SecurityGroupRole;
