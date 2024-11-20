'use client';
import { getUserHealthParam, masterUserHealthParamDelete } from '@/api/Masters';
import { AppTable } from '@/components/Table';
import { ApiQueryKey } from '@/constants/QueryKey';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/constants';
import MoreActions from '@/components/MoreActions/MoreActions';

const UserHealthParam = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();
  console.log('Fetching details for ID:', id);
  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateUserHealthParam);
  }, [router]);
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.userHealthParam],
    queryFn: getUserHealthParam,
  });

  const handleDeleteOnPress = async (id: string) => {
    try {
      await masterUserHealthParamDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.userHealthParam] });

    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };

  const columns = [
    {
      accessor: 'userName',
      header: 'User Name',
    },
    { 
      accessor: 'heightFld',
      header: 'Height',
    },
    {
      accessor: 'weightFld',
      header: 'Weight',
    },
    {
      accessor: 'bloodgroupFld',
      header: 'Blood Group',
    },
    {
      accessor: 'actions',
      header: 'Actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (row: any) => (
        <MoreActions row={row} detailPath={Navigation.UserHealthParam} showView={false} idField="oidPkFld" onDelete={handleDeleteClick(row.oidPkFld)}
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

export default UserHealthParam;
