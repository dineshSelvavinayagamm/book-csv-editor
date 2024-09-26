import { ReactNode } from 'react';
import { Header } from '../Header';
import { SideBar } from '../SideBar';

interface LayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex">
        <SideBar />
        <Header>
            {children}
        </Header>
    </div>
  );
}

export default AppLayout;
