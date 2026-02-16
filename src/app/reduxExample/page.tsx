'use client';
import CustomerAdd from '@/components/CustomerAdd';
import CustomerView from '@/components/CustomerView';
import React, { useEffect } from 'react';
import { useAppHeader } from '../hooks/appHeader';
import { PageTitle } from '@/constants/PageTitle';

const ReduxExample = () => {
  const { updateTitle } = useAppHeader();
  useEffect(() => {
    updateTitle(PageTitle.ReduxExample);
  }, [updateTitle]);
  return (
    <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 mt-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Redux Toolkit CRUD Demo – Customer Management
      </h1>

      {/* Add customer card */}
      <div className="border rounded-lg p-4 mb-5 bg-gray-50">
        <CustomerAdd />
      </div>

      {/* Customer list card */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <CustomerView />
      </div>
    </div>
  );
};

export default ReduxExample;
