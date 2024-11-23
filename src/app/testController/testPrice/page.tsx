'use client';
import React, { useCallback, useEffect } from 'react';
import { getTestPrice, labTestPriceDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation, PageTitle } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useParams, useRouter } from 'next/navigation';
import { useAppHeader } from '@/app/hooks/appHeader/page';

const TestPrice = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();

  console.log('Fetching details for ID:', id);


  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateTestPrice);
  }, [router]);

  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.testPrice],
    queryFn: getTestPrice,
  });

  const handleDeleteOnPress = async (id: string) => {
    try {
      await labTestPriceDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.testPrice] });

    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const { updateTitle } = useAppHeader(); 

  useEffect(() => {
    updateTitle(PageTitle.TestPrice);
  }, [updateTitle, PageTitle]);

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };

const columns = [
  {
    accessor: 'testNameFld',
    header: 'Test Name',
  },
  {
    accessor: 'isActiveFld',
    header: 'Active',
  },
  {
    accessor: 'priceFld',
    header: 'Price',
  },
  {
    accessor: 'discountFld',
    header: 'Discount',
  },
  {
    accessor: 'actions',
    header: 'Actions',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    render: (row: any) => (
      <MoreActions row={row} detailPath={Navigation.TestPrice} idField="oidPkFld" onDelete={handleDeleteClick(row.oidPkFld)}
      />
    ),
  },
];

  return (
    <div>
      <AppTable
        columns={columns}
        isCreateEnabled={true}
        data={data?.data ?? []}
        isLoading={isPending || isFetching}
        onCreate={handleCreateClick}
      />
    </div>
  );
};

export default TestPrice;
