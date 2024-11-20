'use client';
import { getCountry } from '@/api';
import { AppTable } from '@/components';
import { ApiEndpoints, ApiQueryKey } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import React from 'react'

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
    const { isPending, data, isFetching} = useQuery({
        queryKey: [ApiQueryKey.country],
        queryFn: getCountry
    })
    return (
        <div>
          <AppTable
                columns={columns}
                data={data?.data ?? []}
                isLoading={isPending || isFetching}
          />
        </div>
      );
}

export default Country