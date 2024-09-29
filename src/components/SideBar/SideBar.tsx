'use client';

import React from 'react';
import { AppAccordion } from '../Accordion';
import { SIDE_BAR_MENU } from '@/constants';

const SideBar = () => {
  return (
    <nav className="w-64 h-screen sticky top-0 bg-tertiary p-4">
      <AppAccordion data={SIDE_BAR_MENU} />
    </nav>
  );
};

export default SideBar;
