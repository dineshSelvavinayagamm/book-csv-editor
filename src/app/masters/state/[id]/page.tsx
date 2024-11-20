'use client';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Spinner, Text } from '@radix-ui/themes';
import React from 'react';
import { getStateDetail } from '@/api/Masters';

const StateDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading } = useQuery({
    queryKey: ['masterDivisionDetail', id],
    queryFn: () => getStateDetail(Array.isArray(id) ? id[0] : (id as string)),
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
        State Details
      </Text>
      <div>
        <Text size="4">State Name: {data?.stateNameFld}</Text>
      </div>
      <div>
        <Text size="4">State Code: {data?.stateCodeFld}</Text>
      </div>
      <div>
        <Text size="4">Capital: {data?.capitalFld}</Text>
      </div>
    </div>
  );
};

export default StateDetailPage;
