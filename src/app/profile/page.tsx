'use client';
import React, { useCallback } from 'react';
import { getUserList, userDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import MoreActions from '@/components/MoreActions/MoreActions';

const Profile = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();

  console.log('Fetching details for ID:', id);

  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateProfile);
  }, [router]);

  const { isLoading, data } = useQuery({
    queryKey: [ApiQueryKey.users],
    queryFn: getUserList,
  });

  const handleDeleteOnPress = async (id: string) => {
    try {
      await userDelete(id);
      // Refetch the user list to update the data
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.users] });
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };

  const columns = [
    {
      accessor: 'userTypeFld',
      header: 'User Type',
    },
    {
      accessor: 'firstNameFld',
      header: 'First Name',
    },
    {
      accessor: 'lastNameFld',
      header: 'Last Name',
    },
    {
      accessor: 'emailFld',
      header: 'Email',
    },
    {
      accessor: 'mobileFld',
      header: 'Mobile',
    },
    {
      accessor: 'isActiveFld',
      header: 'Active',
    },
    {
      accessor: 'remarksFld',
      header: 'Remarks',
    },
    {
      accessor: 'actions',
      header: 'Actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (row: any) => (
        <MoreActions
          row={row}
          detailPath={Navigation.Profile}
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
        isLoading={isLoading}
        onCreate={handleCreateClick}
      />
    </div>
  );
};

export default Profile;
