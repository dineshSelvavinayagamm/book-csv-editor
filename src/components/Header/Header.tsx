import React from 'react';
import { Box, Flex, TextField } from '@radix-ui/themes';
import { AvatarIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

interface HeaderProps {
  onClickMenu: () => void;
  title: string;
}

const Header = ({ onClickMenu, title }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-10 shadow-md p-4 bg-white">
      <Flex direction="row" justify="between" align="center">
        <h1 className="text-xl font-bold">{title}</h1>
        <Flex direction="row" gap="4" align="center">
          <TextField.Root placeholder="Search the docs…">
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
          <Box onClick={onClickMenu}>
            <AvatarIcon height="18" width="18" />
          </Box>
        </Flex>
      </Flex>
    </header>
  );
};

export default Header;
