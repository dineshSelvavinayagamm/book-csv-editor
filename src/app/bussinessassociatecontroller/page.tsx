'use client';
import React, { useEffect } from 'react';
import { useCallback } from 'react';
import { ApiQueryKey, Navigation, PageTitle } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppTable } from '@/components';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useRouter } from 'next/navigation';
import { useAppHeader } from '@/app/hooks/appHeader';
import { BusinessAssociateDelete, getcontrolbusinessAssociate } from '@/api/businessassociatecontrol';

const BusinessAssociate = () => {
    const { updateTitle } = useAppHeader();

    useEffect(() => {
        updateTitle(PageTitle.BusinessAssociate);
    }, [updateTitle, PageTitle]);

    const queryClient = useQueryClient();
    const router = useRouter();
    const { isPending, data, isFetching } = useQuery({
        queryKey: [ApiQueryKey.BusinessAssociatecontrol],
        queryFn: getcontrolbusinessAssociate,
    });

    const handleCreateClick = useCallback(() => {
        router.push(Navigation.createBusinessAssociate);
    }, [router]);

    const handleDeleteOnPress = async (id: string) => {
        try {
            await BusinessAssociateDelete(id);
            queryClient.invalidateQueries({ queryKey: [ApiQueryKey.BusinessAssociatecontrol] });
        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    const handleDeleteClick = (id: string) => () => {
        handleDeleteOnPress(id);
    };

    const columns = [
        {
            accessor: 'businessAssociateNameFld',
            header: 'BusinessAssociate Name',
        },

        {
            accessor: 'businessAssociateMobileFld',
            header: 'BusinessAssociate Mobile_No',
        },
        {
            accessor: 'businessAssociateEmailFld',
            header: 'BusinessAssociate Email',
        },
        {
            accessor: 'businessAssociateIsActiveFld',
            header: 'BusinessAssociate Active',
        },


        {
            accessor: 'actions',
            header: 'Actions',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (row: any) => (
                <MoreActions
                    row={row}
                    detailPath={Navigation.BusinessAssociate}
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

export default BusinessAssociate;
