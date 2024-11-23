'use client';
import React, { useEffect } from 'react';
import { useCallback } from 'react';
import { getAccessPrivilege, privilegeDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useRouter } from 'next/navigation';
import { PageTitle } from '@/constants/PageTitle';
import { useAppHeader } from '@/app/hooks/appHeader/page';

const Privilege = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.accessPrivilege],
    queryFn: getAccessPrivilege,
  });
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.SecurityPrivilege);
  }, [updateTitle, PageTitle]);

  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreatePrivilege);
  }, [router]);

  const handleDeleteOnPress = async (id: string) => {
    try {
      await privilegeDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.accessPrivilege] });
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };

  const columns = [
    { accessor: 'nameFld', header: 'Name' },
    { accessor: 'descriptionFld', header: 'Description' },
    { accessor: 'isSystemDefinedFld', header: 'System Defined' },
    {
      accessor: 'actions',
      header: 'Actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (row: any) => (
        <MoreActions
          row={row}
          detailPath={Navigation.AccessPrivilege}
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

export default Privilege;
