'use client';
import React from 'react';
import { useCallback } from 'react';
import { getAccessGroup, groupDelete } from '@/api';
import { ApiQueryKey, Navigation } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppTable } from '@/components';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useRouter } from 'next/navigation';

const Group = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.accessGroups],
    queryFn: getAccessGroup,
  });

  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateGroup);
  }, [router]);

  const handleDeleteOnPress = async (id: string) => {
    try {
      await groupDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.accessGroups] });
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
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
          detailPath={Navigation.AccessGroup}
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

export default Group;
