/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { getState } from '@/api/Masters';
import { useAppHeader } from '@/app/hooks/appHeader';
import { AppTable } from '@/components/Table';
import { PageTitle } from '@/constants';
import { ApiQueryKey } from '@/constants/QueryKey';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';

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
  const { updateTitle } = useAppHeader(); 

  useEffect(() => {
    updateTitle(PageTitle.State);
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

export default State;
