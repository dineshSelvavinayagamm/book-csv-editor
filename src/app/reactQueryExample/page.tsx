'use client';

import { useQuery } from '@tanstack/react-query';
import { useAppHeader } from '../hooks/appHeader';
import { useEffect } from 'react';
import { PageTitle } from '@/constants/PageTitle';

const fetchUsers = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users');
  return res.json();
};

const UsersPage = () => {
  const { updateTitle } = useAppHeader();
  useEffect(() => {
    updateTitle(PageTitle.ReactQuery);
  }, [updateTitle]);
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div>
      {data.map((user: any) => (
        <p key={user.id}>
          Name: {user.name} / UserName: {user.username} / Email: {user.email}
        </p>
      ))}
    </div>
  );
};

export default UsersPage;
