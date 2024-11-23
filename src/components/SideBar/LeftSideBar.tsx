'use client';

import React, { useCallback, useState } from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { AppAccordion } from '../Accordion';
import { SIDE_BAR_MENU } from '@/constants';
import { IconButton } from '@radix-ui/themes';

const LeftSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <nav
      className={`h-screen sticky top-0 bg-tertiary text-[#eaeaea] shadow-lg transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="p-4 flex items-center justify-between bg-[#1e272e]">
        <button
          onClick={toggleSidebar}
          className={`text-small font-bold transition-opacity duration-300 ${
            isCollapsed ? 'opacity-0 hidden' : 'opacity-100'
          }`}
        >
          Nexycare Diagnostics
        </button>

        <IconButton
          onClick={toggleSidebar}
          className="text-[#eaeaea] hover:bg-[#3e444a] rounded-full p-2"
        >
          <HamburgerMenuIcon />
        </IconButton>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#3c3e44]">
        <AppAccordion data={SIDE_BAR_MENU} isCollapsed={isCollapsed} />
      </div>
    </nav>
  );
};

export default LeftSideBar;
