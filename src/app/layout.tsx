import type { Metadata } from 'next';
import React from 'react';
import localFont from 'next/font/local';
import { Theme } from '@radix-ui/themes';
import '@radix-ui/themes/styles.css';
import './globals.css';
import { ApiProvider, AppThemeProvider, AuThProvider } from '@/provider';

import ReduxProvider from '@/redux-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});

const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Notion Press Media',
  description: 'Notion Press Media',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApiProvider>
          <AppThemeProvider>
            <Theme>
              <AuThProvider>
                <ReduxProvider>{children}</ReduxProvider>
              </AuThProvider>
            </Theme>
          </AppThemeProvider>
        </ApiProvider>
      </body>
    </html>
  );
};

export default RootLayout;
