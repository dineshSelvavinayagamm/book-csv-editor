'use client';
import React, { useCallback } from 'react';
import { getBloodGroup, labTestBloodGroupDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useParams, useRouter } from 'next/navigation';

const BloodGroup = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();

  console.log('Fetching details for ID:', id);


  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateBloodGroup);
  }, [router]);
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.bloodGroup],
    queryFn: getBloodGroup,
  });

  const handleDeleteOnPress = async (id: string) => {
    try {
      await labTestBloodGroupDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.bloodGroup] });

    } catch (error) {
      console.error('Error deleting user', error);
    }
  };
 
  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };

const columns = [
  {
    accessor: 'shortNameFld',
    header: 'Short Name',
  },
  {
    accessor: 'longName_Fld',
    header: 'Long Name',
  },
  {
    accessor: 'aliasFld',
    header: 'Alias',
  },
  {
    accessor: 'actions',
    header: 'Actions',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (row: any) => (
      <MoreActions row={row} detailPath={Navigation.BloodGroup} idField="oidPkFld" onDelete={handleDeleteClick(row.oidPkFld)}
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

export default BloodGroup;
