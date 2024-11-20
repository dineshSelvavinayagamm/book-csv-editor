'use client';
import React, { useCallback } from 'react';
import { getTestParameterMaster, labTestParameterMasterDelate } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useParams, useRouter } from 'next/navigation';

const TestParameterMaster = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();

  console.log('Fetching details for ID:', id);

  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateTestParameterMaster);
  }, [router]);
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.testParameterMaster],
    queryFn: getTestParameterMaster,
  });

  const handleDeleteOnPress = async (id: string) => {
    try {
      await labTestParameterMasterDelate(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.testParameterMaster] });

    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };

const columns = [
  {
    accessor: 'testParameterNameFld',
    header: 'Test Parameter Name',
  },
  {
    accessor: 'testParameterIDFld',
    header: 'Test Parameter ID',
  },
  {
    accessor: 'parameterAliaseFld',
    header: 'Parameter Aliase',
  },
  {
    accessor: 'descriptionFld',
    header: 'Description',
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
      <MoreActions
        row={row}
        detailPath={Navigation.TestParameterMaster}
        idField={'oidPkFld'}
        onDelete={handleDeleteClick(row.oidPkFld)}       />
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

export default TestParameterMaster;
