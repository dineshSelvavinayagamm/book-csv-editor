import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Header = ({ children }: LayoutProps) => {
  return (
    <div className="flex-1">
      <header className="sticky top-0 z-10 bg-white shadow-md p-4">
        <h1 className="text-xl font-bold">My Sticky Header</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}

export default Header;
 