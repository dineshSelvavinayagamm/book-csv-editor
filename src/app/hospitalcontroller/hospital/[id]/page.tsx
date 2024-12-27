'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { useAppHeader } from '@/app/hooks/appHeader';
import { PageTitle } from '@/constants';
import { getHospitalDetail } from '@/api/hospitalcontrol';

const HospitalDetailPage = () => {
    const { id } = useParams();
    const { updateTitle } = useAppHeader();

    useEffect(() => {
        updateTitle(PageTitle.HospitalDeatils);
    }, [updateTitle, PageTitle]);
    console.log('Fetching details for ID:', id);

    const { data, isLoading } = useQuery({
        queryKey: ['hospitaldetail', id],
        queryFn: () => getHospitalDetail(id as string),
        enabled: !!id,
    });

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );

    const hospitalData = data?.data;

    const columns = [
        {
            accessor: 'label',
            header: 'Detail',
        },
        {
            accessor: 'value',
            header: 'Information',
        },
    ];

    const tableData = [
        {
            label: 'Hospital Name',
            value: hospitalData?.hospitalNameFld || 'N/A',
        },
        {
            label: 'Hospital Address',
            value: hospitalData?.hospitalAddressFld || 'N/A',
        },
        {
            label: 'Hospital PhoneNo',
            value: hospitalData?.hospitalPhoneFld || 'N/A',
        },
        {
            label: 'Hospital MobileNo',
            value: hospitalData?.hospitalMobileFld || 'N/A',
        },
        {
            label: 'Hospital Email',
            value: hospitalData?.hospitalEmailFld || 'N/A',
        },
        {
            label: 'Hospital Active',
            value: hospitalData?.hospitalIsActiveFld || 'N/A',
        },
    ];

    return (
        <div className="p-4">
            <AppTable columns={columns} data={tableData} isLoading={isLoading} />
        </div>
    );
};

export default HospitalDetailPage;
