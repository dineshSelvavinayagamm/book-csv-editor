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

interface Data {
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

const fetchUser = async (): Promise<Data[]> => {
  const res = await fetch('');
  if (!res.ok) {
    throw new Error('failed to fetch users');
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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div>
      {data?.map((user) => (
        <p key={user.id}>
          Name: {user.name} / UserName: {user.username} / Email: {user.email}
        </p>
      ))}
    </div>
  );
};

export default UsersPage;
