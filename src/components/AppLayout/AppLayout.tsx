import React, { ReactNode, useCallback, useState } from 'react';
import { Header } from '../Header';
import { LeftSideBar, RightSideBar } from '../SideBar';

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
      <div className="flex-1">
        <Header onClickMenu={onClickMenu} />
        <main className="p-6">{children}</main>
      </div>
      <RightSideBar isOpen={isOpen} onClose={onCloseDrawer} />
    </div>
  );
};

export default AppLayout;
