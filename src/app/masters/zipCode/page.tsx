'use client';
import { getZipCode } from '@/api/Masters';
import { AppTable } from '@/components/Table';
import { ApiQueryKey } from '@/constants/QueryKey';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

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
