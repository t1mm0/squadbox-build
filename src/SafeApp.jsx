import React, { useState, useEffect } from 'react';
import { 
  AppShell,
  Container,
  Tabs,
  Text,
  Button,
  TextInput,
  Textarea,
  Paper,
  Grid,
  SimpleGrid,
  Card,
  Badge,
  Group,
  Title,
  Box,
  Image,
  Loader,
  Menu,
  UnstyledButton,
  Avatar,
  Divider,
  ActionIcon,
  Switch,
  Select,
  Modal,
  Stack,
  List,
  ThemeIcon,
  ColorSwatch
} from '@mantine/core';
import { IconBuildingSkyscraper, IconFolder, IconReceipt, IconEye, IconBrain, IconStar, IconCrown, IconLock, IconShield, IconHelp, IconRobot } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';

function SafeApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('index');

  // Mock auth functions
  const isAuthenticated = !!currentUser;
  const authLoading = loading;

  const handleLogin = async (email, password) => {
    console.log('Login attempt:', email);
    setCurrentUser({ email, id: 'mock-user' });
    return { success: true };
  };

  const handleLogout = async () => {
    console.log('Logout');
    setCurrentUser(null);
  };

  const handleRegister = async (email, password, username) => {
    console.log('Register attempt:', email, username);
    setCurrentUser({ email, id: 'mock-user', username });
    return { success: true };
  };

  // Public marketing/legal views allowed before login
  const publicViews = new Set([
    'index', 'ai-dev-squad', 'tech', 'features', 'pricing', 'docs', 'community', 'security', 'api', 'about', 'support',
    'privacy', 'terms', 'beta-nda', 'liability', 'cookies', 'contact', 'blog'
  ]);

  // Check if should show auth page (without early return)
  const shouldShowAuthPage = !isAuthenticated && !publicViews.has(view) && !authLoading;

  console.log('SafeApp render state:', {
    shouldShowAuthPage,
    view,
    authLoading,
    isAuthenticated
  });

  // Force public pages to always show, even if auth is loading
  if (publicViews.has(view) && authLoading) {
    console.log('Forcing public page display despite auth loading');
    // Continue to render the page
  }

  // Show auth page for protected routes
  if (shouldShowAuthPage) {
    return (
      <Container size="lg" style={{ marginTop: 100, textAlign: 'center' }}>
        <Text size="xl" fw={700}>Please log in to continue</Text>
        <Button 
          onClick={() => handleLogin('test@example.com', 'password')}
          style={{ marginTop: 20 }}
        >
          Mock Login
        </Button>
      </Container>
    );
  }

  // Main app content
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
      style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
    >
      <AppShell.Header style={{ backgroundColor: '#2a2a2a', borderBottom: '1px solid #333' }}>
        <Group h="100%" px="md">
          <Text size="lg" fw={700} c="white">
            🚀 Squadbox
          </Text>
          <Group ml="auto">
            {isAuthenticated ? (
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button onClick={() => handleLogin('test@example.com', 'password')}>
                Login
              </Button>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Title order={1} c="white" mb="xl">
            Welcome to Squadbox
          </Title>
          
          <Text size="lg" c="dimmed" mb="xl">
            Build production-grade apps with AI in minutes
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: '#2a2a2a' }}>
              <Group justify="space-between" mb="xs">
                <Text weight={500} c="white">Builder Bot</Text>
                <IconRobot size="1.5rem" color="#5474b4" />
              </Group>
              <Text size="sm" c="dimmed">
                Creates your app structure and components
              </Text>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: '#2a2a2a' }}>
              <Group justify="space-between" mb="xs">
                <Text weight={500} c="white">Deployer Bot</Text>
                <IconBuildingSkyscraper size="1.5rem" color="#5474b4" />
              </Group>
              <Text size="sm" c="dimmed">
                Handles deployment and infrastructure
              </Text>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: '#2a2a2a' }}>
              <Group justify="space-between" mb="xs">
                <Text weight={500} c="white">Security Bot</Text>
                <IconShield size="1.5rem" color="#5474b4" />
              </Group>
              <Text size="sm" c="dimmed">
                Ensures security best practices
              </Text>
            </Card>
          </SimpleGrid>

          <Group mt="xl">
            <Button size="lg" onClick={() => setView('ai-dev-squad')}>
              Start Building
            </Button>
            <Button variant="outline" size="lg" onClick={() => setView('features')}>
              Learn More
            </Button>
          </Group>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default SafeApp;
