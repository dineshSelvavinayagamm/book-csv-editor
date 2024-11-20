/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { getState } from '@/api/Masters';
import { AppTable } from '@/components/Table';
import { ApiQueryKey } from '@/constants/QueryKey';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

const columns = [
  {
    accessor: 'stateNameFld',
    header: 'State Name',
  },
  {
    accessor: 'stateCodeFld',
    header: 'State Code',
  },
  {
    accessor: 'capitalFld',
    header: 'Capital',
  },
];

const State = () => {
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.state],
    queryFn: getState,
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

export default State;
