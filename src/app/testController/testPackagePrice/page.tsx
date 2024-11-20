'use client';
import React, { useCallback } from 'react';
import { getTestPackagePrice, labTestPackagePriceDelete } from '@/api';
import { AppTable } from '@/components';
import { ApiQueryKey, Navigation } from '@/constants';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import MoreActions from '@/components/MoreActions/MoreActions';
import { useParams, useRouter } from 'next/navigation';

const TestPackagePrice = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();

  console.log('Fetching details for ID:', id);


  const handleCreateClick = useCallback(() => {
    router.push(Navigation.CreateTestPackagePrice);
  }, [router]);
  const { isPending, data, isFetching } = useQuery({
    queryKey: [ApiQueryKey.testPackagePrice],
    queryFn: getTestPackagePrice,
  });

  const handleDeleteOnPress = async (id: string) => {
    try {
      await labTestPackagePriceDelete(id);
      queryClient.invalidateQueries({ queryKey: [ApiQueryKey.testPackagePrice] });

    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const handleDeleteClick = (id: string) => () => {
    handleDeleteOnPress(id);
  };
  

const columns = [
  {
    accessor: 'testPackageNameFld',
    header: 'Test Package Name',
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
      <MoreActions
        row={row}
        detailPath={Navigation.TestPackagePrice}
        idField="oidPkFld"
        onDelete={handleDeleteClick(row.oidPkFld)}
      />
    ),
  },
];






  return (
    <div>
      <AppTable
        isCreateEnabled={true}
        columns={columns}
        data={data?.data ?? []}
        isLoading={isPending || isFetching}
        onCreate={handleCreateClick}
      />
    </div>
  );
};

export default TestPackagePrice;
