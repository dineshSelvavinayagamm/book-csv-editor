'use client';
import { getLabTestMaster, masterLabTestMasterDelete } from '@/api/Masters';
import MoreActions from '@/components/MoreActions/MoreActions';
import { AppTable } from '@/components/Table';
import { Navigation, PageTitle } from '@/constants';
import { ApiQueryKey } from '@/constants/QueryKey';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppHeader } from '@/app/hooks/appHeader/page';

const LabTestMaster = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();
  console.log('Fetching details for ID:', id);

  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateLabTestMaster);
  }, [router]);
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.labTestMaster],
    queryFn: getLabTestMaster,
  });

  const handleDeleteOnPress = async (id: string) => {
    try {
      await masterLabTestMasterDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.labTestMaster] });

    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };
  const { updateTitle } = useAppHeader(); 

  useEffect(() => {
    updateTitle(PageTitle.LabTestMaster);
  }, [updateTitle, PageTitle]);

  const columns = [
    {
      accessor: 'testNameFld',
      header: 'Test Name',
    },
    {
      accessor: 'businessTypeFKFld',
      header: 'Business Type',
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
        <MoreActions row={row} detailPath={Navigation.LabTestMaster} idField="oidPkFld" onDelete={handleDeleteClick(row.oidPkFld)}
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

export default LabTestMaster;
