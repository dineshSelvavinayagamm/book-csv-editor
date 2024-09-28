'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideBar = () => {
  const pathname = usePathname();

  return (
    <nav className="w-64 h-screen sticky top-0 bg-gray-100 p-4">
      <ul className="space-y-4">
        <li>
          <Link href="/" passHref>
            <p className={`block p-2 rounded ${pathname === '/' ? 'bg-blue-500' : ''}`}>
              Home
            </p>
          </Link>
        </li>
        <li>
          <Link href="/section1" passHref>
            <p
              className={`block p-2 rounded ${
                pathname === '/section1' ? 'bg-blue-500' : ''
              }`}
            >
              Section 1
            </p>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default SideBar;
