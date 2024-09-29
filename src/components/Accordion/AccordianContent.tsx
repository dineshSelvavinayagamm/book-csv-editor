import React, { forwardRef } from 'react';
import classNames from 'classnames';
import * as Accordion from '@radix-ui/react-accordion';

interface AccordionContentProps
  extends React.ComponentPropsWithoutRef<typeof Accordion.Content> {
  children: React.ReactNode;
  className?: string;
}

const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames(
        'data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="py-[10px] px-5">{children}</div>
    </Accordion.Content>
  ),
);

AccordionContent.displayName = 'AccordionContent';

export default AccordionContent;
