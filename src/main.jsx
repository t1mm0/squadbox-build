import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';
import TestApp from './TestApp';
import SimpleApp from './SimpleApp';
import ProgressiveApp from './ProgressiveApp';
import { AuthProvider } from './AuthContext';
import ErrorBoundary from './ErrorBoundary';
import './index.css';
import './minimal.css';
// Import only the CSS we need
// import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// Create custom Mantine theme optimized for dark mode
const theme = createTheme({
  colors: {
    brand: [
      '#ecf4ff',
      '#dce4f5',
      '#b9c7e2',
      '#94a8d0',
      '#748dc0',
      '#5f7cb7',
      '#5474b4',
      '#44639f',
      '#3a5890',
      '#2c4b80'
    ],
  },
  primaryColor: 'brand',
  primaryShade: 6, // Using shade 6 which is #5474b4 (the primary color from URL)
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  defaultRadius: 'md',
  // Dark mode optimized color scheme
  colorScheme: 'dark',
  components: {
    AppShell: {
      defaultProps: {
        bg: 'var(--mantine-color-dark-8)',
      },
    },
    Paper: {
      defaultProps: {
        bg: 'var(--mantine-color-dark-7)',
        c: 'var(--mantine-color-gray-0)',
      },
    },
    Card: {
      defaultProps: {
        bg: 'var(--mantine-color-dark-7)',
        c: 'var(--mantine-color-gray-0)',
      },
    },
    Button: {
      defaultProps: {
        variant: 'filled',
      },
    },
    TextInput: {
      defaultProps: {
        bg: 'var(--mantine-color-dark-6)',
        c: 'var(--mantine-color-gray-0)',
      },
    },
    Textarea: {
      defaultProps: {
        bg: 'var(--mantine-color-dark-6)',
        c: 'var(--mantine-color-gray-0)',
      },
    },
  },
});

const Root = () => {
  useEffect(() => {
    document.title = 'Squadbox | Build Apps with AI';
    // Force dark mode on document
    document.documentElement.setAttribute('data-mantine-color-scheme', 'dark');
    document.documentElement.style.colorScheme = 'dark';
  }, []);
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark" forceColorScheme="dark" withCssVariables>
      <Notifications position="top-right" />
      <ErrorBoundary>
        <ProgressiveApp />
      </ErrorBoundary>
    </MantineProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
