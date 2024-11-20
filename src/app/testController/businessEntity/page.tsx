'use client';
import React from 'react';
import { getBusinessEntityType } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey } from '@/constants';
import { useQuery } from '@tanstack/react-query';

const columns = [
  {
    accessor: 'keyFld',
    header: 'Key',
  },
  {
    accessor: 'valueFld',
    header: 'Value',
  },
  {
    accessor: 'typeIDFld',
    header: 'Type Id',
  },
  {
    accessor: 'dataTypeFld',
    header: 'Date Type',
  },
  {
    accessor: 'descriptionFld',
    header: 'Description',
  },
];

const BusinessEntity = () => {

  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.businessEntity],
    queryFn: getBusinessEntityType,
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

export default BusinessEntity;
