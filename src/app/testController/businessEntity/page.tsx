'use client';
import React, { useCallback, useEffect } from 'react';
import { getBusinessEntityType } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, PageTitle } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAppHeader } from '@/app/hooks/appHeader/page';

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
  const router = useRouter();

  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.businessEntity],
    queryFn: getBusinessEntityType,
  });

  const { updateTitle } = useAppHeader(); 

  useEffect(() => {
    updateTitle(PageTitle.BusinessEntity);
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

export default BusinessEntity;
