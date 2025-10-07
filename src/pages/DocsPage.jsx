import React from 'react';
import { Container, Title, Text, Card, List } from '@mantine/core';
import { IconBook } from '@tabler/icons-react';

const DocsPage = () => (
  <Container size="xl" py="xl">
    <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
      <IconBook size={32} color="var(--mantine-color-brand-6)" />
      Documentation
    </Title>
    <Card p="lg" withBorder>
      <Text c="dimmed" mb="md">Start here to learn how to build with Squadbox.</Text>
      <List spacing="xs">
        <List.Item>Getting Started</List.Item>
        <List.Item>Templates & Requirements</List.Item>
        <List.Item>Deployments</List.Item>
        <List.Item>API</List.Item>
      </List>
    </Card>
  </Container>
);

export default DocsPage;


