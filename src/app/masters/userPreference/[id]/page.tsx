'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { Spinner } from '@radix-ui/themes';
import { getUserPreferenceDetail } from '@/api/Masters';
import { AppTable } from '@/components/Table';
import { useAppHeader } from '@/app/hooks/appHeader';
import { PageTitle } from '@/constants/PageTitle';

const UserPreferenceDetailPage = () => {
  const { id } = useParams();
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.UserPreferenceDetails);
  }, [updateTitle]);
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
      <AppTable columns={columns} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default UserPreferenceDetailPage;
