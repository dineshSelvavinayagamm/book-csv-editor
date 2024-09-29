'use client';

import { AppLayout } from '@/components';
import { UNAUTHENTICATED_ROUTES } from '@/config';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

interface AppThemeProviderProps {
  children: ReactNode;
}

const AuThProvider = ({ children }: AppThemeProviderProps) => {
  const pathname = usePathname();
  return (
    <div>
      {UNAUTHENTICATED_ROUTES.includes(pathname) ? (
        children
      ) : (
        <AppLayout>{children}</AppLayout>
      )}
    </div>
  );
};

export default AuThProvider;
