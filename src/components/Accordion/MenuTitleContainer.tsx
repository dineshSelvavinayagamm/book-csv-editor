import React, { ReactNode } from 'react';
import { Flex, Text } from '@radix-ui/themes';
import Image from 'next/image';

interface MenuTitleContainerProps {
  title: string;
  isCollapsed?: boolean;
  icon?: string | ReactNode;
}

const MenuTitleContainer = ({ icon, title, isCollapsed }: MenuTitleContainerProps) => {
  return (
    <Flex direction="row" gap={'2'} align="center">
      {icon && (
        <div>
          {typeof icon === 'string' ? (
            <Image
              unoptimized
              src={icon}
              height={25}
              width={25}
              objectFit="contain"
              alt={title}
            />
          ) : (
            icon
          )}
        </div>
      )}
      {!isCollapsed && <Text>{title}</Text>}
    </Flex>
  );
};

export default MenuTitleContainer;
