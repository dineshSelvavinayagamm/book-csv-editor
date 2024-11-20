'use client';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Spinner, Text } from '@radix-ui/themes';
import React from 'react';
import { getMasterEnterpriseDetail } from '@/api';

const ZipcodeDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useQuery({
    queryKey: ['masterDivisionDetail', id],
    queryFn: () => getMasterEnterpriseDetail(Array.isArray(id) ? id[0] : (id as string)),
    enabled: !!id && typeof id === 'string',
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Text size="5" className="font-bold mb-2">
        Zipcode Details
      </Text>
      <div>
        <Text size="4">Zip Code: {data?.zipCodeFld}</Text>
      </div>
      <div>
        <Text size="4">District: {data?.districtFld}</Text>
      </div>
      <div>
        <Text size="4">state: {data?.stateFld}</Text>
      </div>
    </div>
  );
};

export default ZipcodeDetailPage;
