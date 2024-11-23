'use client';
import React, { useCallback, useEffect } from 'react';
import { getTestPackage, labTestPackageDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation, PageTitle } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useParams, useRouter } from 'next/navigation';
import { useAppHeader } from '@/app/hooks/appHeader/page';

const TestPackage = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();
  console.log('Fetching details for ID:', id);

  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateTestPackage);
  }, [router]);
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.testPackage],
    queryFn: getTestPackage,
  });

  const { updateTitle } = useAppHeader(); 

  useEffect(() => {
    updateTitle(PageTitle.TestPackage);
  }, [updateTitle, PageTitle]);

  const handleDeleteOnPress = async (id: string) => {
    try {
      await labTestPackageDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.testPackage] });

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
    accessor: 'testPackageIDFld',
    header: 'Test Package ID',
  },
  {
    accessor: 'parameterAliaseFld',
    header: 'Aliase',
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
      <MoreActions row={row} detailPath={Navigation.TestPackage} idField="oidPkFld" onDelete={handleDeleteClick(row.oidPkFld)}
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

export default TestPackage;
