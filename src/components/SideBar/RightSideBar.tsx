'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Flex, IconButton, Switch, Text } from '@radix-ui/themes';
import { useTheme } from 'next-themes';
import React, { useCallback, useState } from 'react';

interface RightSideBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const RightSideBar = ({ isOpen, onClose }: RightSideBarProps) => {
  const { setTheme } = useTheme();
  const [checked, setChecked] = useState<boolean>(false);
  const onCheckedChange = useCallback(
    (value: boolean) => {
      setChecked(value);
      if (value) {
        setTheme('dark');
      } else {
        setTheme('light');
      }
    },
    [setTheme],
  );
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40" onClick={onClose} />}

      <div
        className={`fixed top-0 right-0 h-full bg-tertiary text-primary p-4 shadow-lg z-50 transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '250px' }}
      >
        <Flex direction="row" justify="end">
          <IconButton onClick={onClose}>
            <Cross2Icon />
          </IconButton>
        </Flex>
        <Flex direction="row" gap="1" align="center">
          <Text>Dark theme</Text>
          <Switch checked={checked} onCheckedChange={onCheckedChange} />
        </Flex>
      </div>
    </>
  );
};

export default RightSideBar;
