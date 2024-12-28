'use client';
import React, { useEffect } from 'react';
import { useCallback } from 'react';
import { ApiQueryKey, Navigation, PageTitle } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppTable } from '@/components';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useRouter } from 'next/navigation';
import { useAppHeader } from '@/app/hooks/appHeader';
import { getcontrolhospital, hospitalDelete } from '@/api/hospitalcontrol';

const Hospital = () => {
    const { updateTitle } = useAppHeader();

    useEffect(() => {
        updateTitle(PageTitle.Hospital);
    }, [updateTitle, PageTitle]);

    const queryClient = useQueryClient();
    const router = useRouter();
    const { isPending, data, isFetching } = useQuery({
        queryKey: [ApiQueryKey.hospitalcontrol],
        queryFn: getcontrolhospital,
    });

    const handleCreateClick = useCallback(() => {
        router.push(Navigation.CreateHospital);
    }, [router]);

    const handleDeleteOnPress = async (id: string) => {
        try {
            await hospitalDelete(id);
            queryClient.invalidateQueries({ queryKey: [ApiQueryKey.hospitalcontrol] });
        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    const handleDeleteClick = (id: string) => () => {
        handleDeleteOnPress(id);
    };

    const columns = [
        {
            accessor: 'hospitalNameFld',
            header: 'Hospital Name',
        },

        {
            accessor: 'hospitalMobileFld',
            header: 'Hospital Mobile_No',
        },
        {
            accessor: 'hospitalEmailFld',
            header: 'Hospital Email',
        },
        {
            accessor: 'hospitalIsActiveFld',
            header: 'Hospital Active',
        },

        {
            accessor: 'actions',
            header: 'Actions',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (row: any) => (
                <MoreActions
                    row={row}
                    detailPath={Navigation.Hospitallist}
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

export default Hospital;
