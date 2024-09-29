'use client';

import { Flex, IconButton } from '@radix-ui/themes';
import React from 'react';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';

interface LayoutProps {
  onClickMenu: () => void;
}

const Header = ({ onClickMenu }: LayoutProps) => {
  return (
    <header className="sticky top-0 z-10 shadow-md p-4">
      <Flex direction="row" justify="between" align="center">
        <h1 className="text-xl font-bold">My Sticky Header</h1>
        <Flex direction="row" gap="1" align="center">
          <IconButton onClick={onClickMenu}>
            <HamburgerMenuIcon />
          </IconButton>
        </Flex>
      </Flex>
    </header>
  );
};

export default Header;
