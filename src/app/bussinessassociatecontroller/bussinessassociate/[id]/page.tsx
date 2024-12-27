'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { useAppHeader } from '@/app/hooks/appHeader';
import { PageTitle } from '@/constants';
import { getBussinessAssociateDetail } from '@/api/businessassociatecontrol';

const BussinessAssociateDetailPage = () => {
    const { id } = useParams();
    const { updateTitle } = useAppHeader();

    useEffect(() => {
        updateTitle(PageTitle.BusinessAssociateDetail);
    }, [updateTitle, PageTitle]);
    console.log('Fetching details for ID:', id);

    const { data, isLoading } = useQuery({
        queryKey: ['businessAssociateDetail', id],
        queryFn: () => getBussinessAssociateDetail(id as string),
        enabled: !!id,
    });

    if (isLoading)
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );

    const bussinessassociateData = data?.data;

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
            label: 'Bussinessassociate Name',
            value: bussinessassociateData?.businessAssociateNameFld || 'N/A',
        },
        {
            label: 'Bussinessassociate Address',
            value: bussinessassociateData?.businessAssociateAddressFld || 'N/A',
        },
        {
            label: 'Bussinessassociate PhoneNo',
            value: bussinessassociateData?.businessAssociatePhoneFld || 'N/A',
        },
        {
            label: 'Bussinessassociate MobileNo',
            value: bussinessassociateData?.businessAssociateMobileFld || 'N/A',
        },
        {
            label: 'Bussinessassociate Email',
            value: bussinessassociateData?.businessAssociateEmailFld || 'N/A',
        },
        {
            label: 'Bussinessassociate Active',
            value: bussinessassociateData?.businessAssociateIsActiveFld || 'N/A',
        },

    ];

    return (
        <div className="p-4">
            <AppTable columns={columns} data={tableData} isLoading={isLoading} />
        </div>
    );
};

export default BussinessAssociateDetailPage;
