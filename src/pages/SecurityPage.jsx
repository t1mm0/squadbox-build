import React from 'react';
import { Container, Title, Text, Card, List, Group, Badge } from '@mantine/core';
import { IconShield } from '@tabler/icons-react';

const SecurityPage = () => (
  <Container size="xl" py="xl">
    <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
      <IconShield size={32} color="var(--mantine-color-brand-6)" />
      Security
    </Title>

    <Card p="xl" withBorder>
      <Group mb="md">
        <Badge color="green" variant="light">Encryption</Badge>
        <Badge color="blue" variant="light">Access Control</Badge>
        <Badge color="violet" variant="light">Compliance</Badge>
      </Group>
      <List spacing="xs">
        <List.Item>Transport: HTTPS/TLS 1.2+ with HSTS; Certificates via trusted CAs.</List.Item>
        <List.Item>At rest: Encrypted storage for credentials, JWT secrets, and database backups.</List.Item>
        <List.Item>Authentication: JWT with 128‑char key, refresh rotation, role‑based access.</List.Item>
        <List.Item>Infrastructure: Principle of least privilege, audit logs, rate limiting, WAF.</List.Item>
        <List.Item>Data: Regional residency on request, right to erasure supported.</List.Item>
      </List>
      <Text size="sm" c="dimmed" mt="md">Report security issues: security@squadbox.uk</Text>
    </Card>
  </Container>
);

export default SecurityPage;


