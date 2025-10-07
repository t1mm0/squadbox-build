import React from 'react';
import { Container, Title, Text, Card, List, Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

const DisclaimerPage = () => (
  <Container size="xl" py="xl">
    <Title order={1} ta="center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: '-10px', marginBottom: 'calc(var(--mantine-spacing-xl) - 10px)' }}>
      <IconAlertCircle size={32} color="var(--mantine-color-brand-6)" />
      Disclaimer
    </Title>

    <Card p="xl" withBorder>
      <Alert color="yellow" mb="md" variant="light">Generated outputs require review and testing before production use.</Alert>
      <Text c="dimmed" mb="md">
        Squadbox generates application code based on your inputs. While we strive for quality, you are solely responsible for
        reviewing, testing, securing, and deploying any generated code.
      </Text>
      <List spacing="xs">
        <List.Item>No warranty of fitness for a particular purpose.</List.Item>
        <List.Item>No guarantee that outputs comply with laws, regulations, or third‑party licenses.</List.Item>
        <List.Item>You must validate dependencies, environment variables, and security settings.</List.Item>
        <List.Item>Use of generated code is at your own risk.</List.Item>
      </List>
    </Card>
  </Container>
);

export default DisclaimerPage;


