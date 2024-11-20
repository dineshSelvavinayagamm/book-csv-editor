'use client';
import React, { useCallback } from 'react';
import { getTestMaster, labTestMasterDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useParams, useRouter } from 'next/navigation';

const TestMaster = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();
  console.log('Fetching details for ID:', id);

  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateTestMaster);
  }, [router]);
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.testMaster],
    queryFn: getTestMaster,
  });

  const handleDeleteOnPress = async (id: string) => {
    try {
      await labTestMasterDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.testMaster] });

    } catch (error) {
      console.error('Error deleting user', error);
    }
  };
  
  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };

const columns = [
  {
    accessor: 'testNameFld',
    header: 'Test Name',
  },
  {
    accessor: 'testIDFld',
    header: 'Test ID',
  },
  {
    accessor: 'testAliaseFld',
    header: 'Aliase',
  },
  {
    accessor: 'descriptionFld',
    header: 'Description',
  },
  {
    accessor: 'testParameterNameFld',
    header: 'Test Parameter',
  },
  {
    accessor: 'isActiveFld',
    header: 'Active',
  },
  {
    accessor: 'testCategoryFld',
    header: 'Test Category',
  },
  {
    accessor: 'actions',
    header: 'Actions',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (row: any) => (
      <MoreActions row={row} detailPath={Navigation.TestMaster} idField="oidPkFld" onDelete={handleDeleteClick(row.oidPkFld)}
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

export default TestMaster;
