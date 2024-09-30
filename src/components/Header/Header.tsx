'use client';

import { Box, Flex, Text, TextField } from '@radix-ui/themes';
import React from 'react';
import {
  ChatBubbleIcon,
  BellIcon,
  AvatarIcon,
  MagnifyingGlassIcon,
} from '@radix-ui/react-icons';

interface HeaderProps {
  onClickMenu: () => void;
}

const Header = ({ onClickMenu }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 shadow-md p-4 bg-white">
      <Flex direction="row" justify="between" align="center">
        <h1 className="text-xl font-bold">Nexicare Diagnostics</h1>
        <Flex direction="row" gap="4" align="center">
          <TextField.Root placeholder="Search the docs…">
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          <Box position="relative">
            <ChatBubbleIcon height="18" width="18" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-center rounded-full w-4 h-4 flex items-center justify-center text-[0.6rem]">
              <Text className="text-center">10</Text>
            </div>
          </Box>
          <Box position="relative">
            <BellIcon height="18" width="18" />
            <div className="absolute -top-2 -right-2 bg-red-500 text-center text-white rounded-full w-4 h-4 flex items-center justify-center text-[0.6rem]">
              <Text className="text-center">12</Text>
            </div>
          </Box>
          <Box onClick={onClickMenu}>
            <AvatarIcon height="18" width="18" />
          </Box>
        </Flex>
      </Flex>
    </header>
  );
};

export default Header;
