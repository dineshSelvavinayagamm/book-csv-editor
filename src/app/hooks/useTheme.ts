'use client';

import { ThemeContext } from '@radix-ui/themes/components/theme';
import { useContext } from 'react';

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }

  return context;
};
