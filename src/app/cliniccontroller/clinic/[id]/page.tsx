'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { useAppHeader } from '@/app/hooks/appHeader';
import { PageTitle } from '@/constants';
import { getClinicDetail } from '@/api/cliniccontrol';

const ClinicDetailPage = () => {
    const { id } = useParams();
    const { updateTitle } = useAppHeader();

    useEffect(() => {
        updateTitle(PageTitle.ClinicDetail);
    }, [updateTitle, PageTitle]);
    console.log('Fetching details for ID:', id);

    const { data, isLoading } = useQuery({
        queryKey: ['clinicdetail', id],
        queryFn: () => getClinicDetail(id as string),
        enabled: !!id,
    });

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );

    const clinicData = data?.data;

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
            label: 'Clinic Name',
            value: clinicData?.clinicNameFld || 'N/A',
        },
        {
            label: 'Clinic Address',
            value: clinicData?.clinicAddressFld || 'N/A',
        },
        {
            label: 'Clinic PhoneNo',
            value: clinicData?.clinicPhoneFld || 'N/A',
        },
        {
            label: 'Clinic MobileNo',
            value: clinicData?.clinicMobileFld || 'N/A',
        },
        {
            label: 'Clinic Email',
            value: clinicData?.clinicEmailFld || 'N/A',
        },
        {
            label: 'Clinic Remarks',
            value: clinicData?.clinicRemarksFld || 'N/A',
        },
    ];

    return (
        <div className="p-4">
            <AppTable columns={columns} data={tableData} isLoading={isLoading} />
        </div>
    );
};

export default ClinicDetailPage;
