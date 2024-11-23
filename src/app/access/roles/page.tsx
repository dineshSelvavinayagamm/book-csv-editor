'use client';
import React, { useCallback, useEffect } from 'react';
import { getAccessRole, roleDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation, PageTitle } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useRouter } from 'next/navigation';
import { useAppHeader } from '@/app/hooks/appHeader';

const Roles = () => {
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.SecurityRole);
  }, [updateTitle, PageTitle]);
  const queryClient = useQueryClient();

  const router = useRouter();

  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateRole);
  }, [router]);

  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.accessRoles],
    queryFn: getAccessRole,
  });

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };

  const handleDeleteOnPress = async (id: string) => {
    try {
      await roleDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.accessRoles] });
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const columns = [
    {
      accessor: 'nameFld',
      header: 'Name',
    },
    {
      accessor: 'descriptionFld',
      header: 'Description',
    },
    {
      accessor: 'isSystemDefinedFld',
      header: 'System Defined',
    },
    {
      accessor: 'actions',
      header: 'Actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (row: any) => (
        <MoreActions
          row={row}
          detailPath={Navigation.AccessRoles}
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

export default Roles;
