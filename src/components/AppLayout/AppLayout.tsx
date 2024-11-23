'use client';

import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { Header } from '../Header';
import { LeftSideBar, RightSideBar } from '../SideBar';
import { Footer } from '../Footer';
import { useAppHeader } from '@/app/hooks/appHeader';

interface LayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

  const onCloseDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onClickMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const { getTitle } = useAppHeader();

  // Update title on component mount and listen for storage changes
  useEffect(() => {
    const updateTitleFromStorage = () => {
      const storedTitle = getTitle() ?? '';
      setTitle(storedTitle);
    };

    // Update title initially
    updateTitleFromStorage();

    // Listen to localStorage changes
    window.addEventListener('storage', updateTitleFromStorage);

    return () => {
      window.removeEventListener('storage', updateTitleFromStorage);
    };
  }, [getTitle]);

  return (
    <div className="min-h-screen flex">
      <LeftSideBar />
      <div className="flex-1 flex flex-col">
        <Header onClickMenu={onClickMenu} title={title} />
        <main className="flex-1 p-6">{children}</main>
        <Footer />
      </div>
      <RightSideBar isOpen={isOpen} onClose={onCloseDrawer} />
    </div>
  );
};

export default AppLayout;
