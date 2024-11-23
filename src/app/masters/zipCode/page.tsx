'use client';
import { getZipCode } from '@/api/Masters';
import { useAppHeader } from '@/app/hooks/appHeader';
import { AppTable } from '@/components/Table';
import { PageTitle } from '@/constants';
import { ApiQueryKey } from '@/constants/QueryKey';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';

const columns = [
  {
    accessor: 'zipCodeFld',
    header: 'Zip Code',
  },
  {
    accessor: 'districtFld',
    header: 'District',
  },
  {
    accessor: 'stateFld',
    header: 'State Name',
  },
];

const ZipCode = () => {
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.zipcode],
    queryFn: getZipCode,
  });

  const { updateTitle } = useAppHeader(); 

  useEffect(() => {
    updateTitle(PageTitle.ZipCode);
  }, [updateTitle, PageTitle]);
  return (
    <div>
      <AppTable
        columns={columns}
        data={data?.data ?? []}
        isLoading={isPending || isFetching}
      />
    </div>
  );
};

export default ZipCode;
