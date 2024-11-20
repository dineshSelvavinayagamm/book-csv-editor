'use client';
import React, { useCallback } from 'react';
import { getTestPackageList, labTestPackageListDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useParams, useRouter } from 'next/navigation';

const TestPackageList = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();

  console.log('Fetching details for ID:', id);


  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateTestPackageList);
  }, [router]);
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.testPackageList],
    queryFn: getTestPackageList,
  });

  
const handleDeleteOnPress = async (id: string) => {
  try {
    await labTestPackageListDelete(id);
    queryClient.invalidateQueries({ queryKey: [ApiQueryKey.testPackageList] });

  } catch (error) {
    console.error('Error deleting user', error);
  }
};

const handleDeleteClick = (id: string) => () => {
  handleDeleteOnPress(id);
};

const columns = [
  {
    accessor: 'testPackageNameFld',
    header: 'Test Package Name',
  },
  {
    accessor: 'labTestFKFld',
    header: 'Test Name',
  },
  {
    accessor: 'isActiveFld',
    header: 'Active',
  },
  {
    accessor: 'actions',
    header: 'Actions',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (row: any) => (
      <MoreActions row={row} detailPath={Navigation.TestPackageList} idField="oidPkFld" onDelete={handleDeleteClick(row.oidPkFld)} />
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

export default TestPackageList;
