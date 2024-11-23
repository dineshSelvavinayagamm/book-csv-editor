'use client';
import { getUserPreference, masterUserPreferenceDelete } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader/page';
import MoreActions from '@/components/MoreActions/MoreActions';
import { AppTable } from '@/components/Table';
import { ApiQueryKey, Navigation, PageTitle } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import React, { useCallback, useEffect } from 'react';

const UserPreference = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();
  console.log('Fetching details for ID:', id);
  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateUserPreference);
  }, [router]);

  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.userPreference],
    queryFn: getUserPreference,
  });

  const handleDeleteOnPress = async (id: string) => {
    try {
      await masterUserPreferenceDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.userPreference] });
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };

  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.UserPreference);
  }, [updateTitle, PageTitle]);

  const columns = [
    {
      accessor: 'userName',
      header: 'User Name',
    },
    {
      accessor: 'preferenceTypeFld',
      header: 'Preference Type',
    },
    {
      accessor: 'preferenceValueFld',
      header: 'preference Value',
    },
    {
      accessor: 'actions',
      header: 'Actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (row: any) => (
        <MoreActions
          row={row}
          detailPath={Navigation.UserPreference}
          showView={true}
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

export default UserPreference;
