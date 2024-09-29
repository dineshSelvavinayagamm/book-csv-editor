import React, { forwardRef } from 'react';
import classNames from 'classnames';
import * as Accordion from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';

interface AccordionTriggerProps
  extends React.ComponentPropsWithoutRef<typeof Accordion.Trigger> {
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, showIcon, ...props }, forwardedRef) => (
    <Accordion.Header className="flex mb-1.5">
      <Accordion.Trigger
        className={classNames(
          'text-textSecondary group flex h-[45px] flex-1 cursor-default items-center px-2 justify-between bg-tertiary leading-none outline-none',
          className,
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        {showIcon && (
          <ChevronDownIcon
            className="text-textSecondary ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"
            aria-hidden
          />
        )}
      </Accordion.Trigger>
    </Accordion.Header>
  ),
);

AccordionTrigger.displayName = 'AccordionTrigger';
export default AccordionTrigger;
