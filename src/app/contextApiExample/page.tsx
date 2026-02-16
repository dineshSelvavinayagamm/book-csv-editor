'use client';

import { useTheme } from '@/context/ThemeContext';
import { useAppHeader } from '../hooks/appHeader';
import { useEffect } from 'react';
import { PageTitle } from '@/constants/PageTitle';

const ContextApiExample = () => {
  const { updateTitle } = useAppHeader();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    updateTitle(PageTitle.ContextApiExample);
  }, [updateTitle]);

  return (
    <div
      className={`
        h-screen overflow-hidden flex items-center justify-center
        transition-colors duration-500
        ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-900 text-white'}
      `}
    >
      <div
        className={`
          p-8 rounded-2xl shadow-xl text-center transition-all duration-500
          ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}
        `}
      >
        <h2 className="text-2xl font-semibold mb-6">Current Theme: {theme}</h2>

        <button
          onClick={toggleTheme}
          className={`
            px-6 py-2 rounded-lg font-medium transition-all duration-300
            ${
              theme === 'light'
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-white text-black hover:bg-gray-200'
            }
            active:scale-95 shadow-md
          `}
        >
          Toggle Theme
        </button>
      </div>
    </div>
  );
};

export default ContextApiExample;
