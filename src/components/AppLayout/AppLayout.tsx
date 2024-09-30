import React, { ReactNode, useCallback, useState } from 'react';
import { Header } from '../Header';
import { LeftSideBar, RightSideBar } from '../SideBar';
import { Footer } from '../Footer';

interface LayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onCloseDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onClickMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex">
      <LeftSideBar />
      <div className="flex-1 flex flex-col">
        <Header onClickMenu={onClickMenu} />
        <main className="flex-1 p-6">{children}</main>
        <Footer />
      </div>
      <RightSideBar isOpen={isOpen} onClose={onCloseDrawer} />
    </div>
  );
};

export default AppLayout;
