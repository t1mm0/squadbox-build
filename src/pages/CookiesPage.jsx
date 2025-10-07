import React from 'react';
import { Container, Title, Text, Card, List } from '@mantine/core';
import { IconCookie } from '@tabler/icons-react';

const CookiesPage = () => (
  <Container size="xl" py="xl">
    <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
      <IconCookie size={32} color="var(--mantine-color-brand-6)" />
      Cookie Policy
    </Title>
    <Card p="xl" withBorder>
      <Text c="dimmed" mb="md">We use cookies and similar technologies to provide and improve the Service.</Text>
      <List spacing="xs" mb="md">
        <List.Item>Essential: required for authentication and core functionality.</List.Item>
        <List.Item>Analytics: help us understand usage to improve performance.</List.Item>
        <List.Item>Preferences: remember your settings and theme.</List.Item>
      </List>
      <Title order={2} mb="sm">Your Choices</Title>
      <Text c="dimmed">You can control cookies via your browser settings. Disabling essential cookies may impact functionality.</Text>
    </Card>
  </Container>
);

export default CookiesPage;


