'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { Spinner, Text } from '@radix-ui/themes';
import { getUserPreferenceDetail } from '@/api/Masters';
import { AppTable } from '@/components/Table';

const UserPreferenceDetailPage = () => {
  const { id } = useParams();
  console.log('Fetching details for ID:', id);

  const { data, isLoading } = useQuery({
    queryKey: ['userPreferenceDetail', id],
    queryFn: () => getUserPreferenceDetail(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );

  const userPreferenceData = data?.data;

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
      label: 'User Name',
      value: userPreferenceData?.userNameFld || 'N/A',
    },
    {
      label: 'Preference Type',
      value: userPreferenceData?.preferenceTypeFld || 'N/A',
    },
    {
      label: 'Preference Value',
      value: userPreferenceData?.preferenceValueFld || 'N/A',
    },
  ];

  return (
    <div className="p-4">
      <div className="pb-8">
        <Text size="5" className="font-bold mb-2">
          User Preference Details
        </Text>
      </div>
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default UserPreferenceDetailPage;
