'use client';
import React, { useCallback, useEffect } from 'react';
import { AppTable } from '@/components';
import MoreActions from '@/components/MoreActions/MoreActions';
import { ApiQueryKey, Navigation, PageTitle } from '@/constants';
import {  getAccessSecurityGroupUser, securitygroupuserdelete } from '@/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useAppHeader } from '@/app/hooks/appHeader/page';

const SecurityGroupUser = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();
  console.log('Fetching details for ID:', id);

  const { updateTitle } = useAppHeader(); 


  useEffect(() => {
    updateTitle(PageTitle.UserGroup);
  }, [updateTitle]);
  const handleCreateClick = useCallback(() => {
    router.push(Navigation.createSecurityGroupUser);
  }, [router]);
  
  const { isPending, data, isFetching } = useQuery({
      queryKey: [ApiQueryKey.accessSecurityGroupUser],
      queryFn: getAccessSecurityGroupUser,
    });

    const handleDeleteOnPress = async (id: string) => {
      try {
        await securitygroupuserdelete(id);
        queryClient.invalidateQueries({ queryKey: [ApiQueryKey.accessSecurityGroupUser] });

      } catch (error) {
        console.error('Error deleting user', error);
      }
    };

    const handleDeleteClick = (id: string) => () => {
      handleDeleteOnPress(id);
    };
    

const columns = [
    {
      accessor: 'securityGroup',
      header: 'Security Group',
    },
    {
      accessor: 'user',
      header: 'User',
    },
    {
      accessor: 'actions',
      header: 'Actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (row: any) => (
        <MoreActions row={row} detailPath={Navigation.SecurityGroupUser} idField="oidPkFld" onDelete={handleDeleteClick(row.oidPkFld)}/> 
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
}

export default SecurityGroupUser