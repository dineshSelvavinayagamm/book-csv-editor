'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { AppTable } from '@/components/Table';
import { getUserDetail } from '@/api/User';

const ProfileDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['profileDetail', id],
    queryFn: () => getUserDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const profileData = data?.data;

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
      label: 'User Type',
      value: profileData?.userTypeFld || 'N/A',
    },
    {
      label: 'First Name',
      value: profileData?.firstNameFld || 'N/A',
    },
    {
      label: 'Last Name',
      value: profileData?.lastNameFld || 'N/A',
    },
    {
      label: 'Email',
      value: profileData?.emailFld || 'N/A',
    },
    {
      label: 'Mobile No',
      value: profileData?.mobileFld || 'N/A',
    },
    {
      label: 'Active',
      value: profileData?.isActiveFld || 'N/A',
    },
    {
      label: 'Remarks',
      value: profileData?.remarksFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          Profile Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default ProfileDetailPage;
