'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { useAppHeader } from '@/app/hooks/appHeader';
import { PageTitle } from '@/constants/PageTitle';
import { getDoctorDetail } from '@/api/doctor';

const DoctorDetailPage = () => {
    const { id } = useParams();
    const { updateTitle } = useAppHeader();

    useEffect(() => {
        updateTitle(PageTitle.DoctorsDetails);
    }, [updateTitle]);
    console.log('Fetching details for ID:', id);
    const { data, isLoading } = useQuery({
        queryKey: ['profileDetail', id],
        queryFn: () => getDoctorDetail(id as string),
        enabled: !!id,
    });

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );

    const doctorData = data?.data;

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
            label: 'Doctor Name',
            value: doctorData?.doctorNameFld || 'N/A',
        },
        {
            label: 'Email',
            value: doctorData?.doctorEmailFld || 'N/A',
        },
        {
            label: 'Mobile No',
            value: doctorData?.doctorMobileFld || 'N/A',
        },
        {
            label: 'Specialty',
            value: doctorData?.doctorSpecialityFld || 'N/A',
        },
        {
            label: 'Qualification',
            value: doctorData?.doctorQualificationFld || 'N/A',
        },
        {
            label: 'Experience',
            value: doctorData?.doctorExperienceFld || 'N/A',
        },
        {
            label: 'Active',
            value: doctorData?.doctorIsActiveFld || 'N/A',
        },
        {
            label: 'Remarks',
            value: doctorData?.doctorRemarksFld || 'N/A',
        },
    ];

    return (
        <div className="p-4">
            <AppTable columns={columns} data={tableData} isLoading={isLoading} />
        </div>
    );
};

export default DoctorDetailPage;
