'use client';

import React from 'react';
import { ValueIcon } from '@radix-ui/react-icons';

// icon will support both URL or children
export const SIDE_BAR_MENU = [
  {
    title: 'Home',
    icon: 'https://img.icons8.com/?size=100&id=83326&format=png&color=ffffff',
    items: [
      { title: 'Dashboard 1', route: '/', icon: <ValueIcon /> },
      { title: 'Dashboard 2', route: '/', icon: <ValueIcon /> },
    ],
  },
  {
    title: 'Settings',
    icon: 'https://img.icons8.com/?size=100&id=83326&format=png&color=ffffff',
    items: [
      { title: 'Settings 1', route: '/', icon: <ValueIcon /> },
      { title: 'Settings 2', route: '/', icon: <ValueIcon /> },
    ],
  },
  {
    title: 'About Us',
    icon: 'https://img.icons8.com/?size=100&id=83326&format=png&color=ffffff',
    route: '/',
  },
];
