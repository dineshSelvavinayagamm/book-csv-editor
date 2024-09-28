'use client';

import { Flex, Switch, Text } from '@radix-ui/themes';
import { useTheme } from 'next-themes';
import React, { ReactNode, useCallback, useState } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Header = ({ children }: LayoutProps) => {
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
    <div className="flex-1">
      <header className="sticky top-0 z-10 shadow-md p-4">
        <Flex direction="row" justify="between" align="center">
          <h1 className="text-xl font-bold">My Sticky Header</h1>
          <Flex direction="row" gap="1" align="center">
            <Text>Dark theme</Text>
            <Switch checked={checked} onCheckedChange={onCheckedChange} />
          </Flex>
        </Flex>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Header;
