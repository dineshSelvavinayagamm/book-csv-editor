"use client"; // Add this at the top

import { Box } from '@radix-ui/themes';
import { useAppHeader } from './hooks/appHeader';
import { useEffect } from 'react';
import { PageTitle } from '@/constants';


const Home = () => {
  const { updateTitle } = useAppHeader();

  useEffect(() => {
    updateTitle(PageTitle.Home);
  }, [updateTitle]);
  return <Box className="p-4 sm:p-20" />;
};

export default Home;
