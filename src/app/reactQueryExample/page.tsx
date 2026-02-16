'use client';

import { useQuery } from '@tanstack/react-query';
import { useAppHeader } from '../hooks/appHeader';
import { useEffect } from 'react';
import { PageTitle } from '@/constants/PageTitle';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

const fetchUsers = async (): Promise<User[]> => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return res.json();
};

const UsersPage = () => {
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.ReactQuery);
  }, [updateTitle]);

  const { data, isLoading, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-lg font-medium animate-pulse">Loading users...</p>
      </div>
    );

  if (error instanceof Error)
    return (
      <div className="h-screen flex items-center justify-center text-red-500 font-medium">
        {error.message}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Users List</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((user) => (
            <div
              key={user.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">{user.name}</h3>

              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">Username:</span> {user.username}
              </p>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
