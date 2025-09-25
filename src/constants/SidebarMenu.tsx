'use client';
import React from 'react';
import { ValueIcon } from '@radix-ui/react-icons';
import { Navigation } from './Navigations';

export const SIDE_BAR_MENU = [
  {
    title: 'Home',
    icon: 'https://img.icons8.com/?size=100&id=83326&format=png&color=ffffff',
    items: [{ title: 'Dashboard', route: Navigation.Home, icon: <ValueIcon /> }],
  },
  {
    title: 'CSV Editor',
    icon: 'https://img.icons8.com/?size=100&id=83326&format=png&color=ffffff',
    items: [{ title: 'CSV Dashboard', route: Navigation.CSV, icon: <ValueIcon /> }],
  },
];
