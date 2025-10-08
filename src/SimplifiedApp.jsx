import React, { useState } from 'react';
import { 
  AppShell,
  Container,
  Text,
  Button,
  Group,
  Title,
  SimpleGrid,
  Card,
  Badge,
  Box
} from '@mantine/core';
import { IconBuildingSkyscraper, IconRobot, IconShield, IconBrain } from '@tabler/icons-react';
import { useAuth } from './SimpleAuthContext';

function SimplifiedApp() {
  const { isAuthenticated, currentUser } = useAuth();
  const [view, setView] = useState('index');

  // Simple navigation
  const handleLogin = () => {
    console.log('Login clicked');
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

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
              <Button onClick={handleLogin}>
                Login
              </Button>
            )}
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Title order={1} c="white" mb="xl" ta="center">
            Build Apps with AI
          </Title>
          
          <Text size="lg" c="dimmed" mb="xl" ta="center">
            Our specialized AI bots work together to transform your ideas into production-ready applications.
          </Text>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md" mb="xl">
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

            <Card shadow="sm" padding="lg" radius="md" withBorder style={{ backgroundColor: '#2a2a2a' }}>
              <Group justify="space-between" mb="xs">
                <Text weight={500} c="white">Designer Bot</Text>
                <IconBrain size="1.5rem" color="#5474b4" />
              </Group>
              <Text size="sm" c="dimmed">
                Creates beautiful user interfaces
              </Text>
            </Card>
          </SimpleGrid>

          <Group justify="center" mt="xl">
            <Button size="lg" onClick={() => setView('ai-dev-squad')}>
              Start Building
            </Button>
            <Button variant="outline" size="lg" onClick={() => setView('features')}>
              Learn More
            </Button>
          </Group>

          {isAuthenticated && (
            <Box mt="xl" p="md" style={{ backgroundColor: '#2a2a2a', borderRadius: '8px' }}>
              <Text size="sm" c="dimmed">
                Welcome back, {currentUser?.email || 'User'}!
              </Text>
            </Box>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default SimplifiedApp;
