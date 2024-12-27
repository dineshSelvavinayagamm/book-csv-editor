'use client';

import React, { useEffect, useCallback } from 'react';
import { getUserList, userDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import MoreActions from '@/components/MoreActions/MoreActions';
import { PageTitle } from '@/constants/PageTitle';
import { useAppHeader } from '../hooks/appHeader';
import { doctorDelete, getDoctorsList } from '@/api/doctor';

const doctorsController = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const { updateTitle } = useAppHeader();


    useEffect(() => {
        updateTitle(PageTitle.DoctorsList);
    }, [updateTitle, PageTitle]);


    const { isLoading, data } = useQuery({
        queryKey: [ApiQueryKey.doctors],
        queryFn: getDoctorsList,
    });

    const handleCreateClick = useCallback(() => {
        router.push(Navigation.DoctorCreate);
    }, [router]);


    const handleDeleteOnPress = async (id: string) => {
        try {
            await doctorDelete(id);
            queryClient.invalidateQueries({ queryKey: [ApiQueryKey.doctors] });
        } catch (error) {
            console.error('Error deleting user', error);
        }
    };

    const handleDeleteClick = (id: string) => () => {
        handleDeleteOnPress(id);
    };

    const columns = [
        { accessor: 'doctorNameFld', header: 'Doctor Name' },
        { accessor: 'doctorEmailFld', header: 'Email' },
        { accessor: 'doctorPhoneFld', header: 'Mobile' },
        { accessor: 'doctorIsActiveFld', header: 'Active' },
        {
            accessor: 'actions',
            header: 'Actions',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (row: any) => (
                <MoreActions
                    row={row}
                    detailPath={Navigation.doctorsList}
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

export default doctorsController;
