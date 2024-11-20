'use client';
import React, { useCallback } from 'react';
import { getAccessSecurityRolePrivilege, securityRolePrivilegeDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useParams, useRouter } from 'next/navigation';

const SecurityRolePrivilege = () => {
    const queryClient = useQueryClient();
  const { id } = useParams();
    const router = useRouter();
    console.log('Fetching details for ID:', id);

    const handleCreateClick = useCallback(() => {
        router.push(Navigation.CreateSecurityRolePrivilege);
    }, [router]);

    const { isPending, data, isFetching } = useQuery({
        queryKey: [ApiQueryKey.accesssecurityRolePrivilege],
        queryFn: getAccessSecurityRolePrivilege,
    });

 

    const handleDeleteOnPress = async (id: string) => {
        try {
            await securityRolePrivilegeDelete(id);
            queryClient.invalidateQueries({ queryKey: [ApiQueryKey.accesssecurityRolePrivilege] });

        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    const handleDeleteClick = (id: string) => () => {
        handleDeleteOnPress(id);
    };

const columns = [
    {
        accessor: 'securityRoleIdFKFld',
        header: 'Security Role Id',
    },
    {
        accessor: 'securityPrivilegeIdFKFld',
        header: 'Security Privilege Id',
    },
   
    {
        accessor: 'actions',
        header: 'Actions',
        render: (row: any) => (
            <MoreActions
                row={row}
                detailPath={Navigation.SecurityRolePrivilege}
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

export default SecurityRolePrivilege;
