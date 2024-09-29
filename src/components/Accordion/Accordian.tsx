import React, { useCallback, useState } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import Link from 'next/link';
import AccordionItem from './AccordianItem';
import AccordionTrigger from './AccordianTrigger';
import AccordionContent from './AccordianContent';

interface MenuItem {
  title: string;
  route: string;
}

interface AppAccordionProps {
  data: {
    title: string;
    route?: string;
    items?: MenuItem[];
  }[];
}

const AppAccordion: React.FC<AppAccordionProps> = ({ data }) => {
  const [selectedMenu, setSelectedMenu] = useState<MenuItem>({
    route: '',
    title: '',
  });
  const onChangeMenu = useCallback((menu: MenuItem) => {
    setSelectedMenu(menu);
  }, []);
  return (
    <Accordion.Root
      className="bg-tertiary"
      type="single"
      defaultValue="item-1"
      collapsible
    >
      {data.map((item) => (
        <div key={item.title}>
          {item?.items && item?.items?.length > 0 ? (
            <AccordionItem value={item.title} key={item.title} className="bg-tertiary">
              <AccordionTrigger showIcon className="data-[state=open]:bg-[#FFFFFF1A]">
                {item.title}
              </AccordionTrigger>
              {item.items.map((menu) => (
                <Link key={menu.title} href={item?.route ?? ''} passHref>
                  <AccordionContent
                    // eslint-disable-next-line react/jsx-no-bind
                    onClick={() => onChangeMenu(menu)}
                    className={`text-textSecondary cursor-pointer ${selectedMenu.title === menu.title ? 'bg-primary' : ''}`}
                  >
                    {menu.title}
                  </AccordionContent>
                </Link>
              ))}
            </AccordionItem>
          ) : (
            <AccordionItem value={item.title} key={item.title} className="bg-tertiary">
              <Link href={item?.route ?? ''} passHref>
                <AccordionTrigger
                  showIcon={false}
                  className="data-[state=open]:bg-[var(--primary)]"
                >
                  {item.title}
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
