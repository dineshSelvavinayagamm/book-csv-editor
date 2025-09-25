import * as Collapsible from '@radix-ui/react-collapsible';
import React from 'react';

export default function CollapsibleDemo() {
  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger className="p-2 bg-blue-500 text-white rounded">
        {open ? 'Collapse' : 'Expand'}
      </Collapsible.Trigger>
      <Collapsible.Content className="p-4 border rounded mt-2">
        <p>This is the collapsible content.</p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
