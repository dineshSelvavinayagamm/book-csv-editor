'use client';

import React, { ReactNode, useCallback, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import Link from 'next/link';
import AccordionItem from './AccordianItem';
import AccordionTrigger from './AccordianTrigger';
import AccordionContent from './AccordianContent';
import MenuTitleContainer from './MenuTitleContainer';

interface MenuItem {
  title: string;
  route: string;
  icon?: string | ReactNode;
}

interface AppAccordionProps {
  data: {
    title: string;
    route?: string;
    icon?: string | ReactNode;
    items?: MenuItem[];
  }[];
  isCollapsed?: boolean;
}

const AppAccordion: React.FC<AppAccordionProps> = ({ data, isCollapsed }) => {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem>({
    route: '',
    title: '',
  });

  const onChangeMenu = useCallback((menu: MenuItem) => {
    setSelectedMenu(menu);
  }, []);

  return (
    <Accordion.Root
      className={`bg-gray-900 text-white transition-all duration-300 ease-in-out`}
      type="single"
      defaultValue="item-1"
      collapsible
    >
      {data.map((item) => (
        <div key={item.title}>
          {item?.items && item?.items?.length > 0 ? (
            <AccordionItem value={item.title} className="bg-gray-800">
              <AccordionTrigger
                showIcon={!isCollapsed}
                className={`flex items-center justify-between px-4 py-2 rounded hover:bg-gray-700 ${
                  isCollapsed ? 'justify-center' : ''
                }`}
              >
                <MenuTitleContainer
                  title={item?.title}
                  icon={item?.icon}
                  isCollapsed={isCollapsed}
                />
              </AccordionTrigger>
              {!isCollapsed && (
                <Accordion.Content className="pl-6 space-y-1">
                  {item.items.map((menu) => (
                    <Link key={menu.title} href={menu?.route ?? ''} passHref>
                      <AccordionContent
                        onClick={() => onChangeMenu(menu)}
                        className={`block px-4 py-1 rounded cursor-pointer text-sm ${
                          selectedMenu.title === menu.title
                            ? 'bg-[#5b636b] text-white'
                            : 'hover:bg-[#808993] hover:text-[#ffffff]'
                        }`}
                      >
                        <MenuTitleContainer
                          title={menu?.title}
                          icon={menu?.icon}
                          isCollapsed={isCollapsed}
                        />
                      </AccordionContent>
                    </Link>
                  ))}
                </Accordion.Content>
              )}
            </AccordionItem>
          ) : (
            <AccordionItem value={item.title} className="bg-gray-800">
              <Link href={item?.route ?? ''} passHref>
                <AccordionTrigger
                  showIcon={false}
                  className={`flex items-center px-4 py-2 rounded hover:bg-gray-700 ${
                    isCollapsed ? 'justify-center' : ''
                  }`}
                >
                  <MenuTitleContainer
                    title={item?.title}
                    icon={item?.icon}
                    isCollapsed={isCollapsed}
                  />
                </AccordionTrigger>
              </Link>
            </AccordionItem>
          )}
        </div>
      ))}
    </Accordion.Root>
  );
};

export default AppAccordion;
