'use client';
import React, { useEffect } from 'react';
import { useCallback } from 'react';
import { ApiQueryKey, Navigation, PageTitle } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AppTable } from '@/components';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useRouter } from 'next/navigation';
import { useAppHeader } from '@/app/hooks/appHeader';
import { clinicDelete, getcontrolclinic } from '@/api/cliniccontrol';

const Clinic = () => {
    const { updateTitle } = useAppHeader();

    useEffect(() => {
        updateTitle(PageTitle.clinicTitle);
    }, [updateTitle, PageTitle]);

    const queryClient = useQueryClient();
    const router = useRouter();
    const { isPending, data, isFetching } = useQuery({
        queryKey: [ApiQueryKey.cliniccontrol],
        queryFn: getcontrolclinic,
    });

    const handleCreateClick = useCallback(() => {
        router.push(Navigation.CreateClinic);
    }, [router]);

    const handleDeleteOnPress = async (id: string) => {
        try {
            await clinicDelete(id);
            queryClient.invalidateQueries({ queryKey: [ApiQueryKey.cliniccontrol] });
        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    const handleDeleteClick = (id: string) => () => {
        handleDeleteOnPress(id);
    };

    const columns = [
        {
            accessor: 'clinicNameFld',
            header: 'Clinic Name',
        },
        {
            accessor: 'clinicAddressFld',
            header: 'Clinic Address',
        },
        {
            accessor: 'clinicPhoneFld',
            header: 'Clinic Phone_No',
        },
        {
            accessor: 'clinicMobileFld',
            header: 'Clinic Mobile_No',
        },
        {
            accessor: 'clinicEmailFld',
            header: 'Clinic Email',
        },
        {
            accessor: 'clinicIsActiveFld',
            header: 'Clinic Active',
        },
        {
            accessor: 'actions',
            header: 'Actions',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (row: any) => (
                <MoreActions
                    row={row}
                    detailPath={Navigation.Clinic}
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

export default Clinic;
