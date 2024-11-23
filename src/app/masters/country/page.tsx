'use client';
import { getCountry } from '@/api';
import { useAppHeader } from '@/app/hooks/appHeader';
import { AppTable } from '@/components';
import { ApiQueryKey, PageTitle } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';

const columns = [
  {
    accessor: 'countryNameFld',
    header: 'Country Name',
  },
  {
    accessor: 'shortNameFld',
    header: 'Short Name',
  },
  {
    accessor: 'continentFld',
    header: 'Continent',
  },
  {
    accessor: 'isActiveFld',
    header: 'Status',
  },
  {
    accessor: 'iso2Fld',
    header: 'o2',
  },
  {
    accessor: 'isodigitFld',
    header: 'Odigit',
  },
];
const Country = () => {
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.country],
    queryFn: getCountry,
  });
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.Country);
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

export default Country;
