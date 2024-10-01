import { AppTable } from '@/components';
import React from 'react';

const columns = [
  { header: 'Full name', accessor: 'fullName' },
  { header: 'Email', accessor: 'email' },
  { header: 'Group', accessor: 'group' },
];

const data = [
  { fullName: 'Test', email: 'test@example.com', group: 'Developer' },
  { fullName: 'Anna Johnson', email: 'hello@example.com', group: 'Designer' },
  { fullName: 'John Doe', email: 'john@example.com', group: 'Manager' },
];

const Home = () => {
  return (
    <div className="p-4 sm:p-20">
      <AppTable columns={columns} data={data} />
    </div>
  );
};

export default Home;
