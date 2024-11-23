'use client';
import { getEnterprise } from '@/api/Masters';
import { useAppHeader } from '@/app/hooks/appHeader';
import MoreActions from '@/components/MoreActions/MoreActions';
import { AppTable } from '@/components/Table';
import { Navigation, PageTitle } from '@/constants';
import { ApiQueryKey } from '@/constants/QueryKey';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';

const columns = [
  {
    accessor: 'enterpriseNameFld',
    header: 'Enterprise Name',
  },
  {
    accessor: 'enterpriseIDFld',
    header: 'Enterprise Id',
  },
  {
    accessor: 'remarksFld',
    header: 'Remarks',
  },
  {
    accessor: 'actions',
    header: 'Actions',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (row: any) => (
      <MoreActions row={row} detailPath={Navigation.Enterprise} idField="oidPkFld" />
    ),
  },
];

const Enterprise = () => {
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.enterprise],
    queryFn: getEnterprise,
  });
  const { updateTitle } = useAppHeader(); 

  useEffect(() => {
    updateTitle(PageTitle.Enterprice);
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

export default Enterprise;
