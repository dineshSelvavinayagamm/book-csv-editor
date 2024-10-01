"use client"

import React, { useCallback, useState } from 'react';
import {HamburgerMenuIcon} from '@radix-ui/react-icons';
import { AppAccordion } from '../Accordion';
import { SIDE_BAR_MENU } from '@/constants';
import { Flex, IconButton } from '@radix-ui/themes';

const LeftSideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  return (
    <nav
      className={`h-screen sticky top-0 bg-tertiary transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <Flex className='m-2'>
        <IconButton onClick={toggleSidebar}>
          <HamburgerMenuIcon />
        </IconButton>
      </Flex>
      <AppAccordion data={SIDE_BAR_MENU} isCollapsed={isCollapsed} />
    </nav>
  );
};

export default LeftSideBar;
