'use client';
import { useTheme } from '@/context/ThemeContext';
import { useAppHeader } from '../hooks/appHeader';
import { useEffect } from 'react';
import { PageTitle } from '@/constants/PageTitle';

const ContextApiExample = () => {
  const { updateTitle } = useAppHeader();
  useEffect(() => {
    updateTitle(PageTitle.ContextApiExample);
  }, [updateTitle]);
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      style={{
        backgroundColor: theme === 'light' ? '#ffffff' : '#1e1e1e',
        color: theme === 'light' ? '#000000' : '#ffffff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <h2>Current Theme: {theme}</h2>
        <button
          onClick={toggleTheme}
          style={{
            padding: '10px 20px',
            marginTop: '10px',
            cursor: 'pointer',
          }}
        >
          Toggle
        </button>
      </div>
    </div>
  );
};

export default ContextApiExample;
