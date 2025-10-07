/*
 * ThemeToggle.jsx
 * Purpose: Floating theme toggle for dark/light mode switching
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import React, { useState, useEffect } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { useMantineColorScheme } from '@mantine/core';

const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{
      position: 'fixed',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <Tooltip label={`Switch to ${colorScheme === 'dark' ? 'light' : 'dark'} mode`} position="left">
        <ActionIcon
          onClick={() => toggleColorScheme()}
          variant="filled"
          size="lg"
          style={{
            backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
            backdropFilter: 'blur(10px)',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = colorScheme === 'dark' 
              ? 'rgba(255, 255, 255, 0.2)' 
              : 'rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = colorScheme === 'dark' 
              ? 'rgba(255, 255, 255, 0.1)' 
              : 'rgba(0, 0, 0, 0.1)';
          }}
        >
          {colorScheme === 'dark' ? (
            <IconSun size={20} style={{ color: '#fbbf24' }} />
          ) : (
            <IconMoon size={20} style={{ color: '#6366f1' }} />
          )}
        </ActionIcon>
      </Tooltip>
    </div>
  );
};

export default ThemeToggle;
