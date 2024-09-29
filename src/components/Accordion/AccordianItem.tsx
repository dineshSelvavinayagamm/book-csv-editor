import React, { forwardRef } from 'react';
import classNames from 'classnames';
import * as Accordion from '@radix-ui/react-accordion';

interface AccordionItemProps
  extends React.ComponentPropsWithoutRef<typeof Accordion.Item> {
  children: React.ReactNode;
  className?: string;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Item
      className={classNames(
        'mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  ),
);

AccordionItem.displayName = 'AccordionItem';

export default AccordionItem;
